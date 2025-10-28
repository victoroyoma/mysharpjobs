# Admin Dashboard Testing Guide

## 🧪 Testing the New Admin Features

### Prerequisites
1. Ensure you have admin user credentials
2. Backend server running on http://localhost:8000
3. Frontend server running on http://localhost:3000
4. Database has some sample data (users, jobs, payments)

---

## 🔐 Admin Login

1. Navigate to: `http://localhost:3000/login`
2. Use admin credentials
3. You should be redirected to `/admin/dashboard`

---

## ✅ Features to Test

### 1. **Dashboard Overview Tab**

#### Test Real-Time Activities
- ✓ Activities panel should show recent user registrations
- ✓ Activities panel should show recent job postings
- ✓ Activities panel should show recent payments
- ✓ Activities automatically refresh every 30 seconds
- ✓ Empty state message if no activities exist

**Expected Result:**
```
Real-time Activities panel displays:
- User icons with names
- Activity descriptions
- Timestamps
- Priority indicators (color-coded)
```

#### Test Statistics Cards
- ✓ Total Users count matches database
- ✓ Total Jobs count is accurate
- ✓ Total Revenue displays correct amount
- ✓ Platform Health shows user satisfaction rating

---

### 2. **User Management Tab**

#### Test User List Display
Navigate to "User Management" tab:

- ✓ Table displays all users from database
- ✓ Each user shows:
  - Profile photo
  - Name with verification badge (if verified)
  - User type badge (Client/Artisan)
  - Email and phone
  - Status badges (Verified, Suspended, Profile Complete)
  - Registration date
- ✓ Pagination controls appear if more than 20 users

#### Test Filters
- ✓ **User Type Filter:**
  - Select "All Users" → Shows all users
  - Select "Clients" → Shows only client users
  - Select "Artisans" → Shows only artisan users

- ✓ **Search:**
  - Type user name → Filters to matching users
  - Type email → Filters to matching users
  - Type phone → Filters to matching users

- ✓ **Sort By:**
  - "Registration Date" → Users sorted by created_at
  - "Name" → Users sorted alphabetically
  - "Email" → Users sorted by email

#### Test Pagination
- ✓ Click "Next" → Shows next page of users
- ✓ Click "Previous" → Returns to previous page
- ✓ Page number displays correctly
- ✓ "Previous" disabled on first page
- ✓ "Next" disabled on last page

---

### 3. **User Details Modal**

#### Open Modal
Click "View" button on any user

#### Test Modal Display
- ✓ Modal opens with overlay
- ✓ User profile photo displays
- ✓ User name with verification badge
- ✓ Email and phone displayed
- ✓ User type badge shows
- ✓ Suspension status (if applicable)

#### Test Statistics Section
**For Clients:**
- ✓ Posted Jobs count
- ✓ Active Jobs count
- ✓ Completed Jobs count
- ✓ Total Spent amount (formatted as currency)

**For Artisans:**
- ✓ Assigned Jobs count
- ✓ Active Jobs count
- ✓ Completed Jobs count
- ✓ Total Earnings (formatted as currency)
- ✓ Rating (X.X format)
- ✓ Total Reviews count

#### Test Recent Jobs Section
- ✓ Last 5 jobs displayed
- ✓ Job title shown
- ✓ Job status displayed
- ✓ Budget formatted as currency

#### Test Recent Payments Section
- ✓ Last 5 payments displayed
- ✓ Amount formatted as currency
- ✓ Payment date formatted
- ✓ Payment status badge (completed/pending)

#### Test Account Information Section
- ✓ Verified status (Yes/No)
- ✓ Profile Completed status (Yes/No)
- ✓ Last Login date (or "Never")
- ✓ Suspended status (Yes/No)

#### Test Modal Close
- ✓ Click X button → Modal closes
- ✓ Click outside modal → Modal closes

---

### 4. **Job Interactions Tab**

Test existing functionality still works:
- ✓ Job list displays with filters
- ✓ Search works correctly
- ✓ Status filters apply
- ✓ Pagination functions

---

### 5. **Verifications Tab**

Test existing functionality:
- ✓ Pending verifications display
- ✓ Approve/Reject actions work

---

## 🌐 API Endpoint Testing

### Using Browser Console or Postman

#### Get All Users
```javascript
// Frontend Console
const response = await fetch('http://localhost:8000/api/admin/users', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Accept': 'application/json'
  }
});
const data = await response.json();
console.log(data);
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Users retrieved successfully",
  "data": [...users array...],
  "pagination": {
    "total": 50,
    "per_page": 20,
    "current_page": 1,
    "last_page": 3
  }
}
```

#### Get User Details
```javascript
const userId = 1; // Replace with actual user ID
const response = await fetch(`http://localhost:8000/api/admin/users/${userId}`, {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Accept': 'application/json'
  }
});
const data = await response.json();
console.log(data);
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "User details retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "type": "artisan",
    "stats": {...},
    "recent_jobs": [...],
    "recent_payments": [...],
    "account_info": {...}
  }
}
```

#### Get Recent Activities
```javascript
const response = await fetch('http://localhost:8000/api/admin/activities?limit=20', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Accept': 'application/json'
  }
});
const data = await response.json();
console.log(data);
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Recent activities retrieved successfully",
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
    // ... more activities
  ]
}
```

---

## 🐛 Common Issues & Solutions

### Issue: "403 Forbidden" when accessing admin routes
**Solution:** Ensure user has `type = 'admin'` in database

### Issue: Empty activities panel
**Solution:** Check database has recent users, jobs, or payments

### Issue: User details modal shows "Failed to load user details"
**Solution:** 
- Check network tab for error response
- Verify user ID exists in database
- Ensure admin token is valid

### Issue: Pagination not working
**Solution:** Check API response has `pagination` object with `last_page` property

---

## 📊 Database Verification

### Check Admin User Exists
```sql
SELECT * FROM users WHERE type = 'admin';
```

### Check Sample Data Exists
```sql
-- Count users
SELECT COUNT(*) as total_users FROM users;

-- Count jobs
SELECT COUNT(*) as total_jobs FROM jobs;

-- Count payments
SELECT COUNT(*) as total_payments FROM payments;
```

### Verify User Stats Calculation
```sql
-- For specific user
SELECT 
  (SELECT COUNT(*) FROM jobs WHERE client_id = 1) as posted_jobs,
  (SELECT COUNT(*) FROM jobs WHERE artisan_id = 1) as assigned_jobs,
  (SELECT SUM(amount) FROM payments WHERE client_id = 1) as total_spent,
  (SELECT SUM(amount) FROM payments WHERE artisan_id = 1) as total_earned
FROM users WHERE id = 1;
```

---

## ✅ Test Results Checklist

Mark each as you test:

**Overview Tab:**
- [ ] Stats cards display correctly
- [ ] Real-time activities load
- [ ] Activities refresh automatically
- [ ] Empty states show when no data

**User Management Tab:**
- [ ] User list loads with pagination
- [ ] Search filters users correctly
- [ ] Type filter works (All/Client/Artisan)
- [ ] Sort by works for all options
- [ ] Pagination navigation functions

**User Details Modal:**
- [ ] Modal opens on "View" click
- [ ] All user data displays correctly
- [ ] Statistics show for client/artisan
- [ ] Recent jobs list appears
- [ ] Recent payments list appears
- [ ] Account info section accurate
- [ ] Modal closes properly

**API Endpoints:**
- [ ] `/api/admin/users` returns paginated users
- [ ] `/api/admin/users/{id}` returns detailed info
- [ ] `/api/admin/activities` returns recent activities
- [ ] All endpoints respect admin middleware

---

## 🚀 Ready for Production?

Before deploying:
- [ ] All tests pass
- [ ] No console errors
- [ ] Loading states work correctly
- [ ] Error handling displays user-friendly messages
- [ ] Pagination works with large datasets
- [ ] Search and filters perform efficiently
- [ ] Modal scrolls properly on mobile
- [ ] Admin middleware blocks non-admin users

---

**Testing Date**: _____________  
**Tested By**: _____________  
**Status**: ⬜ Pass  ⬜ Fail  ⬜ Needs Fixes

