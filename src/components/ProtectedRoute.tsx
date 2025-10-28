import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'client' | 'artisan' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  console.log('🔐 ProtectedRoute check:', { 
    isLoading, 
    isAuthenticated, 
    user: user?.type,
    requiredRole 
  });

  // Show loading while authentication state is being determined
  if (isLoading) {
    console.log('⏳ ProtectedRoute: Still loading auth state...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    console.log('🚫 ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If role is required and user doesn't have it, redirect to appropriate dashboard or login
  if (requiredRole && user.type !== requiredRole) {
    console.log(`🚫 ProtectedRoute: User type ${user.type} doesn't match required ${requiredRole}`);
    
    // Redirect to user's appropriate dashboard instead of login
    switch (user.type) {
      case 'client':
        return <Navigate to="/client/dashboard" replace />;
      case 'artisan':
        return <Navigate to="/artisan/dashboard" replace />;
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  console.log('✅ ProtectedRoute: Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;
