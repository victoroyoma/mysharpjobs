# Admin Login Testing Guide

## Issue
Admin login is refusing to login and redirect to the admin dashboard

## Admin Credentials
Based on the database seeder (`DatabaseSeeder.php`):

### Primary Admin Account
- **Email**: `admin@mysharpjobs.ng`
- **Password**: `Admin@123`
- **Type**: admin
- **Status**: Verified

### Additional Admin (if exists)
- **Email**: `admin@mysharpjob.com`
- **Password**: Unknown (not in seeder)

## Testing Steps

### 1. Test Backend Login API
```bash
# Test admin login via API
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@mysharpjobs.ng\",\"password\":\"Admin@123\"}"
```

### 2. Check User Type in Response
The response should include:
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@mysharpjobs.ng",
      "type": "admin",  // ← This should be "admin"
      ...
    },
    "token": "...",
    "refreshToken": "..."
  }
}
```

### 3. Frontend Login Flow
The login flow in `Login.tsx` should:
1. Call `login(email, password)` from AuthContext
2. Get response with user.type = "admin"
3. Navigate to `/admin/dashboard`

### 4. Protected Route Check
The `ProtectedRoute` component should:
1. Check if user is authenticated
2. Check if user.type === "admin"
3. Allow access to `/admin/dashboard`

## Possible Issues

### Issue 1: User Type Mismatch
- **Problem**: The database has `type = 'admin'` but frontend expects something else
- **Check**: Browser console logs for the user object

### Issue 2: Authentication Not Persisting
- **Problem**: Token not being saved in localStorage
- **Check**: localStorage.getItem('token') in browser console

### Issue 3: Middleware Blocking Request
- **Problem**: AdminMiddleware rejecting the request
- **Check**: Network tab for 403 errors on /api/admin/dashboard

### Issue 4: Frontend Redirect Logic
- **Problem**: Switch statement not matching 'admin' case
- **Check**: Console logs in Login.tsx

## Debug Commands

### Check Admin User in Database
```bash
cd backend
php artisan tinker --execute="print_r(DB::table('users')->where('type', 'admin')->pluck('email')->toArray());"
```

### Test Password Hash
```bash
php artisan tinker --execute="var_dump(Hash::check('Admin@123', DB::table('users')->where('email', 'admin@mysharpjobs.ng')->value('password')));"
```

### Clear All Caches
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

## Browser Testing Checklist
1. Open browser console (F12)
2. Clear localStorage and cookies
3. Navigate to http://localhost:3000/login
4. Enter: `admin@mysharpjobs.ng` / `Admin@123`
5. Watch console logs for:
   - "🔍 Full login response"
   - "✅ Login successful! User type: admin"
   - "🚀 Redirecting to /admin/dashboard"
6. Check Network tab for:
   - POST to `/api/auth/login` (should return 200)
   - GET to `/api/admin/dashboard` (should return 200, not 403)

## Expected Console Logs
```
🔍 Full login response: {status: "success", message: "Login successful", data: {...}}
🔍 Response.data: {user: {...}, token: "...", refreshToken: "..."}
🔍 Extracted user: {id: 1, name: "Admin User", type: "admin", ...}
🔍 Extracted token: "..."
🔍 Extracted refreshToken: "..."
✅ Login successful! User type: admin
🚀 Redirecting to /admin/dashboard
```

## Solution Checklist
- [ ] Verify admin user exists with correct password
- [ ] Verify login API returns user with type="admin"
- [ ] Verify AuthContext saves token to localStorage
- [ ] Verify ProtectedRoute allows admin access
- [ ] Verify AdminMiddleware is properly configured
- [ ] Verify no console errors during login
- [ ] Verify successful redirect to /admin/dashboard
