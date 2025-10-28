# Testing Guide: Artisan Jobs Database Integration

## Prerequisites
- ✅ Backend server running on `http://localhost:8000`
- ✅ Frontend server running on `http://localhost:3000`
- ✅ Database seeded with test data
- ✅ Artisan user account available

## Quick Start Test

### 1. Start Both Servers

**Terminal 1 - Backend:**
```powershell
cd backend
php artisan serve
```

**Terminal 2 - Frontend:**
```powershell
npm run dev
```

### 2. Login as Artisan

1. Navigate to: `http://localhost:3000/auth/login`
2. Use artisan credentials (from your seeded database)
3. You should be redirected to artisan dashboard

### 3. Navigate to Jobs Page

1. Click "Jobs" in the sidebar OR
2. Navigate directly to: `http://localhost:3000/artisan/jobs`

## What to Verify

### ✅ Page Loads Successfully
- [ ] No console errors
- [ ] Loading spinner shows briefly
- [ ] Page displays without crashing

### ✅ Real Data Displays
- [ ] Jobs shown are from the database (not mock data)
- [ ] Client names are real from the database
- [ ] Job details match database records
- [ ] No hardcoded demo data visible

### ✅ Statistics Are Accurate
Check the stats cards at the top:
- [ ] **Total Jobs** - Count of your assigned jobs
- [ ] **Active Jobs** - Count of jobs with status "in-progress"
- [ ] **Completion Rate** - Percentage of completed vs total jobs
- [ ] **Average Rating** - Average of all ratings received

### ✅ Filtering Works
Test each filter button:
- [ ] **All** - Shows all jobs (assigned + applied)
- [ ] **Open** - Shows only open jobs
- [ ] **In-progress** - Shows only active jobs
- [ ] **Completed** - Shows only completed jobs
- [ ] **Cancelled** - Shows only cancelled jobs

Count badges should update based on actual data.

### ✅ Search Functionality
- [ ] Enter text in search box
- [ ] Results filter by title, description, or category
- [ ] Empty state shows when no matches found

### ✅ Job Cards Display Correctly
Each job card should show:
- [ ] Job title
- [ ] Client name (from database)
- [ ] Location
- [ ] Posted date
- [ ] Status badge (with color)
- [ ] Priority badge (if applicable)
- [ ] Description
- [ ] Budget in Naira (₦)
- [ ] Estimated duration (if provided)
- [ ] Appropriate action button based on status

### ✅ Empty State
If no jobs exist:
- [ ] Briefcase icon displays
- [ ] "No jobs found" message shows
- [ ] Helpful text displayed

### ✅ Error Handling
To test error handling:
1. Stop the backend server
2. Refresh the jobs page
3. Verify:
   - [ ] Error message displays
   - [ ] "Try Again" button appears
   - [ ] Clicking "Try Again" attempts to reload

## API Request Verification

### Using Browser DevTools:

1. Open Developer Tools (F12)
2. Go to Network tab
3. Filter by XHR/Fetch
4. Navigate to `/artisan/jobs`

**Expected Requests:**

#### Request 1: My Jobs
```
GET http://localhost:8000/api/jobs/my-jobs
Status: 200 OK
```

**Response should contain:**
```json
{
  "status": "success",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "title": "Job Title",
        "client": {
          "id": 2,
          "name": "Client Name"
        },
        ...
      }
    ]
  }
}
```

#### Request 2: My Applications
```
GET http://localhost:8000/api/jobs/my-applications
Status: 200 OK
```

## Common Issues & Solutions

### Issue: "Failed to fetch jobs"
**Causes:**
- Backend server not running
- Database connection issue
- No authentication token

**Solutions:**
1. Verify backend is running: `php artisan serve`
2. Check database connection in `.env`
3. Try logging out and back in
4. Clear localStorage and cookies

### Issue: "No jobs found"
**Causes:**
- No jobs in database for this artisan
- Artisan hasn't been assigned any jobs

**Solutions:**
1. Create jobs as a client first
2. Assign jobs to the artisan in database:
```sql
UPDATE jobs SET artisan_id = <artisan_id> WHERE id = <job_id>;
```
3. Or have the artisan apply to jobs

### Issue: Stats showing "0" or "N/A"
**Causes:**
- No completed jobs yet
- No ratings received

**Solutions:**
- This is expected for new artisans
- Complete some jobs to see stats populate

### Issue: Duplicate jobs appearing
**Causes:**
- Job appears in both "my-jobs" and "my-applications"

**Solutions:**
- This is intentional: shows both assigned and applied jobs
- Backend logic prevents true duplicates

## Database Queries to Verify Data

### Check Jobs for Artisan:
```sql
-- Replace <artisan_user_id> with actual artisan user ID
SELECT * FROM jobs WHERE artisan_id = <artisan_user_id>;
```

### Check Applications:
```sql
-- Replace <artisan_user_id> with actual artisan user ID
SELECT * FROM jobs WHERE JSON_CONTAINS(applicants, '"<artisan_user_id>"');
```

### Create Test Job:
```sql
-- Create a test job for testing
INSERT INTO jobs (
  client_id, 
  title, 
  description, 
  category, 
  location, 
  budget, 
  status, 
  urgency,
  created_at,
  updated_at
) VALUES (
  2, -- Replace with actual client ID
  'Test Plumbing Job',
  'Fix the kitchen sink that is leaking',
  'plumbing',
  'Lagos, Nigeria',
  15000,
  'open',
  'medium',
  NOW(),
  NOW()
);
```

## Success Criteria

The integration is successful if:

1. ✅ No demo/mock data is visible
2. ✅ All jobs come from the database
3. ✅ API calls are made to `/api/jobs/my-jobs` and `/api/jobs/my-applications`
4. ✅ Statistics are calculated from real data
5. ✅ Filtering and search work correctly
6. ✅ Loading and error states display properly
7. ✅ No console errors or TypeScript errors
8. ✅ Job cards display all information correctly
9. ✅ Client names are fetched from relationships
10. ✅ Currency displays as Naira (₦)

## Performance Check

Monitor in DevTools Performance tab:
- [ ] Initial load time < 2 seconds
- [ ] No memory leaks
- [ ] Smooth scrolling through jobs list
- [ ] Filter changes are instant

## Browser Compatibility

Test in:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (if available)

---

## Report Issues

If you encounter any issues:

1. Check browser console for errors
2. Check Network tab for failed requests
3. Verify backend logs: `backend/storage/logs/laravel.log`
4. Check database connection
5. Ensure authentication is working

## Next Testing Phase

After basic integration works:
1. Test job application flow
2. Test job status updates
3. Test pagination (if you have > 15 jobs)
4. Test concurrent user scenarios
5. Test with different artisan accounts

---

**Last Updated:** January 15, 2025
**Status:** Ready for Testing
