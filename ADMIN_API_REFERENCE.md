# Admin API Endpoints - Quick Reference

## 🔗 Complete List of Admin Endpoints

### Base URL
```
http://localhost:8000/api/admin
```

### Authentication
All endpoints require:
- Valid Bearer token
- User type: `admin`

---

## 📊 Dashboard & Statistics

### Get Dashboard Stats
```http
GET /api/admin/dashboard
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "total_users": 150,
    "total_clients": 80,
    "total_artisans": 70,
    "total_jobs": 320,
    "active_jobs": 45,
    "completed_jobs": 250,
    "total_revenue": 125000.50,
    "monthly_revenue": 15000.00,
    "pending_verifications": 5,
    "disputes": 2,
    "new_signups": 12,
    "platform_fee": 12500.05,
    "conversion_rate": 68.50,
    "avg_job_value": 390.63,
    "user_satisfaction": 4.7,
    "response_time": 2.5
  }
}
```

### Get Analytics
```http
GET /api/admin/analytics?period=month
```

**Query Parameters:**
- `period`: week | month | year
- `start_date`: YYYY-MM-DD (optional)
- `end_date`: YYYY-MM-DD (optional)

---

## 👥 User Management

### Get All Users
```http
GET /api/admin/users?type=artisan&page=1&per_page=20
```

**Query Parameters:**
- `type`: client | artisan (optional)
- `is_verified`: true | false (optional)
- `search`: string (searches name, email, phone)
- `sort_by`: created_at | name | email
- `sort_order`: asc | desc
- `per_page`: number (default: 20)
- `page`: number (default: 1)

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "type": "artisan",
      "phone": "+1234567890",
      "location": "Lagos, Nigeria",
      "profile_image": "https://...",
      "is_verified": true,
      "is_suspended": false,
      "profile_completed": true,
      "created_at": "2024-06-15T10:30:00Z",
      "last_active": "2025-01-03T15:45:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "per_page": 20,
    "current_page": 1,
    "last_page": 8
  }
}
```

### Get User Details
```http
GET /api/admin/users/{userId}
```

**Response for Artisan:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "type": "artisan",
    "phone": "+1234567890",
    "location": "Lagos, Nigeria",
    "profile_image": "https://...",
    "bio": "Experienced plumber with 10 years...",
    "skills": ["plumbing", "electrical", "carpentry"],
    "hourly_rate": 50.00,
    "stats": {
      "assigned_jobs": 45,
      "active_jobs": 3,
      "completed_jobs": 42,
      "total_earnings": 52500.00,
      "rating": 4.8,
      "total_reviews": 38
    },
    "recent_jobs": [
      {
        "id": 101,
        "title": "Fix Kitchen Sink",
        "status": "completed",
        "budget": 500.00,
        "client": {
          "id": 50,
          "name": "Jane Smith"
        },
        "created_at": "2025-01-01T08:00:00Z"
      }
    ],
    "recent_payments": [
      {
        "id": 201,
        "amount": 500.00,
        "status": "completed",
        "created_at": "2025-01-02T10:00:00Z"
      }
    ],
    "account_info": {
      "is_verified": true,
      "is_suspended": false,
      "verified_at": "2024-07-01T12:00:00Z",
      "last_login": "2025-01-03T15:45:00Z",
      "profile_completed": true
    }
  }
}
```

**Response for Client:**
```json
{
  "status": "success",
  "data": {
    "id": 50,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "type": "client",
    "stats": {
      "posted_jobs": 25,
      "active_jobs": 3,
      "completed_jobs": 22,
      "total_spent": 11000.00
    },
    "recent_jobs": [...],
    "recent_payments": [...],
    "account_info": {...}
  }
}
```

### Suspend User
```http
PUT /api/admin/users/{userId}/suspend
```

**Request Body:**
```json
{
  "reason": "Violation of terms of service",
  "duration": 30
}
```

### Unsuspend User
```http
PUT /api/admin/users/{userId}/unsuspend
```

### Delete User
```http
DELETE /api/admin/users/{userId}
```

---

## 💼 Job Management

### Get All Jobs
```http
GET /api/admin/jobs?status=in-progress&page=1
```

**Query Parameters:**
- `status`: open | in-progress | completed | cancelled
- `category`: string (optional)
- `priority`: urgent | high | medium | low (optional)
- `from_date`: YYYY-MM-DD (optional)
- `to_date`: YYYY-MM-DD (optional)
- `sort_by`: created_at | budget | title
- `sort_order`: asc | desc
- `per_page`: number (default: 20)
- `page`: number (default: 1)

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 101,
      "title": "Fix Kitchen Sink",
      "description": "Leaking kitchen sink needs repair",
      "status": "in-progress",
      "budget": 500.00,
      "category": "Plumbing",
      "priority": "medium",
      "client": {
        "id": 50,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "phone": "+1234567890"
      },
      "artisan": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "is_verified": true
      },
      "created_at": "2025-01-01T08:00:00Z",
      "updated_at": "2025-01-02T10:00:00Z"
    }
  ],
  "pagination": {...}
}
```

---

## 🔔 Activities

### Get Recent Activities
```http
GET /api/admin/activities?limit=50
```

**Query Parameters:**
- `limit`: number (default: 50)

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "user_123",
      "type": "user_registered",
      "user": "Jane Doe",
      "user_id": 123,
      "user_type": "client",
      "description": "Jane Doe registered as client",
      "timestamp": "2025-01-04T10:30:00Z",
      "priority": "low"
    },
    {
      "id": "job_456",
      "type": "job_posted",
      "user": "Jane Doe",
      "user_id": 123,
      "job_id": 456,
      "description": "New job posted: Fix Kitchen Sink",
      "timestamp": "2025-01-04T10:25:00Z",
      "priority": "medium",
      "amount": 500.00
    },
    {
      "id": "payment_789",
      "type": "payment_processed",
      "user": "Jane Doe",
      "user_id": 123,
      "description": "Payment of $500 processed",
      "timestamp": "2025-01-04T10:20:00Z",
      "priority": "high",
      "amount": 500.00
    }
  ]
}
```

**Activity Types:**
- `user_registered` - New user signup
- `job_posted` - New job created
- `payment_processed` - Payment completed

**Priority Levels:**
- `high` - Payments, critical actions
- `medium` - Job postings, assignments
- `low` - User registrations, profile updates

---

## ✅ Verifications

### Get Pending Verifications
```http
GET /api/admin/verifications/pending?per_page=20
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "type": "artisan",
      "verification_documents": {
        "id_card": "https://...",
        "certification": "https://..."
      },
      "created_at": "2025-01-01T10:00:00Z"
    }
  ],
  "pagination": {...}
}
```

### Approve Verification
```http
POST /api/admin/verifications/{userId}/approve
```

### Reject Verification
```http
POST /api/admin/verifications/{userId}/reject
```

**Request Body:**
```json
{
  "reason": "Invalid documentation provided"
}
```

---

## ⚖️ Disputes

### Get Disputes
```http
GET /api/admin/disputes?status=open
```

**Query Parameters:**
- `status`: open | resolved | closed
- `sort_by`: created_at | updated_at
- `sort_order`: asc | desc

### Resolve Dispute
```http
POST /api/admin/disputes/{disputeId}/resolve
```

**Request Body:**
```json
{
  "resolution": "Refund issued to client due to incomplete work",
  "winner": "client"
}
```

**Winner values:**
- `client` - Dispute resolved in favor of client
- `artisan` - Dispute resolved in favor of artisan

---

## 📤 Export Data

Use the existing endpoints to fetch data, then export:

```javascript
// Example: Export all users
const response = await fetch('/api/admin/users?per_page=1000');
const data = await response.json();
// Convert to CSV or JSON file
```

---

## 🔒 Authentication Example

```javascript
// JavaScript/React
const token = localStorage.getItem('authToken');

fetch('http://localhost:8000/api/admin/dashboard', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

```php
// PHP/cURL
$ch = curl_init('http://localhost:8000/api/admin/dashboard');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token,
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
```

---

## 🚨 Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```

### 403 Forbidden
```json
{
  "message": "This action is unauthorized."
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "User not found"
}
```

### 500 Server Error
```json
{
  "status": "error",
  "message": "Error fetching user details: Database connection failed"
}
```

---

## 🔧 Testing with cURL

```bash
# Get dashboard stats
curl -X GET "http://localhost:8000/api/admin/dashboard" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"

# Get all users (filtered)
curl -X GET "http://localhost:8000/api/admin/users?type=artisan&per_page=10" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"

# Get user details
curl -X GET "http://localhost:8000/api/admin/users/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"

# Get activities
curl -X GET "http://localhost:8000/api/admin/activities?limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

---

## 📝 Rate Limiting

- Default: 60 requests per minute per IP
- Admin endpoints may have higher limits
- Check response headers for rate limit info:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`

---

## 🎯 Quick Access URLs

- Dashboard: `http://localhost:3000/admin/dashboard`
- Users Tab: `http://localhost:3000/admin/dashboard#users`
- Verifications: `http://localhost:3000/admin/dashboard#verifications`

---

**Last Updated**: January 4, 2025  
**API Version**: 1.0  
**Backend**: Laravel (PHP)  
**Frontend**: React (TypeScript)

