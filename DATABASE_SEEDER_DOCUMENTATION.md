# Database Seeder Documentation

**Created:** October 2, 2025  
**Purpose:** Seed database with admin, artisan, and client users for MySharpJobs platform

---

## Overview

The database seeder creates test users with complete profiles for development and testing purposes. All users use the `@mysharpjobs.ng` email domain.

---

## Seeded Users

### 1. 👤 Admin User (Full CRUD Rights)

**Credentials:**
- **Email:** `admin@mysharpjobs.ng`
- **Password:** `Admin@123`
- **Type:** `admin`

**Capabilities:**
- ✅ Full CRUD access to all database tables
- ✅ User management (create, read, update, delete users)
- ✅ Job management (approve, reject, delete jobs)
- ✅ Payment oversight (view all transactions)
- ✅ System configuration
- ✅ Analytics and reporting
- ✅ Content moderation

**Profile Details:**
- Name: Admin User
- Location: Warri, Delta State, Nigeria
- Phone: +2348012345678
- Verified: Yes
- Email Verified: Yes

---

### 2. 🔧 Artisan User (Service Provider)

**Credentials:**
- **Email:** `artisan@mysharpjobs.ng`
- **Password:** `Artisan@123`
- **Type:** `artisan`

**Professional Details:**
- **Name:** John Carpenter
- **Specialization:** Professional Carpenter
- **Experience:** 8 years
- **Rating:** 4.85/5.00
- **Reviews:** 127 reviews
- **Completed Jobs:** 145 jobs
- **Hourly Rate:** ₦5,000.00

**Skills:**
- Carpentry
- Cabinet Installation
- Custom Furniture
- Woodworking
- Door & Window Installation
- Deck Building

**Certifications:**
- Certified Professional Carpenter
- Safety Training Certificate
- Advanced Woodworking Diploma

**Service Details:**
- Response Time: Within 1 hour
- Working Hours: 8:00 AM - 6:00 PM
- Service Radius: 25 km
- Emergency Service: Available
- Insurance: Verified

**Location Settings:**
- GPS Tracking: Enabled
- Location Sharing: Enabled
- Coordinates: Warri (5.5167, 5.75)

**Banking:**
- Bank: Access Bank
- Account: 0123456789
- Name: John Carpenter

---

### 3. 👨‍💼 Client User (Job Poster)

**Credentials:**
- **Email:** `client@mysharpjobs.ng`
- **Password:** `Client@123`
- **Type:** `client`

**Profile Details:**
- **Name:** Sarah Johnson
- **Location:** Warri, Delta State, Nigeria
- **Phone:** +2348034567890
- **Verified:** Yes
- **Email Verified:** Yes

**Activity:**
- Jobs Posted: 23
- Total Spent: ₦450,000.00
- Preferred Payment: Card
- Business Type: Individual

**Bio:**
Homeowner and property manager looking for reliable artisans for home improvement and maintenance projects.

---

## Additional Test Users

### Additional Artisans

#### 1. Emmanuel Plumber
- **Email:** `plumber@mysharpjobs.ng`
- **Password:** `Password@123`
- **Skills:** Plumbing, Pipe Installation, Leak Repair, Water Heater
- **Experience:** 5 years
- **Rate:** ₦4,000/hour

#### 2. David Electrician
- **Email:** `electrician@mysharpjobs.ng`
- **Password:** `Password@123`
- **Skills:** Electrical Wiring, Installation, Repair, Maintenance
- **Experience:** 7 years
- **Rate:** ₦4,500/hour

#### 3. Michael Painter
- **Email:** `painter@mysharpjobs.ng`
- **Password:** `Password@123`
- **Skills:** Interior/Exterior Painting, Wall Preparation, Finishing
- **Experience:** 4 years
- **Rate:** ₦3,500/hour

### Additional Clients

#### 1. James Property Owner
- **Email:** `james@mysharpjobs.ng`
- **Password:** `Password@123`

#### 2. Grace Business Manager
- **Email:** `grace@mysharpjobs.ng`
- **Password:** `Password@123`

---

## Running the Seeder

### Method 1: Fresh Migration with Seeding
```bash
cd backend
php artisan migrate:fresh --seed
```

This will:
1. Drop all tables
2. Run all migrations
3. Run all seeders

### Method 2: Run Seeder Only
```bash
cd backend
php artisan db:seed
```

This will run seeders without affecting existing data.

### Method 3: Run Specific Seeder
```bash
cd backend
php artisan db:seed --class=DatabaseSeeder
```

---

## Expected Output

```
═══════════════════════════════════════════════════════════
🎉 Database seeding completed successfully!
═══════════════════════════════════════════════════════════

📋 Login Credentials:

👤 Admin User:
   Email: admin@mysharpjobs.ng
   Password: Admin@123
   Access: Full CRUD rights & system administration

🔧 Artisan User:
   Email: artisan@mysharpjobs.ng
   Password: Artisan@123
   Role: Professional Carpenter

👨‍💼 Client User:
   Email: client@mysharpjobs.ng
   Password: Client@123
   Role: Job Poster & Client

═══════════════════════════════════════════════════════════
```

---

## Testing the Seeded Users

### 1. Test Admin Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mysharpjobs.ng",
    "password": "Admin@123"
  }'
```

### 2. Test Artisan Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "artisan@mysharpjobs.ng",
    "password": "Artisan@123"
  }'
```

### 3. Test Client Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@mysharpjobs.ng",
    "password": "Client@123"
  }'
```

---

## User Features by Type

### Admin Features
- ✅ View all users
- ✅ Create/Edit/Delete users
- ✅ View all jobs
- ✅ Approve/Reject jobs
- ✅ View all payments
- ✅ View analytics dashboard
- ✅ Manage system settings
- ✅ Handle disputes
- ✅ Ban/Unban users

### Artisan Features
- ✅ Create profile with skills
- ✅ Upload portfolio images
- ✅ Upload certifications
- ✅ Browse available jobs
- ✅ Apply to jobs
- ✅ Manage job applications
- ✅ Track earnings
- ✅ Enable GPS location
- ✅ Set availability status
- ✅ Receive job notifications
- ✅ Chat with clients

### Client Features
- ✅ Post new jobs
- ✅ Browse artisans
- ✅ View artisan profiles
- ✅ Hire artisans
- ✅ Track job progress
- ✅ Make payments
- ✅ Leave reviews
- ✅ Chat with artisans
- ✅ View job history
- ✅ Track artisan location

---

## Database Structure

### Users Table Fields

**Common Fields:**
- id, name, email, password, type
- avatar, location, phone
- is_verified, is_email_verified
- joined_date, last_active

**Admin Fields:**
- All standard fields
- Additional permissions in middleware

**Artisan Fields:**
- skills (JSON)
- experience, rating, review_count
- completed_jobs, hourly_rate
- is_available, bio
- certifications (JSON)
- portfolio_images (JSON)
- response_time, working_hours
- service_radius, preferred_categories
- emergency_service, insurance_verified
- verification_documents (JSON)
- location_settings (JSON)
- bank_details (JSON)

**Client Fields:**
- jobs_posted, total_spent
- preferred_payment_method
- business_type, company_name
- company_registration_number, tax_id

---

## Security Notes

### Password Policy
All seeded passwords follow the format:
- **Admin:** `Admin@123`
- **Artisan:** `Artisan@123`
- **Client:** `Client@123`
- **Others:** `Password@123`

⚠️ **Important:** These are development/testing passwords. Change them in production!

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (@, #, $, etc.)

### Email Verification
All seeded users have `is_email_verified` set to `true` for testing purposes.

---

## Troubleshooting

### Error: "SQLSTATE[23000]: Integrity constraint violation"
**Solution:** The seeder tries to create users that already exist. Run:
```bash
php artisan migrate:fresh --seed
```

### Error: "Class 'Hash' not found"
**Solution:** Ensure you have:
```php
use Illuminate\Support\Facades\Hash;
```

### Error: "Call to undefined method User::create()"
**Solution:** Check that your User model has:
```php
protected $fillable = [ ... ];
```

---

## Customization

### Adding More Users
Edit `backend/database/seeders/DatabaseSeeder.php`:

```php
private function createAdditionalUsers(): void
{
    // Add your custom users here
}
```

### Changing Passwords
```php
'password' => Hash::make('YourCustomPassword@123'),
```

### Changing Email Domain
Replace all instances of `@mysharpjobs.ng` with your domain.

---

## Production Considerations

### Before Deploying to Production:

1. **Remove or Disable Seeder**
   ```php
   // Comment out in production
   // User::create([...]);
   ```

2. **Change All Passwords**
   - Use strong, unique passwords
   - Never use test passwords

3. **Disable Auto Email Verification**
   ```php
   'is_email_verified' => false, // Require real verification
   ```

4. **Remove Test Data**
   - Don't seed test users in production
   - Use real user registration flow

5. **Update Email Domain**
   - Use your actual domain
   - Configure email service (SendGrid, Mailgun, etc.)

---

## Next Steps

After seeding:

1. **Test Authentication**
   - Login with each user type
   - Verify JWT tokens work

2. **Test Permissions**
   - Admin should access admin routes
   - Artisan should access artisan routes
   - Client should access client routes

3. **Test WebSocket**
   - Start Reverb: `php artisan reverb:start`
   - Test real-time features

4. **Test Frontend Integration**
   - Login from React frontend
   - Verify API calls work

---

## Quick Reference

| User Type | Email | Password | Purpose |
|-----------|-------|----------|---------|
| Admin | admin@mysharpjobs.ng | Admin@123 | Full system access |
| Artisan | artisan@mysharpjobs.ng | Artisan@123 | Service provider |
| Client | client@mysharpjobs.ng | Client@123 | Job poster |
| Plumber | plumber@mysharpjobs.ng | Password@123 | Test artisan |
| Electrician | electrician@mysharpjobs.ng | Password@123 | Test artisan |
| Painter | painter@mysharpjobs.ng | Password@123 | Test artisan |
| James | james@mysharpjobs.ng | Password@123 | Test client |
| Grace | grace@mysharpjobs.ng | Password@123 | Test client |

---

## Support

For issues or questions:
1. Check Laravel logs: `storage/logs/laravel.log`
2. Check database connection: `php artisan migrate:status`
3. Verify User model fillable fields
4. Check migration files

---

**Status:** ✅ Ready for use  
**Total Users Seeded:** 8 users (1 admin, 4 artisans, 3 clients)  
**Email Domain:** mysharpjobs.ng
