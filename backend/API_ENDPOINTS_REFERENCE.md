# MySharpJob API Endpoints - Quick Reference

**Base URL:** `http://localhost:8000/api`  
**Authentication:** Bearer Token (Sanctum)

---

## 🔓 Public Endpoints (No Auth Required)

### Health Check
```
GET /health
```

### Authentication
```
POST /auth/register
POST /auth/login
POST /auth/forgot-password
POST /auth/reset-password
```

### Browse Jobs (Public)
```
GET /jobs
GET /jobs/{id}
```

### Search
```
GET /search/jobs
GET /search/artisans
GET /search/featured-artisans
GET /search/popular-jobs
GET /search/suggestions
```

---

## 🔒 Protected Endpoints (Auth Required)

### Current User
```
GET /auth/me
POST /auth/logout
POST /auth/refresh-token
PUT /auth/update-password
```

### Jobs
```
GET /jobs                          # List with filters
GET /jobs/{id}                     # Single job
POST /jobs                         # Create (client only)
PUT /jobs/{id}                     # Update (owner)
DELETE /jobs/{id}                  # Delete (owner)
POST /jobs/{id}/apply              # Apply (artisan)
POST /jobs/{id}/accept/{artisanId} # Accept application (client)
POST /jobs/{id}/start              # Start job (artisan)
POST /jobs/{id}/complete           # Complete job (client)
POST /jobs/{id}/cancel             # Cancel job (client)
POST /jobs/{id}/review             # Add review (client)
POST /jobs/{id}/milestones         # Add milestone
PUT /jobs/{id}/milestones/{milestoneId}  # Update milestone
POST /jobs/{id}/progress           # Add progress update
GET /jobs/my/jobs                  # My jobs
GET /jobs/my/applications          # My applications (artisan)
```

### Messages
```
GET /messages                      # All messages
GET /messages/conversations        # Conversation list
GET /messages/conversation/{userId}  # Chat with user
POST /messages                     # Send message
PUT /messages/{id}/read            # Mark as read
DELETE /messages/{id}              # Delete message
GET /messages/unread-count         # Unread count
```

### Users
```
GET /users                         # List users
GET /users/{id}                    # User profile
PUT /users/{id}                    # Update profile
DELETE /users/{id}                 # Delete account
PUT /users/password                # Update password
GET /users/profile                 # Own profile
```

### Profiles
```
GET /profiles/me                   # Current profile
PUT /profiles/client               # Update client profile
PUT /profiles/artisan              # Update artisan profile
GET /profiles/client/dashboard     # Client dashboard
GET /profiles/artisan/dashboard    # Artisan dashboard
POST /profiles/picture             # Upload avatar
POST /profiles/portfolio           # Upload portfolio images
DELETE /profiles/portfolio/image   # Delete portfolio image
```

### Payments
```
POST /payments/initialize          # Initialize payment
GET /payments/verify/{reference}   # Verify payment
POST /payments/{id}/release        # Release from escrow
POST /payments/{id}/dispute        # Raise dispute
GET /payments/history              # Payment history
GET /payments/{id}                 # Payment details
```

### Search (Advanced)
```
GET /search/matches/{jobId}        # Job-artisan matches
```

---

## 👑 Admin Endpoints (Admin Role Required)

### Dashboard
```
GET /admin/dashboard               # Dashboard stats
GET /admin/analytics               # Analytics data
```

### User Management
```
GET /admin/users                   # All users
POST /admin/users/{userId}/suspend   # Suspend user
POST /admin/users/{userId}/unsuspend # Unsuspend user
DELETE /admin/users/{userId}       # Delete user
```

### Job Management
```
GET /admin/jobs                    # All jobs
```

### Verifications
```
GET /admin/verifications/pending   # Pending verifications
POST /admin/verifications/{userId}/approve  # Approve
POST /admin/verifications/{userId}/reject   # Reject
```

### Disputes
```
GET /admin/disputes                # Disputes list
POST /admin/disputes/{paymentId}/resolve  # Resolve dispute
```

---

## 📊 Common Query Parameters

### Pagination
```
?page=1&per_page=15
```

### Sorting
```
?sort_by=created_at&sort_order=desc
```

### Filters (Jobs)
```
?status=open
?category=plumbing
?min_budget=1000&max_budget=5000
?priority=urgent
```

### Filters (Users)
```
?type=artisan
?is_verified=true
?search=John
```

### Location Search
```
?lat=6.5244&lng=3.3792&radius=10
```

### Skills Filter
```
?skills=plumbing,electrical
```

---

## 📝 Request Body Examples

### Register
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "+2348012345678",
  "type": "artisan",
  "skills": ["plumbing", "electrical"],
  "experience": 5,
  "hourly_rate": 5000,
  "location": {
    "address": "123 Main St",
    "city": "Lagos",
    "coordinates": [6.5244, 3.3792]
  }
}
```

### Create Job
```json
{
  "title": "Fix bathroom plumbing",
  "description": "Need urgent plumbing repair",
  "category": "plumbing",
  "budget": 15000,
  "location": {
    "address": "456 Street",
    "city": "Lagos",
    "coordinates": [6.5244, 3.3792]
  },
  "priority": "high",
  "deadline": "2025-10-10",
  "requirements": [
    {"skill": "plumbing", "level": "expert"}
  ]
}
```

### Send Message
```json
{
  "recipient_id": 2,
  "content": "Hello, I'm interested in the job",
  "message_type": "text",
  "job_id": 1
}
```

### Initialize Payment
```json
{
  "job_id": 1,
  "amount": 15000,
  "currency": "NGN",
  "payment_method": "paystack",
  "callback_url": "http://localhost:3000/payment/callback"
}
```

---

## 🔐 Authentication Header

All protected endpoints require:
```
Authorization: Bearer {your_token_here}
```

Token obtained from `/auth/login` or `/auth/register`

---

## ✅ Response Format

### Success Response
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "errors": { /* validation errors */ }
}
```

### Paginated Response
```json
{
  "status": "success",
  "message": "Data retrieved",
  "data": [ /* items */ ],
  "pagination": {
    "total": 100,
    "per_page": 15,
    "current_page": 1,
    "last_page": 7,
    "from": 1,
    "to": 15
  }
}
```

---

## 📞 Webhook Endpoints

### Paystack Webhook
```
POST /payments/webhook/paystack
Header: X-Paystack-Signature
```

### Flutterwave Webhook
```
POST /payments/webhook/flutterwave
Header: verif-hash
```

---

**Total Endpoints:** 85+  
**Documentation:** See CONTROLLERS_COMPLETE_REPORT.md for detailed info  
**Server:** http://localhost:8000
