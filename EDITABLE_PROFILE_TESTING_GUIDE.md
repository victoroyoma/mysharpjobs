# Quick Start Guide - Editable Artisan Profile Testing

## 🚀 Setup Steps (5 Minutes)

### 1. Run Database Migration

```bash
cd backend
php artisan migrate
```

Expected output:
```
Migrating: 2025_10_05_000000_enhance_users_profile_fields
Migrated:  2025_10_05_000000_enhance_users_profile_fields (XX.XXms)
```

### 2. Create Storage Symlink

```bash
php artisan storage:link
```

Expected output:
```
The [public/storage] link has been connected to [storage/app/public].
The links have been created.
```

### 3. Start Backend Server

```bash
php artisan serve
```

Backend will run at: `http://localhost:8000`

### 4. Start Frontend Server

Open a new terminal:

```bash
cd ../  # if you're in backend folder
npm run dev
```

Frontend will run at: `http://localhost:3000`

## 🧪 Testing Flow

### Step 1: Login as Artisan

1. Navigate to `http://localhost:3000/login`
2. Login with artisan credentials
3. You should be redirected to the artisan dashboard

### Step 2: Navigate to Profile

1. From the dashboard, click on "Profile" or navigate to `http://localhost:3000/artisan/profile`
2. You should see the editable profile page in **VIEW MODE**

### Step 3: Test Edit Mode

1. Click the **"Edit Profile"** button (top right)
2. The page should switch to **EDIT MODE** with:
   - Save and Cancel buttons visible
   - All fields become editable
   - Input borders highlighted

### Step 4: Test Profile Picture Upload

1. Click the camera icon (📷) on the profile picture
2. Select an image file (JPEG/PNG, max 5MB)
3. Image should upload immediately and display
4. Check browser console for success message

**API Call:**
```
POST /api/profiles/avatar
Response: { status: 'success', data: { avatar: '/storage/avatars/...' } }
```

### Step 5: Test Inline Editing

Edit these fields:

1. **Name:** Click on name → Edit → Should save on blur
2. **Phone:** Edit phone number
3. **Location:** Edit location string
4. **Bio:** Edit bio text (max 1000 characters)

### Step 6: Test Skills Management

**Add a Skill:**
1. Type skill name in the "Add skill" input
2. Select proficiency level (Beginner/Intermediate/Expert)
3. Click "Add Skill" button
4. Skill should appear in the list

**Remove a Skill:**
1. Click "Remove" button next to any skill
2. Skill should be removed from the list

### Step 7: Test Certifications Management

**Add a Certification:**
1. Enter certification name
2. Enter issuer name
3. Select date
4. Click "Add Certification"
5. Certification should appear in the list

**Remove a Certification:**
1. Click "Remove" button next to any certification
2. Certification should be removed from the list

### Step 8: Test Portfolio Gallery

**Upload Images:**
1. Click "Upload Portfolio Images" button
2. Select multiple images (max 10 total, 5MB each)
3. Images should upload and display in grid
4. Upload count should update (e.g., "5/10 images")

**Delete Image:**
1. Click "Delete" button on any portfolio image
2. Confirm deletion in the prompt
3. Image should be removed
4. Grid should re-arrange

**API Call:**
```
DELETE /api/profiles/portfolio/2
Response: { status: 'success', data: { portfolio_images: [...] } }
```

### Step 9: Test Experience, Rate & Radius

1. **Experience:** Edit years of experience (0-100)
2. **Hourly Rate:** Edit rate in ₦ (0-999999.99)
3. **Service Radius:** Adjust slider (5-100 km)

### Step 10: Test Availability Toggle

1. Click the availability toggle switch
2. Status should change instantly
3. No need to click "Save Profile"
4. Check browser console for API call

**API Call:**
```
PUT /api/profiles/availability
Request: { is_available: false }
Response: { status: 'success', data: { is_available: false } }
```

### Step 11: Save All Changes

1. After making multiple edits, click **"Save Profile"** button
2. Button should show loading state (spinner)
3. Success toast notification should appear
4. Page should switch back to VIEW MODE
5. All changes should be visible

**API Call:**
```
PUT /api/profiles/me
Request: { name, phone, bio, skills, certifications, ... }
Response: { status: 'success', data: { ...userObject } }
```

### Step 12: Test Cancel

1. Click "Edit Profile" again
2. Make some changes
3. Click "Cancel" button
4. Changes should revert to original values
5. Page switches back to VIEW MODE

## 📋 Validation Tests

### Test Invalid Skills

1. Try adding a skill without name → Should show error
2. Try adding a skill without level → Should show error

### Test Invalid Certifications

1. Try adding certification without name → Should show error
2. Try adding certification without issuer → Should show error
3. Try adding certification without date → Should show error

### Test File Upload Limits

1. Try uploading image > 5MB → Should show error
2. Try uploading non-image file → Should show error
3. Try uploading 11th portfolio image → Should be disabled/show message

### Test Field Validations

1. **Experience:** Try entering negative number → Should validate
2. **Hourly Rate:** Try entering invalid number → Should validate
3. **Service Radius:** Try setting below 5 or above 100 → Should be constrained
4. **Bio:** Try entering > 1000 characters → Should be limited

## 🔍 API Response Verification

### Check Profile Fetch (Page Load)

Open browser DevTools → Network tab

```http
GET http://localhost:8000/api/profiles/me

Response:
{
  "status": "success",
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "skills": [...],
    "portfolio_images": [...],
    // ... full user object
  }
}
```

### Check Profile Update (Save Button)

```http
PUT http://localhost:8000/api/profiles/me

Request Payload:
{
  "name": "Updated Name",
  "phone": "+234 123 456 7890",
  "bio": "Updated bio...",
  "skills": [
    {"name": "Plumbing", "level": "Expert"}
  ],
  "certifications": [
    {"name": "Cert Name", "issuer": "Issuer", "date": "2023-01-15"}
  ],
  "experience": 5,
  "hourly_rate": 5000,
  "service_radius": 20
}

Response:
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": { /* updated user object */ }
}
```

### Check Avatar Upload

```http
POST http://localhost:8000/api/profiles/avatar
Content-Type: multipart/form-data

Form Data:
image: [File]

Response:
{
  "status": "success",
  "message": "Profile picture uploaded successfully",
  "data": {
    "avatar": "/storage/avatars/abc123.jpg"
  }
}
```

### Check Portfolio Upload

```http
POST http://localhost:8000/api/profiles/portfolio
Content-Type: multipart/form-data

Form Data:
images[]: [File1]
images[]: [File2]

Response:
{
  "status": "success",
  "message": "Portfolio images uploaded successfully",
  "data": {
    "portfolio_images": [
      "/storage/portfolios/img1.jpg",
      "/storage/portfolios/img2.jpg"
    ]
  }
}
```

### Check Portfolio Delete

```http
DELETE http://localhost:8000/api/profiles/portfolio/0

Response:
{
  "status": "success",
  "message": "Portfolio image deleted successfully",
  "data": {
    "portfolio_images": [
      "/storage/portfolios/img1.jpg"
    ]
  }
}
```

### Check Availability Toggle

```http
PUT http://localhost:8000/api/profiles/availability

Request:
{
  "is_available": false
}

Response:
{
  "status": "success",
  "message": "Availability updated successfully",
  "data": {
    "is_available": false
  }
}
```

## 🐛 Common Issues & Solutions

### Issue: 404 Error on Storage URLs

**Problem:** Images not loading, 404 error on `/storage/...` URLs

**Solution:**
```bash
php artisan storage:link
```

### Issue: 422 Validation Error on Save

**Problem:** "Validation error" when saving profile

**Solution:**
- Check browser console for detailed error messages
- Verify all required fields are filled
- Ensure skill levels are exactly: Beginner, Intermediate, or Expert
- Check date format for certifications (YYYY-MM-DD)

### Issue: 500 Server Error

**Problem:** Internal server error on any endpoint

**Solution:**
```bash
# Check Laravel logs
tail -f backend/storage/logs/laravel.log

# Check file permissions
chmod -R 775 backend/storage
chmod -R 775 backend/bootstrap/cache
```

### Issue: CORS Error

**Problem:** CORS policy blocking API requests

**Solution:**
Check `backend/config/cors.php`:
```php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

### Issue: Unauthenticated Error (401)

**Problem:** "Unauthenticated" error on API calls

**Solution:**
- Ensure you're logged in
- Check if token is being sent in Authorization header
- Verify Sanctum middleware is applied to routes

### Issue: Portfolio Images Not Uploading

**Problem:** Images not uploading or getting stuck

**Solution:**
1. Check file size (max 5MB per image)
2. Check file format (JPEG, PNG, JPG only)
3. Check total count (max 10 images)
4. Verify PHP upload limits in `php.ini`:
   ```ini
   upload_max_filesize = 10M
   post_max_size = 10M
   ```

## ✅ Success Indicators

All tests passed if you see:

- ✅ Profile loads with current data
- ✅ Edit mode toggles correctly
- ✅ Avatar uploads and displays immediately
- ✅ Skills can be added and removed
- ✅ Certifications can be added and removed
- ✅ Portfolio images upload, display, and delete
- ✅ All fields save correctly
- ✅ Availability toggle works instantly
- ✅ Cancel button reverts changes
- ✅ Success toast notifications appear
- ✅ No errors in browser console
- ✅ No errors in Laravel logs

## 🎯 Performance Checks

### Page Load Time
- Profile should load within 1-2 seconds
- Images should load progressively

### Save Time
- Profile update should complete within 1 second
- Success notification should appear immediately

### Image Upload Time
- Avatar upload: 1-3 seconds (depending on size)
- Portfolio upload: 2-5 seconds for multiple images

### Availability Toggle
- Should be instant (< 500ms)
- No visible delay

## 📱 Browser Testing

Test in multiple browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (if on Mac)

Test responsive design:
- ✅ Desktop (1920x1080)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

## 📊 Database Verification

Check if data is persisted correctly:

```bash
# Access Laravel Tinker
php artisan tinker

# Fetch artisan user
$user = App\Models\User::where('type', 'artisan')->first();

# Check fields
$user->skills;
$user->certifications;
$user->portfolio_images;
$user->hourly_rate;
$user->is_available;
```

## 🎉 Final Checklist

- [ ] Migration completed successfully
- [ ] Storage link created
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Logged in as artisan
- [ ] Profile page loads correctly
- [ ] Edit mode works
- [ ] Avatar upload tested
- [ ] Skills CRUD tested
- [ ] Certifications CRUD tested
- [ ] Portfolio upload/delete tested
- [ ] All field validations work
- [ ] Save profile works
- [ ] Cancel works
- [ ] Availability toggle works
- [ ] No console errors
- [ ] No server errors
- [ ] Data persists correctly

---

**Status:** Ready for full-stack testing! 🚀

If all tests pass, the editable artisan profile feature is complete and production-ready.
