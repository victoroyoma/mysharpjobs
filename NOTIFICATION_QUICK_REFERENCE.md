# Notification System - Quick Reference Guide

## 🚀 Quick Start

### Creating a Notification (Most Common Use)

```php
use App\Models\Notification;

// Simple notification
Notification::createNotification(
    userId: $user->id,
    type: 'info',          // 'info' | 'success' | 'warning' | 'error'
    title: 'Hello!',
    message: 'Your action was successful'
);

// With extras
Notification::createNotification(
    userId: $user->id,
    type: 'success',
    title: 'Payment Received',
    message: 'You received ₦5,000 for Job #123',
    data: ['amount' => 5000, 'job_id' => 123],
    priority: 'high',      // 'low' | 'medium' | 'high'
    actionUrl: '/jobs/123',
    actionText: 'View Job'
);
```

## 📋 API Endpoints Reference

### Base URL: `http://localhost:8000/api/notifications`
### Auth: Required (`Authorization: Bearer {token}`)

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/notifications` | List notifications | `?is_read=0&type=info&priority=high&per_page=15` |
| GET | `/notifications/{id}` | Get single (auto-marks read) | - |
| PATCH | `/notifications/{id}/read` | Mark as read | - |
| PATCH | `/notifications/mark-all-read` | Mark all read | - |
| DELETE | `/notifications/{id}` | Delete one | - |
| DELETE | `/notifications/read` | Delete all read | - |
| DELETE | `/notifications/all` | Delete all | - |
| GET | `/notifications/unread-count` | Get unread count | - |
| POST | `/notifications/test` | Create test (dev only) | - |

## 💾 Database Fields

```sql
id              - Auto-increment ID
user_id         - User who receives notification
type            - info | success | warning | error
title           - Short headline (max 255 chars)
message         - Full message text
data            - JSON: Extra structured data
is_read         - Boolean: Read status
read_at         - Timestamp: When marked read
priority        - low | medium | high
action_url      - Link for notification action
action_text     - Button text for action
expires_at      - Auto-expiry timestamp
metadata        - JSON: Custom fields
created_at      - Creation timestamp
updated_at      - Last update timestamp
```

## 🔍 Common Queries

```php
// Get unread for user
$unread = Notification::unread()
    ->where('user_id', $userId)
    ->get();

// Get by type
$warnings = Notification::ofType('warning')
    ->where('user_id', $userId)
    ->get();

// Get high priority only
$urgent = Notification::byPriority('high')
    ->where('user_id', $userId)
    ->get();

// Get with pagination
$paginated = Notification::where('user_id', $userId)
    ->orderBy('created_at', 'desc')
    ->paginate(15);

// Mark as read
$notification->markAsRead();

// Check if expired
if ($notification->isExpired()) {
    // Handle expired notification
}
```

## 🎯 Common Use Cases

### 1. Job Status Change
```php
// In JobController after status update
Notification::createNotification(
    userId: $job->client_id,
    type: 'info',
    title: 'Job Status Updated',
    message: "Job '{$job->title}' is now {$job->status}",
    data: ['job_id' => $job->id, 'status' => $job->status],
    actionUrl: "/jobs/{$job->id}",
    actionText: 'View Job'
);
```

### 2. Payment Received
```php
// In PaymentController after payment
Notification::createNotification(
    userId: $payment->artisan_id,
    type: 'success',
    title: 'Payment Received',
    message: "You received ₦{$payment->amount}",
    data: ['payment_id' => $payment->id, 'amount' => $payment->amount],
    priority: 'high'
);
```

### 3. New Message
```php
// In MessageController after new message
Notification::createNotification(
    userId: $message->receiver_id,
    type: 'info',
    title: 'New Message',
    message: "New message from {$sender->name}",
    data: ['message_id' => $message->id],
    actionUrl: "/messages/{$message->conversation_id}",
    actionText: 'Read Message'
);
```

### 4. Verification Approved
```php
// In VerificationController after approval
Notification::createNotification(
    userId: $verification->user_id,
    type: 'success',
    title: 'Verification Approved',
    message: 'Your artisan profile is now verified!',
    priority: 'high',
    actionUrl: '/dashboard',
    actionText: 'Go to Dashboard'
);
```

### 5. System Announcement
```php
// Send to all users
User::chunk(100, function ($users) {
    foreach ($users as $user) {
        Notification::createNotification(
            userId: $user->id,
            type: 'warning',
            title: 'Scheduled Maintenance',
            message: 'System will be down Sunday 2-4 AM',
            priority: 'high',
            expiresAt: now()->addDays(7)
        );
    }
});
```

## 🎨 Notification Types

| Type | Icon | Color | Use For |
|------|------|-------|---------|
| `info` | ℹ️ | Blue | General updates, reminders |
| `success` | ✅ | Green | Completed actions, payments |
| `warning` | ⚠️ | Yellow | Deadlines, required actions |
| `error` | ❌ | Red | Failures, rejections |

## ⚡ Priority Levels

| Priority | When to Use | Example |
|----------|-------------|---------|
| `low` | Nice to know | "New feature available" |
| `medium` | Normal updates | "Job status changed" |
| `high` | Urgent actions | "Payment received", "Deadline approaching" |

## 🧪 Testing

### Create Test Notification
```bash
# Via Tinker
php artisan tinker
\App\Models\Notification::createNotification(1, 'info', 'Test', 'Testing!');

# Via API (with auth token)
curl -X POST http://localhost:8000/api/notifications/test \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Check Notifications
```bash
# Via Tinker
php artisan tinker
\App\Models\Notification::where('user_id', 1)->get();

# Via API
curl http://localhost:8000/api/notifications \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Unread Count
```bash
curl http://localhost:8000/api/notifications/unread-count \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔧 Frontend Integration

### Display Notification Center
```tsx
import NotificationCenter from '@/components/NotificationCenter';

// In your dashboard component
<NotificationCenter 
  userId={currentUser.id} 
  userType={currentUser.role} // 'client' | 'artisan' | 'admin'
/>
```

### Component Features
- ✅ Real-time updates via WebSocket
- ✅ Filter by: All, Unread, High Priority
- ✅ Mark as read/unread
- ✅ Delete notifications
- ✅ Mark all as read
- ✅ Action buttons with links
- ✅ Browser notifications

## 📊 Database Maintenance

### Cleanup Expired Notifications (Scheduled)
```php
// Add to app/Console/Kernel.php
protected function schedule(Schedule $schedule)
{
    $schedule->call(function () {
        Notification::where('expires_at', '<', now())->delete();
    })->daily();
}
```

### Delete Old Read Notifications
```php
// Delete read notifications older than 30 days
Notification::where('is_read', true)
    ->where('read_at', '<', now()->subDays(30))
    ->delete();
```

## 🔐 Security Notes

- ✅ All routes protected by `auth:sanctum`
- ✅ Users can only access their own notifications
- ✅ Controller enforces user_id matching
- ✅ Input validation on all endpoints
- ✅ XSS protection via Laravel escaping

## 🐛 Common Issues

### Notifications not showing
1. ✅ Check backend is running: `php artisan serve`
2. ✅ Verify auth token is valid
3. ✅ Check browser console for errors

### Real-time not working
1. ✅ Start Reverb: `php artisan reverb:start`
2. ✅ Check `.env`: `BROADCAST_DRIVER=reverb`
3. ✅ Verify WebSocket connection in DevTools

### Database errors
1. ✅ Run migrations: `php artisan migrate`
2. ✅ Check SQLite file exists
3. ✅ Verify `.env` database config

## 📚 Full Documentation

See **NOTIFICATION_SYSTEM_COMPLETE.md** for:
- Complete architecture details
- Advanced features
- Performance optimization
- Integration examples
- Troubleshooting guide

## ✅ System Status

- ✅ Database tables created
- ✅ API endpoints working
- ✅ Frontend integrated
- ✅ Test notifications created
- ✅ WebSocket ready
- ✅ Production-ready

**Total Notifications**: 3 test notifications created for user ID 1
**Status**: Fully operational 🚀
