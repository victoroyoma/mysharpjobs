import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContextEnhanced';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import SignUp from './pages/Auth/SignUp';
import Login from './pages/Auth/Login';
import PasswordRecovery from './pages/Auth/PasswordRecovery';
import ArtisanDashboardEnhanced from './pages/Dashboard/ArtisanDashboardEnhanced';
import ClientDashboard from './pages/Dashboard/ClientDashboard';
import AdvancedJobManagement from './pages/Dashboard/AdvancedJobManagement';
import EnhancedNotificationCenter from './pages/Dashboard/EnhancedNotificationCenter';
import ArtisanProfile from './pages/Profile/ArtisanProfile';
import ClientProfile from './pages/Profile/ClientProfile';
import EnhancedSearchPage from './pages/Search/EnhancedSearchPage';
import MapSearchEnhanced from './pages/Search/MapSearchEnhanced';
import PostJob from './pages/Job/PostJob';
import JobDetails from './pages/Job/JobDetails';
import ArtisanTracking from './pages/Job/ArtisanTracking';
import ArtisanJobManagement from './pages/Job/ArtisanJobManagement';
import ArtisanPayments from './pages/Job/ArtisanPayments';
import Messages from './pages/Messages';
import Payment from './pages/Payment';
import EnhancedPaymentPage from './pages/Client/EnhancedPaymentPage';
import Verification from './pages/Verification';
import ArtisanVerification from './pages/ArtisanVerification';
import ArtisanLocationSettings from './pages/ArtisanLocationSettings';
import AdminDashboardProduction from './pages/Dashboard/AdminDashboardProduction';
import NotFound from './pages/NotFound';
import RouteTracker from './components/RouteTracker';
export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <RouteTracker>
            <div className="min-h-screen bg-gray-50">
              <Routes>
              <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recover-password" element={<PasswordRecovery />} />
            <Route path="/artisan/dashboard" element={
              <ProtectedRoute requiredRole="artisan">
                <ArtisanDashboardEnhanced />
              </ProtectedRoute>
            } />
            <Route path="/artisan/jobs" element={
              <ProtectedRoute requiredRole="artisan">
                <ArtisanJobManagement />
              </ProtectedRoute>
            } />
            <Route path="/artisan/payments" element={
              <ProtectedRoute requiredRole="artisan">
                <ArtisanPayments />
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredRole="admin">
                <Navigate to="/admin/dashboard/enhanced" replace />
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard/enhanced" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboardProduction />
              </ProtectedRoute>
            } />
            <Route path="/client/dashboard" element={
              <ProtectedRoute requiredRole="client">
                <Navigate to="/client/dashboard/enhanced" replace />
              </ProtectedRoute>
            } />
            <Route path="/client/dashboard/enhanced" element={
              <ProtectedRoute requiredRole="client">
                <ClientDashboard />
              </ProtectedRoute>
            } />
            <Route path="/client/jobs/advanced" element={<AdvancedJobManagement />} />
            <Route path="/notifications" element={<EnhancedNotificationCenter />} />
            <Route path="/artisan/profile" element={<ArtisanProfile />} />
            <Route path="/artisan/profile/:id" element={<ArtisanProfile />} />
            <Route path="/client/profile" element={<ClientProfile />} />
            <Route path="/search" element={<EnhancedSearchPage />} />
            <Route path="/search/enhanced" element={<EnhancedSearchPage />} />
            <Route path="/search/map" element={<MapSearchEnhanced />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/job/:id" element={<JobDetails />} />
            <Route path="/job/:id/track" element={<ArtisanTracking />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment/:id" element={<EnhancedPaymentPage />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/artisan/verification" element={<ArtisanVerification />} />
            <Route path="/artisan/location-settings" element={<ArtisanLocationSettings />} />
            
            {/* Catch-all route for 404 errors */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </RouteTracker>
    </Router>
  </AuthProvider>
</ToastProvider>
  );
}
