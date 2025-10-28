# Admin Dashboard - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Ensure Prerequisites
```bash
# Backend running
cd backend
php artisan serve
# Should see: Server running on http://localhost:8000

# Frontend running
npm run dev
# Should see: Local: http://localhost:3000
```

### Step 2: Create Admin User (If Not Exists)

**Option A: Using Database**
```sql
-- Connect to your database
UPDATE users 
SET type = 'admin' 
WHERE email = 'your-email@example.com';
```

**Option B: Using Tinker**
```bash
cd backend
php artisan tinker

>>> $user = User::where('email', 'your-email@example.com')->first();
>>> $user->type = 'admin';
>>> $user->save();
>>> exit
```

**Option C: Create New Admin**
```bash
php artisan tinker

>>> $admin = new App\Models\User();
>>> $admin->name = 'Admin User';
>>> $admin->email = 'admin@mysharpjobs.com';
>>> $admin->password = Hash::make('password123');
>>> $admin->type = 'admin';
>>> $admin->email_verified_at = now();
>>> $admin->save();
>>> exit
```

### Step 3: Login as Admin
1. Go to: `http://localhost:3000/login`
2. Enter admin credentials
3. You'll be redirected to admin dashboard

### Step 4: Explore Features

#### Overview Tab (Default)
- View platform statistics
- Monitor real-time activities
- Check system health

#### User Management Tab
- Click "User Management" in the navigation
- Search for users by name, email, or phone
- Filter by type (Client/Artisan)
- Click "View" on any user to see full details

#### Job Interactions Tab
- Monitor all job activities
- Filter by status
- View client and artisan interactions

#### Verifications Tab
- Review pending artisan verifications
- Approve or reject with reasons

---

## 🎯 What You Can Do

### View All Users
1. Click "User Management" tab
2. Use search bar to find specific users
3. Use dropdown to filter by type (All/Clients/Artisans)
4. Use sort dropdown to order by date, name, or email

### View User Details
1. Find user in the list
2. Click "View" button
3. See comprehensive information:
   - Profile and contact info
   - Statistics (jobs, earnings/spending)
   - Recent jobs
   - Recent payments
   - Account status

### Monitor Platform Activity
1. Stay on "Overview" tab
2. Check "Real-time Activities" panel
3. See user registrations, job postings, payments
4. Activities auto-refresh every 30 seconds

### Export Data
1. Scroll to bottom of dashboard
2. Click export button for desired data type
3. Choose JSON or CSV format

---

## 🔍 Quick Tips

### Finding Specific Users
```
Search supports:
✓ Name (partial match)
✓ Email (partial match)
✓ Phone number
```

### Understanding Status Badges
- 🟢 **Green (Verified)**: User identity confirmed
- 🔴 **Red (Suspended)**: Account temporarily disabled
- 🔵 **Blue (Profile Complete)**: All profile fields filled

### User Type Badges
- 🔵 **Blue**: Client (posts jobs)
- 🟣 **Purple**: Artisan (performs work)

### Activity Priority Colors
- 🔴 **Red**: High priority (payments)
- 🟡 **Yellow**: Medium priority (jobs)
- 🟢 **Green**: Low priority (registrations)

---

## 📊 Understanding the Data

### Dashboard Stats Card Meanings

**Total Users**
- All registered users (clients + artisans)
- Green number = new signups this month

**Total Jobs**
- All jobs ever created
- Blue number = currently active jobs

**Total Revenue**
- All completed payments
- Green number = revenue this month

**Platform Health**
- User satisfaction rating (out of 5.0)
- Orange number = open disputes

### User Statistics

**For Clients:**
- Posted Jobs: Total jobs created
- Active Jobs: Currently open or in-progress
- Completed Jobs: Successfully finished
- Total Spent: Sum of all payments

**For Artisans:**
- Assigned Jobs: Jobs accepted
- Active Jobs: Currently working on
- Completed Jobs: Successfully finished
- Total Earnings: Sum of received payments
- Rating: Average from client reviews
- Total Reviews: Number of ratings received

---

## ⚠️ Common Issues

### Can't Access Admin Dashboard
**Solution:**
1. Check user type in database: `SELECT type FROM users WHERE email = 'your-email@example.com'`
2. Should return `admin`
3. If not, run update query from Step 2

### Activities Panel Empty
**Normal if:**
- Fresh installation with no data
- No recent user activity
**Solution:** Create test users, jobs, or payments

### User Details Modal Won't Open
**Check:**
1. Browser console for errors (F12)
2. Network tab for failed API requests
3. Backend logs: `backend/storage/logs/laravel.log`

### Pagination Not Working
**Check:**
- Database has more than 20 users
- API response includes pagination object

---

## 🛠️ Troubleshooting

### Backend Issues

**Check if server is running:**
```bash
curl http://localhost:8000/api/health
```

**Check admin routes:**
```bash
cd backend
php artisan route:list --path=admin
```

**View logs:**
```bash
tail -f backend/storage/logs/laravel.log
```

### Frontend Issues

**Check console:**
1. Press F12
2. Go to Console tab
3. Look for red error messages

**Check network requests:**
1. Press F12
2. Go to Network tab
3. Click "View" button on a user
4. Check request status (should be 200)

### Database Issues

**Verify connection:**
```bash
cd backend
php artisan tinker
>>> DB::connection()->getPdo();
>>> exit
```

**Check data exists:**
```sql
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM jobs;
SELECT COUNT(*) FROM payments;
```

---

## 📚 Documentation Reference

- **Full Implementation**: See `ADMIN_DASHBOARD_FULL_ACCESS.md`
- **Testing Guide**: See `ADMIN_DASHBOARD_TESTING_GUIDE.md`
- **API Reference**: See `ADMIN_API_REFERENCE.md`
- **Summary**: See `ADMIN_IMPLEMENTATION_SUMMARY.md`

---

## 🎓 Learning Resources

### Admin Dashboard Features
1. **Overview Tab**: Platform-wide statistics and monitoring
2. **User Management**: Complete user database access
3. **Job Interactions**: Job lifecycle monitoring
4. **Verifications**: Artisan verification workflow
5. **Disputes**: Conflict resolution interface
6. **Analytics**: Data trends and insights

### Key Concepts

**Real-Time Activities**
- Updates every 30 seconds automatically
- Shows last 20 activities
- Sorted by most recent first

**User Details Modal**
- Click any "View" button to open
- Shows comprehensive user information
- Click X or outside modal to close

**Filters and Search**
- Changes reload data automatically
- Combines with pagination
- Results update in real-time

---

## ✅ Quick Checklist

Before using admin dashboard:
- [ ] Backend server running (localhost:8000)
- [ ] Frontend server running (localhost:3000)
- [ ] Admin user created in database
- [ ] Logged in with admin credentials
- [ ] Database has sample data (optional)

First time setup:
- [ ] Explore Overview tab
- [ ] Check User Management tab
- [ ] View a user's details
- [ ] Test search functionality
- [ ] Try different filters
- [ ] Check activities panel

---

## 🚀 You're Ready!

**Default URL**: `http://localhost:3000/admin/dashboard`

**Default Admin Credentials** (if using seeder):
```
Email: admin@mysharpjobs.com
Password: password123
```

**Next Steps:**
1. Explore each tab
2. View user details
3. Monitor activities
4. Test filtering and search
5. Refer to documentation for advanced features

---

## 💡 Pro Tips

1. **Bookmark the dashboard**: `http://localhost:3000/admin/dashboard`
2. **Keep activities panel visible**: Auto-refreshes to show latest activity
3. **Use search first**: Faster than scrolling through pages
4. **Check user details before actions**: Full context for decisions
5. **Export data regularly**: Backup important records

---

## 🆘 Need Help?

1. Check browser console (F12) for frontend errors
2. Check `backend/storage/logs/laravel.log` for backend errors
3. Review documentation files in project root
4. Verify database connections and data
5. Test API endpoints directly with cURL or Postman

---

**Happy Administrating! 🎉**

**Version**: 1.0  
**Last Updated**: January 4, 2025  
**Platform**: MySharpJobs Admin Dashboard

