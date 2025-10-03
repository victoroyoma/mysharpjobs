# MySharpJob API Documentation

## Base URL
```
Production: https://api.mysharpjob.com/api
Development: http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": true|false,
  "message": "Response message",
  "data": {} // Response data (if applicable),
  "errors": [] // Validation errors (if applicable)
}
```

## Endpoints

### Authentication Endpoints

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "type": "artisan|client",
  "location": "Lagos, Nigeria",
  "phone": "+234801234567" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "type": "artisan",
      "isVerified": false
    },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### POST /auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

#### POST /auth/logout
Logout user and invalidate tokens.

#### POST /auth/forgot-password
Request password reset email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

#### POST /auth/reset-password
Reset password using reset token.

**Request Body:**
```json
{
  "token": "reset_token",
  "newPassword": "NewSecurePass123!"
}
```

### User Management Endpoints

#### GET /users/profile
Get current user profile. **(Protected)**

#### PUT /users/profile
Update current user profile. **(Protected)**

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "+234801234567",
  "location": "Updated Location",
  "bio": "Updated bio",
  "skills": ["carpentry", "painting"], // artisans only
  "hourlyRate": 5000, // artisans only
  "experience": 5 // artisans only
}
```

#### GET /users/stats
Get user statistics. **(Protected)**

#### PUT /users/availability
Update artisan availability status. **(Protected - Artisans only)**

**Request Body:**
```json
{
  "isAvailable": true
}
```

### Job Management Endpoints

#### GET /jobs
Get all jobs with filters.

**Query Parameters:**
- `category` - Filter by job category
- `location` - Filter by location
- `minBudget` - Minimum budget filter
- `maxBudget` - Maximum budget filter
- `status` - Filter by job status
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

#### POST /jobs
Create a new job posting. **(Protected - Clients only)**

**Request Body:**
```json
{
  "title": "Kitchen Cabinet Installation",
  "description": "Need help installing custom kitchen cabinets...",
  "category": "carpentry",
  "budget": 50000,
  "location": "Lagos, Nigeria",
  "deadline": "2024-02-15T10:00:00Z",
  "requirements": ["Experience with cabinet installation"],
  "materials": ["Cabinets", "Screws", "Hinges"],
  "urgency": "medium"
}
```

#### GET /jobs/:id
Get specific job details.

#### PUT /jobs/:id
Update job details. **(Protected - Job owner only)**

#### DELETE /jobs/:id
Delete job posting. **(Protected - Job owner only)**

#### POST /jobs/:id/apply
Apply for a job. **(Protected - Artisans only)**

#### PUT /jobs/:id/assign
Assign job to an artisan. **(Protected - Job owner only)**

**Request Body:**
```json
{
  "artisanId": "artisan_user_id"
}
```

#### PUT /jobs/:id/complete
Mark job as completed. **(Protected - Assigned artisan only)**

#### POST /jobs/:id/review
Submit job review. **(Protected - Job participants only)**

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent work, highly recommended!",
  "reviewType": "client_to_artisan|artisan_to_client"
}
```

### Messaging Endpoints

#### GET /messages
Get user messages. **(Protected)**

**Query Parameters:**
- `conversationId` - Get messages for specific conversation
- `page` - Page number
- `limit` - Items per page

#### POST /messages
Send a new message. **(Protected)**

**Request Body:**
```json
{
  "recipientId": "recipient_user_id",
  "content": "Hello, I'm interested in your job posting...",
  "jobId": "job_id", // optional
  "attachments": ["file_url"] // optional
}
```

#### PUT /messages/:id/read
Mark message as read. **(Protected)**

### Payment Endpoints

#### POST /payments/initialize
Initialize payment for a job. **(Protected)**

**Request Body:**
```json
{
  "jobId": "job_id",
  "amount": 50000,
  "paymentMethod": "paystack|flutterwave"
}
```

#### POST /payments/webhook
Payment gateway webhook endpoint.

#### GET /payments/history
Get payment history. **(Protected)**

#### GET /payments/:id
Get specific payment details. **(Protected)**

### Profile Endpoints

#### GET /profiles/dashboard/client
Get client dashboard data. **(Protected - Clients only)**

#### GET /profiles/dashboard/artisan
Get artisan dashboard data. **(Protected - Artisans only)**

#### GET /profiles/artisan/:id
Get public artisan profile.

#### PUT /profiles/availability
Update artisan availability. **(Protected - Artisans only)**

### Search Endpoints

#### GET /search/artisans
Search for artisans.

**Query Parameters:**
- `skills` - Filter by skills
- `location` - Filter by location
- `radius` - Search radius in km
- `minRating` - Minimum rating filter
- `maxRate` - Maximum hourly rate
- `available` - Filter by availability

#### GET /search/jobs
Search for jobs. **(Protected - Artisans only)**

**Query Parameters:**
- `category` - Filter by category
- `location` - Filter by location
- `radius` - Search radius in km
- `minBudget` - Minimum budget
- `maxBudget` - Maximum budget

### Admin Endpoints *(Protected - Admin only)*

#### GET /admin/dashboard
Get admin dashboard statistics.

#### GET /admin/users
Get all users with pagination.

#### PUT /admin/users/:id/verify
Verify user account.

#### PUT /admin/users/:id/suspend
Suspend user account.

#### GET /admin/jobs
Get all jobs for admin review.

#### GET /admin/disputes
Get all disputes.

#### PUT /admin/disputes/:id/resolve
Resolve a dispute.

### Health Check Endpoints

#### GET /health
Get application health status.

#### GET /health/live
Liveness probe for container orchestration.

#### GET /health/ready
Readiness probe for container orchestration.

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 422 | Unprocessable Entity - Validation errors |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## Rate Limiting

- **General API calls**: 100 requests per 15 minutes per IP
- **Authentication endpoints**: 5 requests per 15 minutes per IP
- **Message sending**: 50 messages per hour per user

## File Upload

Maximum file size: 10MB
Supported formats: JPG, PNG, PDF, DOC, DOCX
Upload endpoint: POST /upload

## Webhooks

### Payment Webhook
**URL**: POST /payments/webhook
**Headers**: 
- `x-paystack-signature` or `x-flutterwave-signature`

## SDKs and Libraries

- **JavaScript/Node.js**: `npm install mysharpjob-sdk`
- **PHP**: `composer require mysharpjob/php-sdk`
- **Python**: `pip install mysharpjob-sdk`

## Support

For API support, contact: api-support@mysharpjob.com

## Changelog

### Version 1.0.0
- Initial API release
- Authentication and user management
- Job posting and application system
- Messaging system
- Payment integration

