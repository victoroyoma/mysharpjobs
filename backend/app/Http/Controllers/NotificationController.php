<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Notification;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated user
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            $query = Notification::where('user_id', $user->id)
                ->notExpired()
                ->latest();

            // Filter by read status
            if ($request->has('is_read')) {
                $isRead = filter_var($request->is_read, FILTER_VALIDATE_BOOLEAN);
                $query->where('is_read', $isRead);
            }

            // Filter by type
            if ($request->has('type')) {
                $query->ofType($request->type);
            }

            // Filter by priority
            if ($request->has('priority')) {
                $query->byPriority($request->priority);
            }

            // Pagination
            $perPage = $request->get('per_page', 20);
            $notifications = $query->paginate($perPage);

            // Get unread count
            $unreadCount = Notification::where('user_id', $user->id)
                ->unread()
                ->notExpired()
                ->count();

            return response()->json([
                'status' => 'success',
                'message' => 'Notifications retrieved successfully',
                'data' => $notifications->items(),
                'unread_count' => $unreadCount,
                'pagination' => [
                    'total' => $notifications->total(),
                    'per_page' => $notifications->perPage(),
                    'current_page' => $notifications->currentPage(),
                    'last_page' => $notifications->lastPage(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error fetching notifications: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a single notification
     */
    public function show(Request $request, $id)
    {
        try {
            $user = $request->user();
            
            $notification = Notification::where('user_id', $user->id)
                ->find($id);

            if (!$notification) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Notification not found'
                ], 404);
            }

            // Automatically mark as read when viewed
            if (!$notification->is_read) {
                $notification->markAsRead();
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Notification retrieved successfully',
                'data' => $notification
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error fetching notification: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark a notification as read
     */
    public function markAsRead(Request $request, $id)
    {
        try {
            $user = $request->user();
            
            $notification = Notification::where('user_id', $user->id)
                ->find($id);

            if (!$notification) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Notification not found'
                ], 404);
            }

            $notification->markAsRead();

            return response()->json([
                'status' => 'success',
                'message' => 'Notification marked as read',
                'data' => $notification
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error marking notification as read: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(Request $request)
    {
        try {
            $user = $request->user();
            
            $updated = Notification::where('user_id', $user->id)
                ->unread()
                ->update([
                    'is_read' => true,
                    'read_at' => now()
                ]);

            return response()->json([
                'status' => 'success',
                'message' => 'All notifications marked as read',
                'data' => [
                    'updated_count' => $updated
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error marking notifications as read: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a notification
     */
    public function destroy(Request $request, $id)
    {
        try {
            $user = $request->user();
            
            $notification = Notification::where('user_id', $user->id)
                ->find($id);

            if (!$notification) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Notification not found'
                ], 404);
            }

            $notification->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Notification deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error deleting notification: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete all read notifications
     */
    public function deleteRead(Request $request)
    {
        try {
            $user = $request->user();
            
            $deleted = Notification::where('user_id', $user->id)
                ->where('is_read', true)
                ->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Read notifications deleted successfully',
                'data' => [
                    'deleted_count' => $deleted
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error deleting notifications: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete all notifications
     */
    public function deleteAll(Request $request)
    {
        try {
            $user = $request->user();
            
            $deleted = Notification::where('user_id', $user->id)->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'All notifications deleted successfully',
                'data' => [
                    'deleted_count' => $deleted
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error deleting notifications: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get unread notification count
     */
    public function getUnreadCount(Request $request)
    {
        try {
            $user = $request->user();
            
            $count = Notification::where('user_id', $user->id)
                ->unread()
                ->notExpired()
                ->count();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'unread_count' => $count
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error getting unread count: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a test notification (for development/testing)
     */
    public function createTest(Request $request)
    {
        try {
            $user = $request->user();
            
            $notification = Notification::createNotification(
                $user->id,
                'system',
                'Test Notification',
                'This is a test notification created at ' . now()->format('Y-m-d H:i:s'),
                ['test' => true],
                'medium',
                '/dashboard',
                'View Dashboard'
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Test notification created',
                'data' => $notification
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error creating test notification: ' . $e->getMessage()
            ], 500);
        }
    }
}
