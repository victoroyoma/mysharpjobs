<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Notification extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'data',
        'is_read',
        'read_at',
        'priority',
        'action_url',
        'action_text',
        'expires_at',
        'metadata',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'data' => 'array',
            'metadata' => 'array',
            'is_read' => 'boolean',
            'read_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns the notification.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to get only unread notifications.
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * Scope to get notifications by type.
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope to get notifications by priority.
     */
    public function scopeByPriority($query, string $priority)
    {
        return $query->where('priority', $priority);
    }

    /**
     * Scope to get non-expired notifications.
     */
    public function scopeNotExpired($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('expires_at')
              ->orWhere('expires_at', '>', Carbon::now());
        });
    }

    /**
     * Mark this notification as read.
     */
    public function markAsRead(): void
    {
        if (!$this->is_read) {
            $this->is_read = true;
            $this->read_at = Carbon::now();
            $this->save();
        }
    }

    /**
     * Mark this notification as unread.
     */
    public function markAsUnread(): void
    {
        if ($this->is_read) {
            $this->is_read = false;
            $this->read_at = null;
            $this->save();
        }
    }

    /**
     * Check if notification is expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at && Carbon::now()->greaterThan($this->expires_at);
    }

    /**
     * Get time elapsed since creation.
     */
    public function getTimeAgo(): string
    {
        return $this->created_at->diffForHumans();
    }

    /**
     * Static method to create a notification.
     */
    public static function createNotification(
        int $userId,
        string $type,
        string $title,
        string $message,
        ?array $data = null,
        string $priority = 'medium',
        ?string $actionUrl = null,
        ?string $actionText = null
    ): self {
        return self::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => $data,
            'priority' => $priority,
            'action_url' => $actionUrl,
            'action_text' => $actionText,
        ]);
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Broadcast notification event when created
        static::created(function ($notification) {
            // Trigger websocket event
            event(new \App\Events\NotificationSent($notification->user_id, [
                'id' => $notification->id,
                'type' => $notification->type,
                'title' => $notification->title,
                'message' => $notification->message,
                'priority' => $notification->priority,
                'is_read' => $notification->is_read,
                'created_at' => $notification->created_at->toISOString(),
                'action_url' => $notification->action_url,
                'action_text' => $notification->action_text,
            ]));
        });
    }
}
