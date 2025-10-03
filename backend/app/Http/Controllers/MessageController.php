<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Events\MessageSent;

class MessageController extends Controller
{
    /**
     * Get all messages for authenticated user
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            $messages = Message::where(function($query) use ($user) {
                $query->where('sender_id', $user->id)
                      ->orWhere('recipient_id', $user->id);
            })
            ->with(['sender', 'recipient'])
            ->orderBy('created_at', 'desc')
            ->paginate(50);

            return response()->json([
                'status' => 'success',
                'data' => $messages
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch messages',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get list of conversations (unique users)
     */
    public function conversations(Request $request)
    {
        try {
            $user = $request->user();

            // Get unique conversation partners with last message
            $conversations = DB::select("
                SELECT 
                    u.id,
                    u.name,
                    u.email,
                    u.avatar,
                    u.type,
                    m.content as last_message,
                    m.created_at as last_message_at,
                    m.is_read,
                    (SELECT COUNT(*) FROM messages 
                     WHERE sender_id = u.id 
                     AND recipient_id = ? 
                     AND is_read = 0) as unread_count
                FROM users u
                INNER JOIN (
                    SELECT 
                        CASE 
                            WHEN sender_id = ? THEN recipient_id
                            ELSE sender_id
                        END as user_id,
                        MAX(created_at) as last_message_time
                    FROM messages
                    WHERE sender_id = ? OR recipient_id = ?
                    GROUP BY user_id
                ) conv ON u.id = conv.user_id
                INNER JOIN messages m ON (
                    (m.sender_id = ? AND m.recipient_id = conv.user_id)
                    OR (m.recipient_id = ? AND m.sender_id = conv.user_id)
                )
                AND m.created_at = conv.last_message_time
                ORDER BY m.created_at DESC
            ", [$user->id, $user->id, $user->id, $user->id, $user->id, $user->id]);

            return response()->json([
                'status' => 'success',
                'data' => $conversations
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch conversations',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get conversation with specific user
     */
    public function conversation(Request $request, $userId)
    {
        try {
            $user = $request->user();

            $messages = Message::betweenUsers($user->id, $userId)
                ->with(['sender', 'recipient'])
                ->orderBy('created_at', 'asc')
                ->paginate(50);

            // Mark messages as read
            Message::where('sender_id', $userId)
                ->where('recipient_id', $user->id)
                ->where('is_read', false)
                ->update(['is_read' => true, 'read_at' => now()]);

            return response()->json([
                'status' => 'success',
                'data' => $messages
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch conversation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send a new message
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'recipient_id' => 'required|exists:users,id',
            'content' => 'required|string|max:1000',
            'message_type' => 'nullable|in:text,image,file,location,system',
            'job_id' => 'nullable|exists:jobs_custom,id',
            'attachments' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = $request->user();

            // Check if trying to message self
            if ($user->id == $request->recipient_id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cannot send message to yourself'
                ], 400);
            }

            $message = Message::create([
                'sender_id' => $user->id,
                'recipient_id' => $request->recipient_id,
                'content' => $request->content,
                'message_type' => $request->message_type ?? 'text',
                'job_id' => $request->job_id,
                'attachments' => $request->attachments ?? [],
                'is_read' => false,
            ]);

            $message->load(['sender', 'recipient']);

            // Broadcast message to both users via WebSocket
            broadcast(new MessageSent($message))->toOthers();

            return response()->json([
                'status' => 'success',
                'message' => 'Message sent successfully',
                'data' => ['message' => $message]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to send message',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark message as read
     */
    public function markAsRead(Request $request, $id)
    {
        try {
            $user = $request->user();
            $message = Message::findOrFail($id);

            // Only recipient can mark as read
            if ($message->recipient_id !== $user->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }

            $message->markAsRead();

            return response()->json([
                'status' => 'success',
                'message' => 'Message marked as read',
                'data' => ['message' => $message]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to mark message as read',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete message
     */
    public function destroy(Request $request, $id)
    {
        try {
            $user = $request->user();
            $message = Message::findOrFail($id);

            // Only sender can delete
            if ($message->sender_id !== $user->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }

            $message->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Message deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete message',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get unread message count
     */
    public function unreadCount(Request $request)
    {
        try {
            $user = $request->user();

            $count = Message::where('recipient_id', $user->id)
                ->where('is_read', false)
                ->count();

            return response()->json([
                'status' => 'success',
                'data' => ['count' => $count]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to get unread count',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
