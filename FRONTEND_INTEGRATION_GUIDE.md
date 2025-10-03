# Frontend Integration with Laravel Backend - Complete Guide

**Date:** October 2, 2025  
**Status:** Integration in Progress  
**Backend:** PHP/Laravel 12 with Sanctum & Reverb  
**Frontend:** React/TypeScript with Vite

---

## 🎯 Overview

This document provides complete instructions for integrating the React/TypeScript frontend with the new Laravel PHP backend, including authentication, API calls, real-time WebSocket communication, and data format compatibility.

---

## ✅ Completed Steps

### 1. Package Installation
```bash
✅ npm install laravel-echo pusher-js axios
```

**Installed Packages:**
- `laravel-echo` - Laravel's official WebSocket client
- `pusher-js` - Pusher protocol for WebSocket communication
- `axios` - HTTP client for API requests

### 2. Files Created

#### a. Echo Configuration (`src/config/echo.ts`)
- Configures Laravel Echo for WebSocket connections
- Connects to Laravel Reverb server at `ws://127.0.0.1:6001`
- Handles authentication with Bearer tokens
- Functions:
  - `initializeEcho(token)` - Initialize Echo with auth token
  - `getEcho()` - Get current Echo instance
  - `disconnectEcho()` - Cleanup and disconnect
  - `updateEchoToken(token)` - Update token on refresh

#### b. Laravel API Client (`src/utils/laravelApi.ts`)
- Axios-based client for Laravel Sanctum authentication
- Automatic token management and refresh
- Request/response interceptors
- Error handling with validation support
- Methods: `get()`, `post()`, `put()`, `patch()`, `delete()`, `upload()`

#### c. API Services (`src/utils/api.ts`)
- Organized API methods for all domains
- **Services:**
  - `authApi` - Login, register, logout, profile
  - `userApi` - Profile management, artisan operations
  - `jobApi` - Job CRUD, applications, lifecycle, reviews
  - `messageApi` - Conversations, messages, unread count
  - `paymentApi` - Payment initialization, verification, escrow
  - `searchApi` - Advanced search, AI recommendations
  - `adminApi` - Dashboard, user/job/payment management
  - `profileApi` - Portfolio, certifications, availability

#### d. WebSocket Hook (`src/hooks/useWebSocket.ts`)
- Custom React hook for real-time features
- Automatic channel subscription/cleanup
- Callbacks for messages, job updates, notifications
- Methods:
  - `subscribeToJob(jobId, callback)` - Listen to job channel
  - `subscribeToAdmin(callback)` - Admin notifications
  - `isConnected()` - Check connection status

### 3. Files Updated

#### a. AuthContext (`src/context/AuthContext.tsx`)
- ✅ Updated API base URL to `http://localhost:8000/api`
- ✅ Replaced old API client with Laravel API
- ✅ Integrated Echo initialization on login/register
- ✅ Echo disconnect on logout
- ✅ Updated all auth methods:
  - `login()` - Uses `authApi.login()` + initializes Echo
  - `register()` - Uses `authApi.register()` + initializes Echo
  - `logout()` - Calls `authApi.logout()` + disconnects Echo
  - `updateProfile()` - Uses `laravelApi.put()`
  - `refreshAuthToken()` - Verifies token with profile fetch

#### b. Enhanced API (`src/utils/enhancedAPI.ts`)
- ✅ Updated base URL from `http://localhost:5000/api` to `http://localhost:8000/api`

---

## 📋 Remaining Integration Tasks

### 1. Update API Calls in Components

#### Authentication Pages
**Files to update:**
- `src/pages/Auth/Login.tsx`
- `src/pages/Auth/Register.tsx`
- `src/pages/Auth/ForgotPassword.tsx`

**Changes needed:**
```typescript
// Before (if using old API)
import { apiService } from '../../utils/enhancedAPI';

// After
import { authApi } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

// Usage
const { login } = useAuth();
await login(email, password);
```

#### Job Components
**Files to update:**
- `src/pages/Job/JobList.tsx`
- `src/pages/Job/JobDetails.tsx`
- `src/pages/Job/CreateJob.tsx`
- `src/pages/Job/JobApplication.tsx`

**Changes needed:**
```typescript
import { jobApi } from '../../utils/api';

// Get jobs
const response = await jobApi.getJobs({ status: 'open', page: 1 });
const jobs = response.data;

// Create job
const response = await jobApi.createJob({
  title: 'Fix plumbing',
  description: 'Need urgent plumbing repair',
  category: 'plumbing',
  location: 'Lagos, Nigeria',
  budget: 5000,
  urgency: 'high'
});

// Apply to job
await jobApi.applyToJob(jobId, {
  proposal: 'I can do this job',
  estimatedDuration: '2 days'
});
```

#### Message Components
**Files to update:**
- `src/pages/Messages.tsx`

**Changes needed:**
```typescript
import { messageApi } from '../../utils/api';
import { useWebSocket } from '../../hooks/useWebSocket';

function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);

  // Real-time message listener
  useWebSocket(user?.id, {
    onMessageReceived: (message) => {
      setMessages(prev => [...prev, message]);
      // Update UI
    }
  });

  // Send message
  const sendMessage = async (recipientId, content) => {
    await messageApi.sendMessage({
      recipient_id: recipientId,
      content,
      message_type: 'text'
    });
  };

  // Get conversations
  useEffect(() => {
    const fetchConversations = async () => {
      const response = await messageApi.getConversations();
      setConversations(response.data);
    };
    fetchConversations();
  }, []);
}
```

#### Payment Components
**Files to update:**
- `src/pages/Payment.tsx`
- `src/pages/Client/PaymentHistory.tsx`

**Changes needed:**
```typescript
import { paymentApi } from '../../utils/api';

// Initialize payment
const response = await paymentApi.initializePayment({
  job_id: jobId,
  amount: 5000,
  gateway: 'paystack',
  email: user.email
});

// Verify payment (after redirect)
const verification = await paymentApi.verifyPayment(reference);

// Release payment from escrow
await paymentApi.releasePayment(paymentId);
```

#### Search Components
**Files to update:**
- `src/pages/Search/SearchResults.tsx`
- `src/pages/Search/ArtisanSearch.tsx`

**Changes needed:**
```typescript
import { searchApi } from '../../utils/api';

// Advanced search
const response = await searchApi.search({
  query: 'plumber',
  location: 'Lagos',
  radius: 10,
  minRating: 4
});

// Get recommendations
const recommendations = await searchApi.getRecommendations('artisans', 10);
```

#### Dashboard Components
**Files to update:**
- `src/pages/Dashboard/AdminDashboard.tsx`
- `src/pages/Dashboard/ClientDashboard.tsx`
- `src/pages/Dashboard/ArtisanDashboard.tsx`

**Changes needed:**
```typescript
import { adminApi, jobApi, userApi } from '../../utils/api';

// Admin dashboard
const stats = await adminApi.getDashboardStats();

// Client dashboard
const myJobs = await jobApi.getJobs({ client_id: user.id });

// Artisan dashboard
const profile = await userApi.getProfile();
```

### 2. Data Format Compatibility

#### Laravel Response Format
Laravel returns data in this format:
```json
{
  "data": { ...actual data... },
  "message": "Success message",
  "success": true
}
```

**Access data:**
```typescript
const response = await jobApi.getJobs();
const jobs = response.data; // Already extracted by API client
```

#### Date Format
Laravel uses ISO 8601 format: `2025-10-02T10:30:00.000000Z`

**Convert for display:**
```typescript
const formattedDate = new Date(job.created_at).toLocaleDateString();
```

#### ID Format
- **Laravel:** Returns numeric IDs (`1, 2, 3`)
- **Old Backend:** May have used string UUIDs

**Update ID comparisons:**
```typescript
// Use loose equality or convert
if (job.id === userId) { ... }
// or
if (Number(job.id) === Number(userId)) { ... }
```

### 3. Real-Time Features Integration

#### Message Real-Time
```typescript
// In Messages component
import { useWebSocket } from '../hooks/useWebSocket';

function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);

  useWebSocket(user?.id, {
    onMessageReceived: (newMessage) => {
      console.log('New message:', newMessage);
      setMessages(prev => [...prev, newMessage]);
      // Show notification
      showToast(`New message from ${newMessage.sender.name}`);
    }
  });
}
```

#### Job Updates Real-Time
```typescript
// In Job Details component
import { useWebSocket } from '../hooks/useWebSocket';

function JobDetails({ jobId }) {
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const { subscribeToJob } = useWebSocket(user?.id, {});

  useEffect(() => {
    // Subscribe to this specific job
    const unsubscribe = subscribeToJob(jobId, (data) => {
      console.log('Job updated:', data);
      setJob(data.job);
      // Show notification based on update type
      if (data.update_type === 'status_changed') {
        showToast(`Job status changed to ${data.job.status}`);
      }
    });

    return unsubscribe;
  }, [jobId]);
}
```

#### Notifications Real-Time
```typescript
// In App.tsx or Layout component
import { useWebSocket } from './hooks/useWebSocket';

function App() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useWebSocket(user?.id, {
    onNotificationReceived: (notification) => {
      console.log('Notification:', notification);
      setNotifications(prev => [notification, ...prev]);
      // Show toast notification
      showToast(notification.title, notification.message);
    }
  });
}
```

### 4. Error Handling

#### API Error Handling
```typescript
try {
  const response = await jobApi.createJob(jobData);
  // Success
  showToast('Job created successfully!');
} catch (error) {
  // Error already formatted by API client
  showToast(error.message, 'error');
}
```

#### Validation Errors
```typescript
// Laravel validation errors are automatically extracted
try {
  await authApi.register(userData);
} catch (error) {
  // error.message contains the first validation error
  console.error(error.message);
  // e.g., "The email has already been taken."
}
```

### 5. File Uploads

#### Avatar Upload
```typescript
import { userApi } from '../utils/api';

const handleAvatarUpload = async (file: File) => {
  try {
    const response = await userApi.uploadAvatar(file);
    console.log('Avatar uploaded:', response.data);
    // Update UI
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

#### Portfolio Images
```typescript
import { profileApi } from '../utils/api';

const handlePortfolioUpload = async (file: File) => {
  const response = await profileApi.uploadPortfolioImage(file);
  // Update portfolio display
};
```

---

## 🔧 Environment Configuration

### `.env` or `vite.config.ts`
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_WS_HOST=127.0.0.1
REACT_APP_WS_PORT=6001
```

---

## 🧪 Testing the Integration

### 1. Start Backend Services
```bash
# Terminal 1: Laravel Server
cd backend
php artisan serve --port=8000

# Terminal 2: WebSocket Server
cd backend
php artisan reverb:start

# Terminal 3: Queue Worker (for jobs)
cd backend
php artisan queue:work
```

### 2. Start Frontend
```bash
# Terminal 4: React App
npm run dev
```

### 3. Test Scenarios

#### Test Authentication
1. Register a new user
2. Check console for Echo initialization
3. Login with credentials
4. Verify token in localStorage
5. Check profile data loads

#### Test Real-Time Messaging
1. Login as User A
2. Login as User B (different browser/incognito)
3. Send message from User A to User B
4. Verify User B receives message instantly
5. Check console for "New message" log

#### Test Job Lifecycle
1. Client creates a job
2. Artisan applies to job
3. Client accepts application
4. Artisan starts job
5. Verify all users receive real-time updates

#### Test Payments
1. Create job with budget
2. Complete job
3. Initialize payment
4. Verify with Paystack/Flutterwave sandbox
5. Release from escrow

---

## 🐛 Troubleshooting

### WebSocket Connection Failed
**Problem:** Can't connect to WebSocket server  
**Solution:**
1. Check Reverb server is running: `php artisan reverb:start`
2. Verify port 6001 is not blocked
3. Check Echo configuration in `src/config/echo.ts`
4. Verify token is set: `localStorage.getItem('token')`

### 401 Unauthorized Errors
**Problem:** API calls return 401  
**Solution:**
1. Check token in localStorage
2. Verify token format: Should be plain token, not "Bearer token"
3. Check Laravel logs: `tail -f storage/logs/laravel.log`
4. Clear localStorage and login again

### CORS Errors
**Problem:** "Access-Control-Allow-Origin" error  
**Solution:**
1. Check `backend/config/cors.php`
2. Verify `'supports_credentials' => true`
3. Ensure frontend URL in `'allowed_origins'`

### Data Not Loading
**Problem:** Components show no data  
**Solution:**
1. Check API response format
2. Verify data extraction: `response.data`
3. Check console for errors
4. Test API directly: Use Postman or curl

---

## 📊 Progress Tracking

### Completed ✅
- [x] Install Laravel Echo and Pusher.js
- [x] Create Echo configuration
- [x] Create Laravel API client
- [x] Create API service modules
- [x] Create WebSocket hook
- [x] Update AuthContext with Laravel API
- [x] Update API base URLs

### In Progress 🔄
- [ ] Update all component API calls
- [ ] Integrate real-time listeners in components
- [ ] Update data format handling
- [ ] Test all API endpoints
- [ ] Test WebSocket functionality

### Pending ⏳
- [ ] Error handling improvements
- [ ] Loading states optimization
- [ ] Performance testing
- [ ] End-to-end testing
- [ ] Production deployment prep

---

## 📚 Additional Resources

### Documentation
- **Laravel Echo:** https://laravel.com/docs/broadcasting#client-side-installation
- **Laravel Sanctum:** https://laravel.com/docs/sanctum
- **Laravel Reverb:** https://laravel.com/docs/reverb
- **Axios:** https://axios-http.com/docs/intro

### Related Files
- `WEBSOCKET_IMPLEMENTATION.md` - Backend WebSocket setup
- `API_DOCUMENTATION.md` - Complete API reference
- `BACKEND_MIGRATION_SUMMARY.md` - Overall backend progress

---

**Next Step:** Update component API calls starting with authentication pages, then proceed to job, message, and payment components.

**Estimated Time Remaining:** 6-8 hours for full frontend integration


