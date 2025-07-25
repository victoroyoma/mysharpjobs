import  { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon, X as CloseIcon, UserIcon, LogOutIcon, BellIcon, MessageSquareIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const AuthenticatedNav = () => (
    <>
      {user?.type === 'client' && (
        <>
          <Link to="/client/dashboard/enhanced" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
            Dashboard
          </Link>
          <Link to="/post-job" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
            Post Job
          </Link>
        </>
      )}
      {user?.type === 'artisan' && (
        <>
          <Link to="/artisan/dashboard/enhanced" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
            Dashboard
          </Link>
          <Link to="/artisan/profile" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
            Profile
          </Link>
        </>
      )}
      <Link to="/search/enhanced" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
        Find Work
      </Link>
      <Link to="/messages" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
        Messages
      </Link>
      {user?.type === 'admin' && (
        <Link to="/admin/dashboard/enhanced" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
          Admin Dashboard
        </Link>
      )}
    </>
  );

  const GuestNav = () => (
    <>
      <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
        Home
      </Link>
      <Link to="/signup" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
        Sign Up
      </Link>
      <Link to="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
        Log In
      </Link>
    </>
  );
  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3 group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-gray-900 text-xl font-bold group-hover:text-blue-600 transition-colors duration-200">
                MySharpJobs
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {isAuthenticated ? <AuthenticatedNav /> : <GuestNav />}
          </nav>
          
          {/* User Menu / CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Notifications and Messages for authenticated users */}
                <div className="flex items-center space-x-2">
                  <Link 
                    to="/notifications" 
                    className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <BellIcon className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  </Link>
                  <Link 
                    to="/messages" 
                    className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <MessageSquareIcon className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
                  </Link>
                </div>
                
                {/* User info */}
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden lg:block">
                      <div className="text-sm font-medium text-gray-700">{user?.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{user?.type}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 text-sm font-medium transition-all duration-200"
                  >
                    <LogOutIcon className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-blue-600 px-4 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200" 
              aria-expanded="false"
            >
              <span className="sr-only">
                {isMenuOpen ? 'Close main menu' : 'Open main menu'}
              </span>
              {isMenuOpen ? (
                <CloseIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Enhanced Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-sm shadow-lg border-t border-gray-100">
            {isAuthenticated ? (
              <>
                {/* User info */}
                <div className="px-3 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-base font-medium text-gray-900">{user?.name}</div>
                      <div className="text-sm text-gray-500 capitalize">{user?.type}</div>
                    </div>
                  </div>
                </div>
                
                {/* Mobile authenticated navigation */}
                <Link 
                  to="/" 
                  className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                
                {user?.type === 'client' ? (
                  <>
                    <Link 
                      to="/client/dashboard/enhanced" 
                      className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/post-job" 
                      className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Post Job
                    </Link>
                  </>
                ) : user?.type === 'artisan' ? (
                  <>
                    <Link 
                      to="/artisan/dashboard/enhanced" 
                      className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/artisan/profile" 
                      className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  </>
                ) : user?.type === 'admin' ? (
                  <>
                    <Link 
                      to="/admin/dashboard/enhanced" 
                      className="block px-3 py-3 rounded-lg text-base font-medium text-red-700 hover:text-red-800 hover:bg-red-50 transition-all duration-200" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  </>
                ) : null}
                
                <Link 
                  to="/search/enhanced" 
                  className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Find Work
                </Link>
                
                <Link 
                  to="/messages" 
                  className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Messages
                </Link>
                
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-3 rounded-lg text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOutIcon className="w-4 h-4 inline mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Mobile guest navigation */}
                <Link 
                  to="/" 
                  className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/login" 
                  className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
                <Link 
                  to="/signup" 
                  className="block w-full text-center px-3 py-3 rounded-lg text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}