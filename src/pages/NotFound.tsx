import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Auto-redirect based on user type and previous route
  useEffect(() => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const redirectTo = searchParams.get('redirect');

    // If there's a redirect parameter, try to go there
    if (redirectTo) {
      setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 2000);
      return;
    }

    // Smart redirects based on path patterns
    if (path.includes('/admin') && user?.type === 'admin') {
      setTimeout(() => {
        navigate('/admin/dashboard', { replace: true });
      }, 2000);
    } else if (path.includes('/artisan') && user?.type === 'artisan') {
      setTimeout(() => {
        navigate('/artisan/dashboard', { replace: true });
      }, 2000);
    } else if (path.includes('/client') && user?.type === 'client') {
      setTimeout(() => {
        navigate('/client/dashboard', { replace: true });
      }, 2000);
    } else if (path.includes('/dashboard')) {
      // Generic dashboard redirect based on user type
      setTimeout(() => {
        if (user?.type === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else if (user?.type === 'artisan') {
          navigate('/artisan/dashboard', { replace: true });
        } else if (user?.type === 'client') {
          navigate('/client/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }, 2000);
    }
  }, [location, navigate, user]);

  const handleManualRedirect = () => {
    if (user?.type === 'admin') {
      navigate('/admin/dashboard');
    } else if (user?.type === 'artisan') {
      navigate('/artisan/dashboard');
    } else if (user?.type === 'client') {
      navigate('/client/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-blue-600 mb-4">404</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
            <p className="text-gray-600 mb-6">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Auto-redirect notification */}
          {user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                We're redirecting you to your dashboard in a moment...
              </p>
              <div className="mt-2">
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-full animate-pulse" />
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-4">
            {user ? (
              <Button 
                onClick={handleManualRedirect}
                className="w-full"
              >
                Go to My Dashboard
              </Button>
            ) : (
              <Button 
                onClick={() => navigate('/')}
                className="w-full"
              >
                Go to Homepage
              </Button>
            )}
            
            <Button 
              onClick={handleGoBack}
              variant="secondary"
              className="w-full"
            >
              Go Back
            </Button>

            {/* Quick navigation links */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Quick Navigation:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={() => navigate('/search')}
                  variant="ghost"
                  size="sm"
                  className="text-left"
                >
                  Search Jobs
                </Button>
                <Button 
                  onClick={() => navigate('/post-job')}
                  variant="ghost"
                  size="sm"
                  className="text-left"
                >
                  Post a Job
                </Button>
                {!user && (
                  <>
                    <Button 
                      onClick={() => navigate('/login')}
                      variant="ghost"
                      size="sm"
                      className="text-left"
                    >
                      Login
                    </Button>
                    <Button 
                      onClick={() => navigate('/signup')}
                      variant="ghost"
                      size="sm"
                      className="text-left"
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Additional help */}
          <div className="mt-8 text-sm text-gray-500">
            <p>If you continue to experience issues, please contact support.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
