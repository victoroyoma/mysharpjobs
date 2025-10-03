<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

// User private channel for messages and notifications
Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

// Job channel for job updates (client and artisan)
Broadcast::channel('job.{jobId}', function ($user, $jobId) {
    $job = \App\Models\Job::find($jobId);
    return $job && (
        $user->id === $job->client_id || 
        $user->id === $job->artisan_id
    );
});

// Admin channel for admin-only broadcasts
Broadcast::channel('admin', function ($user) {
    return $user->isAdmin();
});
