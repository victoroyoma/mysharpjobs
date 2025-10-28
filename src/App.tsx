import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import RouteTracker from './components/RouteTracker';

// Lazy load existing components for better performance
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Auth/Login'));
const SignUp = lazy(() => import('./pages/Auth/SignUp'));
const PasswordRecovery = lazy(() => import('./pages/Auth/PasswordRecovery'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Verification = lazy(() => import('./pages/Verification'));
const Messages = lazy(() => import('./pages/Messages'));
const Payment = lazy(() => import('./pages/Payment'));
const ArtisanVerification = lazy(() => import('./pages/ArtisanVerification'));

// Dashboard components
const ArtisanDashboard = lazy(() => import('./pages/Dashboard/ArtisanDashboard'));
const ClientDashboard = lazy(() => import('./pages/Dashboard/ClientDashboard'));
const AdminDashboardProduction = lazy(() => import('./pages/Dashboard/AdminDashboardProduction'));

// Profile components
const ArtisanProfile = lazy(() => import('./pages/Profile/EditableArtisanProfile'));
const ClientProfile = lazy(() => import('./pages/Profile/EditableClientProfile'));

// Job components
const PostJob = lazy(() => import('./pages/Job/PostJob'));
const JobDetails = lazy(() => import('./pages/Job/JobDetails'));
const ArtisanJobManagement = lazy(() => import('./pages/Job/ArtisanJobManagement'));
const ArtisanPayments = lazy(() => import('./pages/Job/ArtisanPayments'));

// Search components
const SearchPage = lazy(() => import('./pages/Search/SearchPage'));
const MapSearch = lazy(() => import('./pages/Search/MapSearch'));

// Profile Setup components
const ArtisanProfileSetup = lazy(() => import('./pages/ProfileSetup/ArtisanProfileSetup'));
const ClientProfileSetup = lazy(() => import('./pages/ProfileSetup/ClientProfileSetup'));

// Enhanced loading component
const EnhancedLoadingSpinner: React.FC<{ message?: string }> = ({ message = "Loading..." }) => (
  <div className="min-h-[400px] flex flex-col items-center justify-center">
    <LoadingSpinner size="lg" />
    <p className="mt-4 text-gray-600 text-sm">{message}</p>
  </div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h1 className="text-lg font-semibold text-gray-900">Something went wrong</h1>
                <p className="text-sm text-gray-600">We're sorry for the inconvenience</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Refresh Page
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main App Component with Performance Optimizations
function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <RouteTracker>
              <div className="min-h-screen bg-gray-50">
                <Suspense fallback={<EnhancedLoadingSpinner />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/recover-password" element={<PasswordRecovery />} />
                    <Route path="/verify" element={<Verification />} />
                    
                    {/* Profile Setup Routes (requires authentication but not profile completion) */}
                    <Route path="/profile-setup/artisan" element={
                      <ProtectedRoute requiredRole="artisan">
                        <ArtisanProfileSetup />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile-setup/client" element={
                      <ProtectedRoute requiredRole="client">
                        <ClientProfileSetup />
                      </ProtectedRoute>
                    } />
                    
                    {/* Artisan Routes */}
                    <Route path="/artisan/dashboard" element={
                      <ProtectedRoute requiredRole="artisan">
                        <Suspense fallback={<EnhancedLoadingSpinner message="Loading artisan dashboard..." />}>
                          <ArtisanDashboard />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/artisan/jobs" element={
                      <ProtectedRoute requiredRole="artisan">
                        <Suspense fallback={<EnhancedLoadingSpinner message="Loading jobs..." />}>
                          <ArtisanJobManagement />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/artisan/payments" element={
                      <ProtectedRoute requiredRole="artisan">
                        <Suspense fallback={<EnhancedLoadingSpinner message="Loading payments..." />}>
                          <ArtisanPayments />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/artisan/profile" element={
                      <ProtectedRoute requiredRole="artisan">
                        <Suspense fallback={<EnhancedLoadingSpinner message="Loading profile..." />}>
                          <ArtisanProfile />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/artisan/verification" element={
                      <ProtectedRoute requiredRole="artisan">
                        <ArtisanVerification />
                      </ProtectedRoute>
                    } />
                    
                    {/* Client Routes */}
                    <Route path="/client/dashboard" element={
                      <ProtectedRoute requiredRole="client">
                        <Suspense fallback={<EnhancedLoadingSpinner message="Loading client dashboard..." />}>
                          <ClientDashboard />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/client/profile" element={
                      <ProtectedRoute requiredRole="client">
                        <Suspense fallback={<EnhancedLoadingSpinner message="Loading profile..." />}>
                          <ClientProfile />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/client/post-job" element={
                      <ProtectedRoute requiredRole="client">
                        <Suspense fallback={<EnhancedLoadingSpinner message="Loading job form..." />}>
                          <PostJob />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/client/payment" element={
                      <ProtectedRoute requiredRole="client">
                        <Payment />
                      </ProtectedRoute>
                    } />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={
                      <ProtectedRoute requiredRole="admin">
                        <Suspense fallback={<EnhancedLoadingSpinner message="Loading admin dashboard..." />}>
                          <AdminDashboardProduction />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    
                    {/* Shared Routes */}
                    <Route path="/search" element={
                      <ProtectedRoute>
                        <Suspense fallback={<EnhancedLoadingSpinner message="Loading search..." />}>
                          <SearchPage />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/search/map" element={
                      <ProtectedRoute>
                        <Suspense fallback={<EnhancedLoadingSpinner message="Loading map search..." />}>
                          <MapSearch />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/post-job" element={
                      <ProtectedRoute>
                        <Suspense fallback={<EnhancedLoadingSpinner message="Loading job form..." />}>
                          <PostJob />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/job/:jobId" element={
                      <ProtectedRoute>
                        <Suspense fallback={<EnhancedLoadingSpinner message="Loading job details..." />}>
                          <JobDetails />
                        </Suspense>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/messages" element={
                      <ProtectedRoute>
                        <Messages />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/payment/:jobId" element={
                      <ProtectedRoute>
                        <Payment />
                      </ProtectedRoute>
                    } />
                    
                    {/* Redirect Routes */}
                    <Route path="/dashboard" element={<Navigate to="/artisan/dashboard" replace />} />
                    
                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </div>
            </RouteTracker>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default React.memo(App);
