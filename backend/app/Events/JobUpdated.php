<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Job;

class JobUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $job;
    public $updateType;

    /**
     * Create a new event instance.
     * 
     * @param Job $job
     * @param string $updateType (status_changed, milestone_added, progress_updated, etc.)
     */
    public function __construct(Job $job, string $updateType = 'updated')
    {
        $this->job = $job;
        $this->updateType = $updateType;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $channels = [
            new PrivateChannel('user.' . $this->job->client_id),
        ];

        // If job has an assigned artisan, broadcast to them too
        if ($this->job->artisan_id) {
            $channels[] = new PrivateChannel('user.' . $this->job->artisan_id);
        }

        return $channels;
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'job.updated';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->job->id,
            'title' => $this->job->title,
            'status' => $this->job->status,
            'category' => $this->job->category,
            'budget' => $this->job->budget,
            'priority' => $this->job->priority,
            'update_type' => $this->updateType,
            'client_id' => $this->job->client_id,
            'artisan_id' => $this->job->artisan_id,
            'milestones' => $this->job->milestones,
            'progress_updates' => $this->job->progress_updates,
            'updated_at' => $this->job->updated_at->toISOString(),
        ];
    }
}
