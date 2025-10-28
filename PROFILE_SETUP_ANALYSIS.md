# Profile Setup Flow - Analysis & Implementation Plan

**Date**: October 3, 2025  
**Issue**: Users are redirected directly to dashboard after registration without completing their profile

---

## 🔍 Current Flow Analysis

### Registration Process (SignUp.tsx)
```typescript
// After successful registration:
const registeredUserType = result.data.user.type;

switch (registeredUserType) {
  case 'artisan':
    navigate('/artisan/dashboard');  // ❌ Goes straight to dashboard
    break;
  case 'client':
    navigate('/client/dashboard');   // ❌ Goes straight to dashboard
    break;
}
```

### Problems Identified

1. **❌ Incomplete Profile Data**
   - Artisans register with minimal info: name, email, password, phone, location, primary skill
   - Clients register with even less: name, email, password, phone, location
   - Dashboard expects: bio, portfolio, certifications, hourly rate, company details, etc.

2. **❌ No Profile Completion Tracking**
   - Database has no `profile_completed` field
   - No way to know if a user finished setting up their profile
   - Users can't be forced to complete setup before accessing features

3. **❌ Poor User Experience**
   - New users land on empty dashboard with no guidance
   - Artisans can't accept jobs without rates, bio, portfolio
   - Clients can't post jobs without complete company details

4. **❌ Missing Profile Setup Pages**
   - No dedicated onboarding/setup flow
   - No step-by-step profile completion wizard
   - No validation of required profile fields

---

## 💡 Proposed Solution

### 1. Database Enhancement
Add `profile_completed` field to track setup status:

```php
// Migration: add_profile_completed_to_users_table
$table->boolean('profile_completed')->default(false)->after('is_email_verified');
$table->timestamp('profile_completed_at')->nullable()->after('profile_completed');
```

### 2. Profile Setup Pages

#### A. Client Profile Setup (`/client/profile-setup`)
**Required Fields:**
- ✅ Business Type (individual/business)
- ✅ Company Name (if business)
- ✅ Business Description
- ✅ Preferred Payment Method
- ✅ Budget Range
- ✅ Location Confirmation
- ✅ Profile Picture (optional)

**Steps:**
1. Welcome & Business Info
2. Contact & Location Details
3. Payment Preferences
4. Review & Complete

#### B. Artisan Profile Setup (`/artisan/profile-setup`)
**Required Fields:**
- ✅ Professional Bio (min 100 chars)
- ✅ Skills Selection (at least 3)
- ✅ Hourly Rate
- ✅ Service Radius
- ✅ Working Hours
- ✅ Portfolio Images (at least 3)
- ✅ Certifications (optional)
- ✅ Bank Details
- ✅ Profile Picture

**Steps:**
1. Welcome & Professional Info
2. Skills & Experience
3. Rates & Availability
4. Portfolio & Certifications
5. Payment Details
6. Review & Complete

### 3. Registration Flow Update

```typescript
// After successful registration:
if (result.data.user.profile_completed) {
  // Existing user (shouldn't happen on registration, but handle it)
  navigate(`/${userType}/dashboard`);
} else {
  // New user - needs profile setup
  navigate(`/${userType}/profile-setup`);
}
```

### 4. Protected Route Enhancement

```typescript
// ProtectedRoute.tsx - Check profile completion
const ProtectedRoute = ({ children, requiresProfileSetup = true }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiresProfileSetup && !user.profile_completed) {
    return <Navigate to={`/${user.type}/profile-setup`} />;
  }

  return children;
};
```

### 5. Backend API Endpoints

```php
// Routes
POST   /api/profile/setup/client          // Complete client profile
POST   /api/profile/setup/artisan         // Complete artisan profile
GET    /api/profile/completion-status     // Check if profile completed
PATCH  /api/profile/skip-for-now          // Allow skip with warning
```

---

## 🎯 Implementation Steps

### Phase 1: Database & Backend (Priority: HIGH)
- [x] Create migration for `profile_completed` field
- [ ] Update User model with profile_completed logic
- [ ] Create ProfileSetupController
- [ ] Add profile setup API routes
- [ ] Add profile completion validation

### Phase 2: Frontend Components (Priority: HIGH)
- [ ] Create ClientProfileSetup component
- [ ] Create ArtisanProfileSetup component
- [ ] Add multi-step wizard UI
- [ ] Implement form validation
- [ ] Add image upload functionality

### Phase 3: Integration (Priority: MEDIUM)
- [ ] Update SignUp.tsx redirect logic
- [ ] Update AuthContext to check profile_completed
- [ ] Create/Update ProtectedRoute wrapper
- [ ] Add profile setup routes to App.tsx
- [ ] Update dashboard to show setup prompt if incomplete

### Phase 4: UX Enhancements (Priority: LOW)
- [ ] Add progress indicators
- [ ] Add "Skip for now" option (with limitations)
- [ ] Add profile completion reminder in dashboard
- [ ] Add onboarding tooltips
- [ ] Add profile completion percentage

---

## 📋 Profile Completion Criteria

### Client Profile Complete When:
- ✅ Name, email, phone verified
- ✅ Location set
- ✅ Business type selected
- ✅ Profile picture uploaded (optional but recommended)
- ✅ Payment method selected
- ✅ Company details (if business type)

### Artisan Profile Complete When:
- ✅ Name, email, phone verified
- ✅ Location set
- ✅ Bio written (min 100 characters)
- ✅ At least 3 skills selected
- ✅ Hourly rate set
- ✅ Service radius defined
- ✅ Working hours set
- ✅ At least 3 portfolio images
- ✅ Bank details for payments
- ✅ Profile picture uploaded

---

## 🎨 UI/UX Design

### Profile Setup Page Layout
```
┌─────────────────────────────────────┐
│  Step 1 of 4: Professional Info     │
│  ███████░░░░░░░░░░░░░░░░░░░ 25%     │
├─────────────────────────────────────┤
│                                     │
│  📝 Tell us about yourself          │
│                                     │
│  [Form Fields]                      │
│                                     │
│  [ Skip for Now ]  [ Continue → ]  │
│                                     │
└─────────────────────────────────────┘
```

### Features:
- ✅ Progress bar showing completion percentage
- ✅ Step indicators (1/4, 2/4, etc.)
- ✅ Form validation with helpful error messages
- ✅ Auto-save as user types (draft mode)
- ✅ Image preview before upload
- ✅ "Skip for now" button (with warning modal)
- ✅ Back/Next navigation between steps
- ✅ Responsive design for mobile

---

## 🔒 Business Logic

### Profile Completion Rules

1. **Mandatory Setup**:
   - Cannot post jobs (clients) without completed profile
   - Cannot apply to jobs (artisans) without completed profile
   - Can view dashboard but with prominent "Complete Profile" banner

2. **Skip Functionality**:
   - Can skip setup but with feature limitations
   - Dashboard shows persistent reminder
   - Profile completion percentage visible
   - Can return to complete setup anytime

3. **Validation**:
   - Server-side validation of all required fields
   - Client-side validation for better UX
   - Image size/format validation
   - Phone number format validation
   - Rate range validation (artisans)

---

## 📊 Database Schema Changes

### New Fields in `users` Table

```sql
ALTER TABLE users 
ADD COLUMN profile_completed BOOLEAN DEFAULT FALSE AFTER is_email_verified,
ADD COLUMN profile_completed_at TIMESTAMP NULL AFTER profile_completed,
ADD COLUMN profile_completion_percentage TINYINT DEFAULT 0 AFTER profile_completed_at,
ADD INDEX idx_profile_completed (profile_completed);
```

### Profile Completion Tracking

```sql
-- Query to calculate completion percentage
SELECT 
  id,
  name,
  type,
  profile_completed,
  CASE 
    WHEN type = 'artisan' THEN (
      (CASE WHEN bio IS NOT NULL AND LENGTH(bio) >= 100 THEN 15 ELSE 0 END) +
      (CASE WHEN JSON_LENGTH(skills) >= 3 THEN 15 ELSE 0 END) +
      (CASE WHEN hourly_rate IS NOT NULL THEN 15 ELSE 0 END) +
      (CASE WHEN JSON_LENGTH(portfolio_images) >= 3 THEN 20 ELSE 0 END) +
      (CASE WHEN bank_details IS NOT NULL THEN 15 ELSE 0 END) +
      (CASE WHEN avatar IS NOT NULL THEN 10 ELSE 0 END) +
      (CASE WHEN service_radius IS NOT NULL THEN 10 ELSE 0 END)
    )
    WHEN type = 'client' THEN (
      (CASE WHEN business_type IS NOT NULL THEN 20 ELSE 0 END) +
      (CASE WHEN preferred_payment_method IS NOT NULL THEN 20 ELSE 0 END) +
      (CASE WHEN company_name IS NOT NULL OR business_type = 'individual' THEN 20 ELSE 0 END) +
      (CASE WHEN avatar IS NOT NULL THEN 20 ELSE 0 END) +
      (CASE WHEN location IS NOT NULL THEN 20 ELSE 0 END)
    )
  END as completion_percentage
FROM users;
```

---

## 🧪 Testing Plan

### Unit Tests
- ✅ Profile completion validation
- ✅ Profile setup API endpoints
- ✅ File upload functionality
- ✅ Profile completion percentage calculation

### Integration Tests
- ✅ Full registration → setup → dashboard flow
- ✅ Skip setup → reminder banner → complete later
- ✅ Protected route redirects
- ✅ Profile update after completion

### User Acceptance Tests
- ✅ New artisan completes profile successfully
- ✅ New client completes profile successfully
- ✅ Skip functionality works as expected
- ✅ Dashboard shows appropriate content for completed/incomplete profiles
- ✅ Profile can be edited after completion

---

## 📈 Success Metrics

### KPIs to Track
- **Profile Completion Rate**: % of users who complete setup
- **Time to Complete**: Average time from registration to completion
- **Skip Rate**: % of users who skip setup
- **Return to Complete**: % of skipped users who return to complete
- **Feature Usage**: Correlation between completed profiles and activity

---

## 🚀 Rollout Plan

### Phase 1: Development (2-3 days)
- Day 1: Database migration + Backend API
- Day 2: Frontend components (Client + Artisan)
- Day 3: Integration + Testing

### Phase 2: Testing (1 day)
- Unit tests
- Integration tests
- UAT with test users

### Phase 3: Deployment
- Deploy to staging
- Test on staging environment
- Deploy to production
- Monitor user behavior

### Phase 4: Monitoring & Iteration
- Track completion rates
- Gather user feedback
- Iterate based on data
- Add optional enhancements

---

## 💻 Code Examples

### Backend - ProfileSetupController

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class ProfileSetupController extends Controller
{
    public function completeArtisanProfile(Request $request)
    {
        $validated = $request->validate([
            'bio' => 'required|string|min:100',
            'skills' => 'required|array|min:3',
            'hourly_rate' => 'required|numeric|min:10',
            'service_radius' => 'required|integer|min:5',
            'portfolio_images' => 'required|array|min:3',
            'bank_details' => 'required|array',
            'working_hours' => 'required|string',
        ]);

        $user = $request->user();
        $user->update([
            ...$validated,
            'profile_completed' => true,
            'profile_completed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profile completed successfully!',
            'data' => ['user' => $user]
        ]);
    }
}
```

### Frontend - ArtisanProfileSetup Component

```typescript
// Multi-step profile setup wizard
const steps = [
  { id: 1, title: 'Professional Info', component: ProfessionalInfoStep },
  { id: 2, title: 'Skills & Experience', component: SkillsStep },
  { id: 3, title: 'Rates & Availability', component: RatesStep },
  { id: 4, title: 'Portfolio', component: PortfolioStep },
  { id: 5, title: 'Payment Details', component: PaymentStep },
];

const [currentStep, setCurrentStep] = useState(1);
const [formData, setFormData] = useState({});

const handleComplete = async () => {
  await profileApi.completeArtisanProfile(formData);
  navigate('/artisan/dashboard');
};
```

---

## 📚 Related Documentation

- User Model: `backend/app/Models/User.php`
- Auth Context: `src/context/AuthContext.tsx`
- SignUp Component: `src/pages/Auth/SignUp.tsx`
- Artisan Dashboard: `src/pages/Dashboard/ArtisanDashboard.tsx`
- Client Dashboard: `src/pages/Dashboard/ClientDashboard.tsx`

---

## ✅ Acceptance Criteria

### Must Have:
- ✅ Profile completion tracking in database
- ✅ Separate setup pages for clients and artisans
- ✅ Validation of required fields
- ✅ Redirect logic after registration
- ✅ Protected routes checking profile completion
- ✅ Dashboard banner for incomplete profiles

### Should Have:
- ✅ Multi-step wizard UI
- ✅ Progress indicators
- ✅ Image upload with preview
- ✅ Auto-save drafts
- ✅ Skip functionality with warnings

### Nice to Have:
- ✅ Onboarding tooltips
- ✅ Profile completion percentage
- ✅ Analytics tracking
- ✅ A/B testing different flows
- ✅ Gamification (badges for completed profiles)

---

**Status**: Ready for Implementation  
**Estimated Time**: 3-4 days  
**Priority**: HIGH  
**Impact**: Significantly improves user onboarding and profile quality
