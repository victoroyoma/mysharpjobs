# 🔧 Client Profile Troubleshooting Guide

## Common Issues & Solutions

### Issue: Profile Not Loading / Blank Page

#### Diagnostic Steps:

1. **Check Browser Console**
   - Open DevTools (F12)
   - Look for console messages starting with 🔄, 📡, 📥, ✅, or ❌
   - This will tell you what's happening

2. **Check Network Tab**
   - Open DevTools → Network tab
   - Look for request to `/api/profiles/me`
   - Check the response status and data

#### Possible Causes & Fixes:

**1. Not Logged In (401 Unauthorized)**
```
Console: ❌ No user found, redirecting to login...
Fix: Log in as a client user first
```

**2. Profile Not Found (404)**
```
Console: Profile not found
Fix: Complete your profile setup at /client/profile-setup
```

**3. Wrong User Type**
```
Fix: Make sure you're logged in as a CLIENT, not ARTISAN
Route: /client/profile requires client role
```

**4. Backend Not Running**
```
Console: Network error / Failed to fetch
Fix: Start your Laravel backend server
Command: php artisan serve
```

**5. CORS Issues**
```
Console: CORS policy error
Fix: Check Laravel CORS configuration in config/cors.php
```

**6. Invalid API Response**
```
Console: ❌ Unexpected API response format
Fix: Check backend is returning correct format:
{
  "status": "success",
  "data": {
    "name": "...",
    "email": "...",
    ...
  }
}
```

---

## Testing Checklist

### 1. Verify Backend is Running

```bash
# In backend directory
php artisan serve

# Should see:
# Server running on http://localhost:8000
```

### 2. Test API Endpoint Manually

```bash
# Get your token from browser localStorage
# Then test the endpoint:

curl -X GET http://localhost:8000/api/profiles/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

Expected response:
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+234 801 234 5678",
    "location": "Warri, Nigeria",
    "bio": "...",
    "avatar": "/storage/avatars/...",
    "type": "client",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

### 3. Check Authentication

1. Open browser console
2. Run: `localStorage.getItem('token')`
3. Should return a JWT token
4. If null, you need to log in

### 4. Verify User Type

1. Open browser console
2. Run: `JSON.parse(localStorage.getItem('user')).type`
3. Should return "client"
4. If "artisan", use artisan profile instead

---

## Debug Mode

### Enable Detailed Logging

The component now has detailed console logging:

- 🔄 = Starting fetch
- 📡 = API Response received
- 📥 = Processing data
- ✅ = Success
- ❌ = Error

Watch the console to see where it fails.

---

## Quick Fixes

### Fix 1: Clear Cache & Reload

```javascript
// In browser console:
localStorage.clear();
// Then log in again
```

### Fix 2: Check Environment Variables

```env
# In frontend .env file:
VITE_BASE_URL=http://localhost:8000
VITE_API_URL=http://localhost:8000/api
```

### Fix 3: Verify Route Protection

```tsx
// In App.tsx, route should be:
<Route path="/client/profile" element={
  <ProtectedRoute requiredRole="client">
    <ClientProfile />
  </ProtectedRoute>
} />
```

### Fix 4: Database Check

```sql
-- Check if user has client type
SELECT id, name, email, type FROM users WHERE type = 'client';

-- Check if profile data exists
SELECT * FROM users WHERE id = YOUR_USER_ID;
```

---

## Error Messages Explained

### "Failed to load profile data"
- Generic error
- Check network tab for actual error
- Usually means API request failed

### "Please log in to view your profile"
- 401 Unauthorized
- Token expired or missing
- Solution: Log in again

### "Profile not found"
- 404 Not Found
- User record doesn't exist
- Solution: Complete profile setup

### "Unexpected response format from server"
- API returned wrong format
- Check backend response structure
- Should have `status: 'success'` and `data` object

### "Validation errors: ..."
- When saving profile
- Shows which fields are invalid
- Fix the highlighted fields

---

## Component States

### Loading State
```
Shows: LoadingSpinner in center
Means: Fetching data from API
Wait: A few seconds
If stuck: Check backend is running
```

### Error State
```
Shows: Error message via toast
Means: Something went wrong
Action: Check console for details
```

### Success State
```
Shows: Profile data loaded
Can: Edit and save profile
```

---

## API Endpoints Used

### GET /api/profiles/me
**Purpose**: Fetch current user profile  
**Auth**: Required (Bearer token)  
**Response**: User profile data

### PUT /api/profiles/me
**Purpose**: Update profile  
**Auth**: Required  
**Body**: Profile fields to update

### POST /api/profiles/avatar
**Purpose**: Upload avatar image  
**Auth**: Required  
**Body**: FormData with image file

---

## Common Setup Issues

### Backend Not Configured

```bash
# Run migrations
php artisan migrate

# Seed database (if needed)
php artisan db:seed

# Create storage link
php artisan storage:link

# Clear cache
php artisan cache:clear
php artisan config:clear
```

### CORS Issues

```php
// config/cors.php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:5173'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

### Auth Issues

```php
// Make sure Sanctum is configured
// config/sanctum.php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,localhost:5173')),
```

---

## Testing Steps

### 1. Login Test
```
1. Go to /auth/login
2. Login with client credentials
3. Should redirect to /client/dashboard
4. Check localStorage has token and user
```

### 2. Profile Load Test
```
1. Navigate to /client/profile
2. Watch console for logs
3. Profile should load within 2 seconds
4. Should see user name and email
```

### 3. Edit Profile Test
```
1. Click "Edit Profile" button
2. Fields should become editable
3. Make changes
4. Click "Save Changes"
5. Should see success message
6. Should redirect to dashboard
```

### 4. Avatar Upload Test
```
1. Enter edit mode
2. Hover over avatar
3. Click camera icon
4. Select image < 5MB
5. Should upload and update
```

---

## Still Not Working?

### Check These Files

1. **EditableClientProfile.tsx**
   - Component code
   - Lines: 469

2. **App.tsx**
   - Line 27: Import path
   - Line ~191: Route definition

3. **laravelApi.ts**
   - API client configuration
   - Base URL settings

4. **AuthContext.tsx**
   - User state management
   - Token handling

### Get Full Error Details

```javascript
// In browser console:
// 1. Open Network tab
// 2. Try to load profile
// 3. Click on failed request
// 4. Look at Response tab
// 5. Copy error details
```

### Contact Support

Provide:
1. Console error messages
2. Network tab screenshot
3. User type (client/artisan)
4. Backend Laravel logs
5. Steps to reproduce

---

## Success Criteria

When working correctly, you should see:

1. ✅ Console: "🔄 Fetching profile from /profiles/me..."
2. ✅ Console: "📡 API Response: ..."
3. ✅ Console: "📥 Received profile data: ..."
4. ✅ Console: "✅ Profile data normalized and set"
5. ✅ Profile displays with your name and email
6. ✅ "Edit Profile" button visible
7. ✅ Can make changes and save

---

## Environment Checklist

- [ ] Backend running (php artisan serve)
- [ ] Frontend running (npm run dev)
- [ ] Database migrated
- [ ] User logged in as client
- [ ] Token in localStorage
- [ ] CORS configured
- [ ] API URL correct in .env
- [ ] No console errors
- [ ] Network request succeeds (200 status)
- [ ] Response format correct

---

**Last Updated**: October 9, 2025  
**Component**: EditableClientProfile  
**Version**: 1.0.0
