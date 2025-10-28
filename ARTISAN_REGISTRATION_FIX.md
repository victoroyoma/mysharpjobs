# 🔧 Artisan Registration Fix - hourly_rate Requirement Removed

## Problem

When attempting to register as an artisan, users encountered this error:

```
• The hourly rate field is required when type is artisan.
```

However, `hourly_rate` is not included in the registration form and should only be required during the **profile setup** phase, not during initial registration.

---

## Root Cause

**File**: `backend/app/Http/Controllers/AuthController.php`

**Line 35** (Registration validation):
```php
'hourlyRate' => 'required_if:type,artisan|numeric|min:0',  // ❌ WRONG
```

This validation rule made `hourlyRate` **required** when registering as an artisan, but:
- The frontend registration form doesn't have an hourly rate field
- Hourly rate should be set during the profile setup step (after registration)
- This prevented artisans from completing registration

---

## Solution Applied

### Fix #1: Updated Validation Rule

**File**: `backend/app/Http/Controllers/AuthController.php` (Line 35)

**Before** ❌:
```php
'hourlyRate' => 'required_if:type,artisan|numeric|min:0',
```

**After** ✅:
```php
'hourlyRate' => 'nullable|numeric|min:0', // Optional during registration, required in profile setup
```

**Why This Works**:
- `nullable` - Field is optional during registration
- `numeric|min:0` - If provided, it must be a valid positive number
- Still validated in `ProfileSetupController` for profile completion

### Fix #2: Set Default Value

**File**: `backend/app/Http/Controllers/AuthController.php` (Line 70)

**Before** ❌:
```php
$userData['hourly_rate'] = $request->hourlyRate;
```

**After** ✅:
```php
$userData['hourly_rate'] = $request->hourlyRate ?? 0; // Default to 0, will be set in profile setup
```

**Why This Works**:
- Sets a default value of `0` if not provided
- Database column is `nullable`, so this is safe
- Will be properly set to actual rate during profile setup
- Prevents null constraint issues

---

## Registration Flow (Corrected)

### Artisan Registration:

```
1. User fills registration form:
   - Name ✅
   - Email ✅
   - Password ✅
   - Phone ✅
   - Location ✅
   - Type: Artisan ✅
   - Skills (basic) ✅
   - Experience ✅
   - ❌ NO hourly_rate (not in form)

2. Frontend sends registration data:
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "Password@123",
     "phone": "+2348012345678",
     "type": "artisan",
     "location": "Warri, Nigeria",
     "skills": ["Carpentry"],
     "experience": 5
     // ❌ hourlyRate not included
   }

3. Backend creates user with:
   - hourly_rate = 0 (default) ✅
   - profile_completed = false ✅

4. User redirected to profile setup ✅

5. Profile setup collects:
   - Bio (min 100 chars)
   - Skills (min 3)
   - Hourly Rate ← Set here! ✅
   - Service Radius
   - Portfolio
   - Bank Details

6. Profile setup updates hourly_rate properly ✅

7. User redirected to dashboard ✅
```

---

## Validation Rules Comparison

### Registration (AuthController)

| Field | Artisan | Client | Notes |
|-------|---------|--------|-------|
| name | Required | Required | - |
| email | Required | Required | Must be unique |
| password | Required | Required | Min 6, mixed case, numbers |
| type | Required | Required | artisan or client |
| location | Required | Required | - |
| phone | Optional | Optional | - |
| skills | Required | N/A | Array, min 1 item |
| experience | Required | N/A | Numeric, min 0 |
| **hourlyRate** | **Optional** ✅ | **N/A** | Default to 0 |
| bio | Optional | N/A | Max 1000 chars |
| certifications | Optional | N/A | Array |
| businessType | N/A | Optional | individual or business |
| companyName | N/A | Optional | - |
| preferredPaymentMethod | N/A | Optional | - |

### Profile Setup (ProfileSetupController)

| Field | Artisan | Client | Notes |
|-------|---------|--------|-------|
| bio | Required | N/A | Min 100, max 1000 |
| skills | Required | N/A | Array, min 3 |
| **hourly_rate** | **Required** ✅ | **N/A** | Min 10, max 100,000 |
| service_radius | Required | N/A | Min 5, max 100 km |
| portfolio_images | Required | N/A | Array, min 3, max 10 |
| bank_details | Required | N/A | Account name, number, bank |
| certifications | Optional | N/A | Array, max 10 |
| business_type | N/A | Required | individual or business |
| location | N/A | Required | - |
| preferred_payment_method | N/A | Required | - |

---

## Database Schema Verification

**Table**: `users`  
**Column**: `hourly_rate`

```sql
$table->decimal('hourly_rate', 10, 2)->nullable();
```

✅ **Already nullable** - No migration needed  
✅ **Indexed** - Good for performance  
✅ **Decimal(10,2)** - Supports large values with 2 decimal places

---

## Testing

### Test Artisan Registration (Should Work Now)

1. **Navigate to**: `http://localhost:5173/signup`

2. **Select**: Artisan

3. **Fill form**:
   ```
   Name: Test Artisan
   Email: testartisan@example.com
   Password: Password@123
   Phone: +2348012345678
   Location: Warri, Delta State, Nigeria
   Skills: Carpentry
   Experience: 5
   ```

4. **Click**: Sign Up

5. **Expected Result**:
   ```
   ✅ Registration successful
   ✅ No hourly_rate error
   ✅ Redirected to /profile-setup/artisan
   ✅ User created with hourly_rate = 0
   ```

### Test Profile Setup (Should Still Work)

1. **Complete profile setup steps**

2. **Step 3**: Enter hourly rate (e.g., 5000)

3. **Expected Result**:
   ```
   ✅ Profile setup successful
   ✅ hourly_rate updated to 5000
   ✅ Redirected to /artisan/dashboard
   ✅ Dashboard shows correct hourly rate
   ```

---

## Verification Queries

### Check User After Registration

```sql
SELECT 
    id, 
    name, 
    email, 
    type, 
    hourly_rate, 
    profile_completed, 
    profile_completion_percentage
FROM users 
WHERE email = 'testartisan@example.com';
```

**Expected Result**:
```
hourly_rate: 0.00
profile_completed: 0 (false)
profile_completion_percentage: ~30-40%
```

### Check User After Profile Setup

```sql
SELECT 
    id, 
    name, 
    hourly_rate, 
    profile_completed, 
    profile_completion_percentage
FROM users 
WHERE email = 'testartisan@example.com';
```

**Expected Result**:
```
hourly_rate: 5000.00 (or whatever was entered)
profile_completed: 1 (true)
profile_completion_percentage: 100
```

---

## Error Scenarios Fixed

### ❌ Before Fix:

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": {
    "hourlyRate": [
      "The hourly rate field is required when type is artisan."
    ]
  }
}
```

### ✅ After Fix:

```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "Test Artisan",
      "email": "testartisan@example.com",
      "type": "artisan",
      "hourly_rate": 0,
      "profile_completed": false,
      ...
    },
    "token": "1|abc123...",
    "refreshToken": "xyz789..."
  }
}
```

---

## Files Modified

1. **backend/app/Http/Controllers/AuthController.php**
   - Line 35: Changed `hourlyRate` validation from `required_if:type,artisan` to `nullable`
   - Line 70: Added default value `?? 0` for `hourly_rate`

**Total Files Modified**: 1  
**Lines Changed**: 2  
**Impact**: High (fixes registration blocker)

---

## Related Components (Unchanged)

### ✅ Still Working Correctly:

- **Frontend Registration Form** (`src/pages/Auth/SignUp.tsx`)
  - Correctly doesn't include hourly_rate field
  - No changes needed

- **Profile Setup Controller** (`backend/app/Http/Controllers/ProfileSetupController.php`)
  - Still requires hourly_rate during profile setup
  - Validation remains strict: `required|numeric|min:10|max:100000`
  - No changes needed

- **Database Migration**
  - Column already nullable
  - No migration needed

- **Profile Setup Form** (`src/pages/ProfileSetup/ArtisanProfileSetup.tsx`)
  - Includes hourly_rate field
  - Validates before submission
  - No changes needed

---

## Summary

### Problem:
- Artisan registration failed because backend required `hourly_rate`
- Frontend registration form doesn't have hourly_rate field
- This is a two-step process: registration → profile setup

### Solution:
- Made `hourly_rate` **optional** during registration
- Set default value of `0` if not provided
- Still **required** during profile setup (where it should be)

### Result:
- ✅ Artisans can now register successfully
- ✅ hourly_rate set to 0 initially
- ✅ Proper value set during profile setup
- ✅ Maintains data integrity
- ✅ Follows proper registration flow

---

**Status**: ✅ Fixed  
**Priority**: Critical (Registration Blocker)  
**Date**: October 4, 2025  
**Tested**: Ready for Testing
