# 🧪 API Testing Guide - Laravel Backend

## Server Information
- **Base URL:** `http://localhost:8000/api`
- **Auth Type:** Bearer Token (Laravel Sanctum)
- **Content-Type:** `application/json`

---

## 🚀 Quick Start - Test Authentication

### 1. Register a New User (Artisan)

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Carpenter",
  "email": "john@example.com",
  "password": "Password123",
  "type": "artisan",
  "location": "Lagos, Nigeria",
  "phone": "+2348012345678",
  "skills": ["carpentry", "furniture making"],
  "experience": 5,
  "hourlyRate": 5000,
  "bio": "Expert carpenter with 5 years experience"
}
```

**Expected Response (201):**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Carpenter",
      "email": "john@example.com",
      "type": "artisan",
      ...
    },
    "token": "1|abcd1234...",
    "refreshToken": "xyz789..."
  }
}
```

### 2. Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Expected Response (200):**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {...},
    "token": "2|efgh5678...",
    "refreshToken": "abc123..."
  }
}
```

**💡 Save the `token` - you'll need it for protected routes!**

---

## 🔐 Protected Endpoints (Require Authentication)

### Headers for Protected Routes:
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
Accept: application/json
```

---

## 📝 Job Management Tests

### 3. Create a Job (Client Only)

**First, register a client user:**
```json
{
  "name": "Jane Client",
  "email": "jane@example.com",
  "password": "Password123",
  "type": "client",
  "location": "Abuja, Nigeria",
  "businessType": "individual"
}
```

**Then create a job:**

**Endpoint:** `POST /api/jobs`  
**Headers:** `Authorization: Bearer CLIENT_TOKEN`

**Request Body:**
```json
{
  "title": "Repair Kitchen Cabinets",
  "description": "Need someone to repair and refinish my kitchen cabinets. They need sanding and repainting.",
  "category": "carpentry",
  "budget": 50000,
  "location": "Ikeja, Lagos",
  "priority": "medium",
  "deadline": "2025-10-15T00:00:00Z",
  "requirements": ["Tools should be provided", "Must complete within 2 weeks"],
  "materials": ["Wood glue", "Sandpaper", "Paint"]
}
```

**Expected Response (201):**
```json
{
  "status": "success",
  "message": "Job created successfully",
  "data": {
    "job": {
      "id": 1,
      "title": "Repair Kitchen Cabinets",
      "status": "open",
      ...
    }
  }
}
```

### 4. Get All Jobs (Public)

**Endpoint:** `GET /api/jobs`

**Query Parameters (optional):**
- `?status=open`
- `?category=carpentry`
- `?location=Lagos`
- `?minBudget=10000&maxBudget=100000`
- `?sortBy=budget&sortOrder=asc`

**Expected Response (200):**
```json
{
  "status": "success",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "title": "Repair Kitchen Cabinets",
        ...
      }
    ],
    "total": 1,
    ...
  }
}
```

### 5. Apply for Job (Artisan Only)

**Endpoint:** `POST /api/jobs/1/apply`  
**Headers:** `Authorization: Bearer ARTISAN_TOKEN`

**Expected Response (200):**
```json
{
  "status": "success",
  "message": "Application submitted successfully",
  "data": {
    "job": {
      "id": 1,
      "applicants": [1]
    }
  }
}
```

### 6. Accept Application (Client Only)

**Endpoint:** `POST /api/jobs/1/accept/1`  
**Headers:** `Authorization: Bearer CLIENT_TOKEN`

**Expected Response (200):**
```json
{
  "status": "success",
  "message": "Application accepted successfully",
  "data": {
    "job": {
      "id": 1,
      "status": "in-progress",
      "artisan_id": 1
    }
  }
}
```

---

## 💬 Message System Tests

### 7. Send a Message

**Endpoint:** `POST /api/messages`  
**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Request Body:**
```json
{
  "recipient_id": 2,
  "content": "Hello! I'm interested in discussing the job details.",
  "message_type": "text",
  "job_id": 1
}
```

**Expected Response (201):**
```json
{
  "status": "success",
  "message": "Message sent successfully",
  "data": {
    "message": {
      "id": 1,
      "content": "Hello! I'm interested in discussing the job details.",
      "is_read": false,
      ...
    }
  }
}
```

### 8. Get Conversations

**Endpoint:** `GET /api/messages/conversations`  
**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Expected Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 2,
      "name": "Jane Client",
      "last_message": "Hello! I'm interested...",
      "unread_count": 3
    }
  ]
}
```

### 9. Get Unread Count

**Endpoint:** `GET /api/messages/unread-count`  
**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Expected Response (200):**
```json
{
  "status": "success",
  "data": {
    "count": 5
  }
}
```

---

## 🔍 Additional Test Endpoints

### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer TOKEN
```

### Update Password
```
PUT /api/auth/password
Headers: Authorization: Bearer TOKEN
Body: {
  "currentPassword": "Password123",
  "newPassword": "NewPassword456"
}
```

### Get My Jobs
```
GET /api/jobs/my-jobs
Headers: Authorization: Bearer TOKEN
```

### Get My Applications (Artisan)
```
GET /api/jobs/my-applications
Headers: Authorization: Bearer TOKEN
```

### Complete Job (Client)
```
POST /api/jobs/1/complete
Headers: Authorization: Bearer CLIENT_TOKEN
```

### Add Review (Client)
```
POST /api/jobs/1/review
Headers: Authorization: Bearer CLIENT_TOKEN
Body: {
  "rating": 5,
  "review": "Excellent work! Highly recommended."
}
```

---

## 🧪 Using Postman

### Import this Collection:

1. **Create Environment:**
   - Variable: `base_url` = `http://localhost:8000/api`
   - Variable: `token` = (will be set after login)

2. **Pre-request Script for Auth:**
   ```javascript
   pm.request.headers.add({
     key: 'Authorization',
     value: 'Bearer ' + pm.environment.get('token')
   });
   ```

3. **After Login Test:**
   ```javascript
   var jsonData = pm.response.json();
   pm.environment.set("token", jsonData.data.token);
   ```

---

## ✅ Test Checklist

### Authentication
- [ ] Register artisan user
- [ ] Register client user
- [ ] Login with both users
- [ ] Get current user info
- [ ] Update password
- [ ] Logout

### Jobs (As Client)
- [ ] Create job
- [ ] View job list
- [ ] View single job
- [ ] Update job
- [ ] Accept artisan application
- [ ] Complete job
- [ ] Add review

### Jobs (As Artisan)
- [ ] View available jobs
- [ ] Apply for job
- [ ] View my applications
- [ ] View assigned jobs
- [ ] Add progress update
- [ ] Start job

### Messages
- [ ] Send message
- [ ] View conversations
- [ ] View conversation with user
- [ ] Mark as read
- [ ] Get unread count

---

## 🐛 Common Issues & Solutions

### Issue: "Unauthenticated" Error
**Solution:** Make sure you're including the Bearer token in the Authorization header

### Issue: "Validation failed"
**Solution:** Check that all required fields are included and formatted correctly

### Issue: "Unauthorized"
**Solution:** Make sure the correct user type is performing the action (e.g., only clients can create jobs)

### Issue: Database Error
**Solution:** Run migrations: `php artisan migrate:fresh`

---

## 📊 Expected Test Results

After running all tests, you should have:
- ✅ 2 users (1 artisan, 1 client)
- ✅ 1 job created
- ✅ 1 job application
- ✅ Job status changed to "in-progress"
- ✅ Job completed with review
- ✅ Multiple messages exchanged
- ✅ Artisan rating updated

---

## 🚀 Next Steps After Testing

Once basic API tests pass:
1. Implement remaining controllers
2. Add file upload endpoints
3. Integrate payment gateways
4. Set up WebSockets for real-time features
5. Connect frontend to backend
6. Comprehensive integration testing

---

**Happy Testing! 🎉**

*Server is running at: http://localhost:8000*  
*API Health Check: http://localhost:8000/api/health*
