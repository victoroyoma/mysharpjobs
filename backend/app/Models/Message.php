<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Message extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'sender_id',
        'recipient_id',
        'content',
        'message_type',
        'job_id',
        'attachments',
        'is_read',
        'read_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'attachments' => 'array',
            'is_read' => 'boolean',
            'read_at' => 'datetime',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($message) {
            if ($message->isDirty('is_read') && $message->is_read && !$message->read_at) {
                $message->read_at = now();
            }
        });
    }

    /**
     * Get the sender of the message.
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Get the recipient of the message.
     */
    public function recipient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }

    /**
     * Get the job related to this message.
     */
    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class);
    }

    /**
     * Scope a query to only include unread messages.
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * Scope a query to filter messages between two users.
     */
    public function scopeBetweenUsers($query, $userId1, $userId2)
    {
        return $query->where(function ($q) use ($userId1, $userId2) {
            $q->where('sender_id', $userId1)->where('recipient_id', $userId2);
        })->orWhere(function ($q) use ($userId1, $userId2) {
            $q->where('sender_id', $userId2)->where('recipient_id', $userId1);
        });
    }

    /**
     * Mark message as read.
     */
    public function markAsRead(): void
    {
        if (!$this->is_read) {
            $this->is_read = true;
            $this->read_at = now();
            $this->save();
        }
    }
}
