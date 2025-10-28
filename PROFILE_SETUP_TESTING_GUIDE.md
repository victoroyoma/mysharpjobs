# Profile Setup System - Testing Guide

## 🧪 How to Test the Profile Setup Flow

### Prerequisites
- Backend server running (`php artisan serve`)
- Frontend development server running (`npm run dev`)
- MySQL database with migrations applied
- Test user accounts ready

---

## 📋 Test Scenarios

### **Scenario 1: New Artisan Registration**

1. **Register as Artisan**
   - Navigate to `/signup?type=artisan`
   - Fill in registration form:
     - Name: "John Smith"
     - Email: "john@example.com"
     - Phone: "08012345678"
     - Location: Select "Lagos, Nigeria"
     - Password: "password123"
     - Skills: "Plumbing"
   - Click "Create Account"

2. **Verify Redirect**
   - ✅ Should redirect to `/profile-setup/artisan`
   - ✅ Should see "Complete Your Artisan Profile" heading
   - ✅ Should see 5 steps in step indicator
   - ✅ Should see progress bar at 0%

3. **Complete Profile Setup**

   **Step 1: Professional Info**
   - Enter bio (minimum 100 characters):
     ```
     I am a professional plumber with over 10 years of experience. 
     I specialize in residential and commercial plumbing, including 
     installations, repairs, and maintenance. Available for emergency calls.
     ```
   - Click "Continue"

   **Step 2: Skills & Experience**
   - Add at least 3 skills:
     - "Plumbing"
     - "Pipe Installation"
     - "Leak Repairs"
   - (Optional) Add certification: "Licensed Plumber"
   - Click "Continue"

   **Step 3: Rates & Availability**
   - Hourly Rate: 5000
   - Service Radius: 20
   - Click "Continue"

   **Step 4: Portfolio**
   - Add 3 image URLs (or use placeholders):
     - `https://via.placeholder.com/400x300?text=Project+1`
     - `https://via.placeholder.com/400x300?text=Project+2`
     - `https://via.placeholder.com/400x300?text=Project+3`
   - Click "Continue"

   **Step 5: Payment Details**
   - Account Name: "John Smith"
   - Account Number: "0123456789"
   - Bank Name: Select "Zenith Bank"
   - Click "Complete Profile"

4. **Verify Completion**
   - ✅ Should see "Completing..." loading state
   - ✅ Should redirect to `/artisan/dashboard`
   - ✅ Profile should show as completed in database

---

### **Scenario 2: New Client Registration**

1. **Register as Client**
   - Navigate to `/signup?type=client`
   - Fill in registration form:
     - Name: "Jane Doe"
     - Email: "jane@example.com"
     - Phone: "08087654321"
     - Location: Select "Abuja, Nigeria"
     - Password: "password123"
   - Click "Create Account"

2. **Verify Redirect**
   - ✅ Should redirect to `/profile-setup/client`
   - ✅ Should see "Complete Your Client Profile" heading
   - ✅ Should see 4 steps in step indicator
   - ✅ Should see progress bar at 0%

3. **Complete Profile Setup**

   **Step 1: Business Info**
   - Select "Individual" account type
   - Click "Continue"

   **Step 2: Contact & Location**
   - Location should be pre-filled with "Abuja, Nigeria"
   - Verify it's correct
   - Click "Continue"

   **Step 3: Payment**
   - Select "Wallet" as preferred payment method
   - Click "Continue"

   **Step 4: Review**
   - Verify all information is correct
   - Click "Complete Profile"

4. **Verify Completion**
   - ✅ Should redirect to `/client/dashboard`
   - ✅ Profile should show as completed

---

### **Scenario 3: Skip Profile Setup**

1. **Register New User** (Artisan or Client)
2. **On Any Step** of profile setup
3. **Click "Skip for Now"** button
4. **Verify:**
   - ✅ Should redirect to appropriate dashboard
   - ✅ Profile should NOT be marked as completed
   - ✅ Database should show `profile_completed = 0`

---

### **Scenario 4: Form Validation**

Test each validation rule:

#### Artisan Validations
- **Bio < 100 chars:** Should show error "Please provide a bio with at least 100 characters"
- **< 3 skills:** Should show error "Please add at least 3 skills"
- **Hourly rate = 0:** Should show error "Please enter a valid hourly rate"
- **< 3 portfolio images:** Should show error "Please add at least 3 portfolio images"
- **Missing account name:** Should show error "Account name is required"
- **Account number ≠ 10 digits:** Should show error "Please enter a valid 10-digit account number"

#### Client Validations
- **No business type:** Should show error "Please select your business type"
- **Business type = 'business' but no company name:** Should show error "Company name is required for business accounts"
- **No location:** Should show error "Location is required"
- **No payment method:** Should show error "Please select your preferred payment method"

---

### **Scenario 5: Navigation Between Steps**

1. **Start Profile Setup**
2. **Complete Step 1**, click "Continue"
3. **On Step 2**, click "Back" button
4. **Verify:**
   - ✅ Should return to Step 1
   - ✅ Form data should be preserved
   - ✅ Progress bar should adjust
5. **Navigate forward again**
6. **Verify data persists**

---

### **Scenario 6: Progress Calculation**

#### Artisan Progress Test
1. Start with empty form (0%)
2. Add bio ≥ 100 chars → Should show ~15%
3. Add 3+ skills → Should show ~30%
4. Add hourly rate → Should show ~45%
5. Add 3+ portfolio images → Should show ~65%
6. Add bank details → Should show ~80%
7. Add service radius → Should show ~90%
8. Add certification → Should show 100%

#### Client Progress Test
1. Start with empty form (0%)
2. Select business type → Should show 25%
3. Add location → Should show 50%
4. Add payment method → Should show 75%
5. Add company name (if business) → Should show 100%

---

## 🔍 Database Verification

After completing profile setup, verify in MySQL:

```sql
-- Check user profile completion status
SELECT 
    id, 
    name, 
    email, 
    type,
    profile_completed,
    profile_completion_percentage,
    profile_completed_at
FROM users 
WHERE email = 'john@example.com';

-- Expected for completed profile:
-- profile_completed: 1
-- profile_completion_percentage: 100
-- profile_completed_at: [timestamp]

-- Expected for skipped profile:
-- profile_completed: 0
-- profile_completion_percentage: < 100 or NULL
-- profile_completed_at: NULL
```

---

## 🐛 Common Issues & Troubleshooting

### Issue: "Cannot redirect to profile setup"
**Solution:** Check that routes are added in `App.tsx`

### Issue: "API endpoint not found"
**Solution:** Verify backend routes in `backend/routes/api.php`

### Issue: "Form data not saving"
**Solution:** Check network tab for API errors, verify token is valid

### Issue: "Progress bar not updating"
**Solution:** Check `calculateProgress()` logic in component

### Issue: "Validation not working"
**Solution:** Check `validateStep()` function for correct step number

---

## ✅ Success Criteria

Profile setup is working correctly if:

- [x] New users are redirected to profile setup after registration
- [x] Profile setup pages load without errors
- [x] Step navigation (Back/Continue) works smoothly
- [x] Form validation catches all required fields
- [x] Progress bar updates correctly
- [x] Skip functionality redirects to dashboard
- [x] Complete profile saves to database
- [x] Users are redirected to dashboard after completion
- [x] Database shows `profile_completed = 1` after completion
- [x] AuthContext is updated with new user data

---

## 📊 Test Results Template

| Test Scenario | Status | Notes |
|--------------|--------|-------|
| New Artisan Registration | ⏳ | |
| New Client Registration | ⏳ | |
| Skip Profile Setup | ⏳ | |
| Form Validation | ⏳ | |
| Navigation Between Steps | ⏳ | |
| Progress Calculation | ⏳ | |
| Database Verification | ⏳ | |

Legend: ✅ Pass | ❌ Fail | ⏳ Not Tested

---

## 🚀 Next Steps After Testing

Once all tests pass:

1. Update ProtectedRoute to check profile completion
2. Add profile completion banners to dashboards
3. Test the complete flow with ProtectedRoute enabled
4. Deploy to staging environment
5. Perform user acceptance testing

---

*Happy Testing! 🎉*
