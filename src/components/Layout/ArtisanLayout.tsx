import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  BriefcaseIcon, 
  MessageSquareIcon, 
  UserIcon, 
  CreditCardIcon, 
  BellIcon,
  MenuIcon,
  XIcon,
  CheckCircleIcon
} from 'lucide-react';

interface ArtisanLayoutProps {
  children: React.ReactNode;
}

const ArtisanLayout: React.FC<ArtisanLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { path: '/artisan/dashboard', label: 'Dashboard', icon: HomeIcon },
    { path: '/artisan/jobs', label: 'Jobs', icon: BriefcaseIcon },
    { path: '/messages', label: 'Messages', icon: MessageSquareIcon },
    { path: '/artisan/profile', label: 'Profile', icon: UserIcon },
    { path: '/artisan/payments', label: 'Payments', icon: CreditCardIcon },
    { path: '/artisan/verification', label: 'Verification', icon: CheckCircleIcon },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white shadow-md">
        <div className="flex items-center justify-center h-16 border-b">
          <Link to="/" className="text-blue-600 text-xl font-bold">
            MySharpJobs
          </Link>
        </div>
        <div className="flex-grow flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    active
                      ? 'text-white bg-blue-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${active ? '' : 'text-gray-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden bg-white shadow-sm w-full fixed top-0 z-20">
        <div className="flex items-center justify-between h-16 px-4">
          <Link to="/" className="text-blue-600 text-xl font-bold">
            MySharpJobs
          </Link>
          <div className="flex items-center gap-2">
            <button 
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="View notifications"
            >
              <BellIcon className="h-6 w-6" />
            </button>
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white">
            <nav className="px-2 py-3 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      active
                        ? 'text-white bg-blue-600'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${active ? '' : 'text-gray-400'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden h-16"></div>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ArtisanLayout;
