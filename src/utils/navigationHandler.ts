// Navigation utility to handle route history and smart redirects
class NavigationHandler {
  private static instance: NavigationHandler;
  private routeHistory: string[] = [];
  private maxHistorySize = 10;

  private constructor() {
    // Initialize with current path if available
    if (typeof window !== 'undefined') {
      this.routeHistory.push(window.location.pathname);
    }
  }

  static getInstance(): NavigationHandler {
    if (!NavigationHandler.instance) {
      NavigationHandler.instance = new NavigationHandler();
    }
    return NavigationHandler.instance;
  }

  // Add a route to history
  addRoute(path: string): void {
    // Don't add the same route consecutively
    if (this.routeHistory[this.routeHistory.length - 1] !== path) {
      this.routeHistory.push(path);
      
      // Keep history size manageable
      if (this.routeHistory.length > this.maxHistorySize) {
        this.routeHistory.shift();
      }
    }
  }

  // Get the previous route
  getPreviousRoute(): string | null {
    if (this.routeHistory.length > 1) {
      return this.routeHistory[this.routeHistory.length - 2];
    }
    return null;
  }

  // Get route history
  getHistory(): string[] {
    return [...this.routeHistory];
  }

  // Smart redirect based on user type and context
  getSmartRedirect(userType?: string, currentPath?: string): string {
    const path = currentPath || window.location.pathname;

    // Admin redirects
    if (userType === 'admin') {
      if (path.includes('/admin')) {
        return '/admin/dashboard';
      }
      return '/admin/dashboard';
    }

    // Artisan redirects
    if (userType === 'artisan') {
      if (path.includes('/artisan')) {
        return '/artisan/dashboard';
      }
      return '/artisan/dashboard';
    }

    // Client redirects
    if (userType === 'client') {
      if (path.includes('/client')) {
        return '/client/dashboard';
      }
      return '/client/dashboard';
    }

    // Default redirects for unauthenticated users
    if (path.includes('/dashboard') || path.includes('/admin') || path.includes('/artisan') || path.includes('/client')) {
      return '/login';
    }

    return '/';
  }

  // Check if a route exists in our known routes
  isKnownRoute(path: string): boolean {
    const knownRoutes = [
      '/',
      '/signup',
      '/login',
      '/recover-password',
      '/artisan/dashboard',
      '/artisan/jobs',
      '/artisan/payments',
      '/admin/dashboard',
      '/client/dashboard',
      '/client/jobs/advanced',
      '/notifications',
      '/artisan/profile',
      '/client/profile',
      '/search',
      '/search/enhanced',
      '/search/map',
      '/post-job',
      '/messages',
      '/payment',
      '/verification',
      '/artisan/verification',
      '/artisan/location-settings'
    ];

    // Check exact matches
    if (knownRoutes.includes(path)) {
      return true;
    }

    // Check dynamic routes patterns
    const dynamicPatterns = [
      /^\/artisan\/profile\/[^/]+$/,
      /^\/job\/[^/]+$/,
      /^\/job\/[^/]+\/track$/,
      /^\/payment\/[^/]+$/,
    ];

    return dynamicPatterns.some(pattern => pattern.test(path));
  }

  // Clear history (useful for logout)
  clearHistory(): void {
    this.routeHistory = [];
  }

  // Get suggested routes based on user type
  getSuggestedRoutes(userType?: string): Array<{ path: string; label: string }> {
    const commonRoutes = [
      { path: '/', label: 'Home' },
      { path: '/search', label: 'Search Jobs' },
      { path: '/post-job', label: 'Post a Job' },
    ];

    if (!userType) {
      return [
        ...commonRoutes,
        { path: '/login', label: 'Login' },
        { path: '/signup', label: 'Sign Up' },
      ];
    }

    const userSpecificRoutes = {
      admin: [
        { path: '/admin/dashboard', label: 'Admin Dashboard' },
        { path: '/admin/users', label: 'User Management' },
        { path: '/admin/analytics', label: 'Analytics' },
      ],
      artisan: [
        { path: '/artisan/dashboard', label: 'My Dashboard' },
        { path: '/artisan/jobs', label: 'My Jobs' },
        { path: '/artisan/profile', label: 'My Profile' },
        { path: '/artisan/payments', label: 'Payments' },
      ],
      client: [
        { path: '/client/dashboard', label: 'My Dashboard' },
        { path: '/client/jobs/advanced', label: 'Job Management' },
        { path: '/client/profile', label: 'My Profile' },
      ],
    };

    return [
      ...commonRoutes,
      ...(userSpecificRoutes[userType as keyof typeof userSpecificRoutes] || []),
      { path: '/messages', label: 'Messages' },
      { path: '/notifications', label: 'Notifications' },
    ];
  }
}

// Custom hook to use navigation handler
export function useNavigationHandler() {
  const handler = NavigationHandler.getInstance();
  
  return {
    addRoute: handler.addRoute.bind(handler),
    getPreviousRoute: handler.getPreviousRoute.bind(handler),
    getHistory: handler.getHistory.bind(handler),
    getSmartRedirect: handler.getSmartRedirect.bind(handler),
    isKnownRoute: handler.isKnownRoute.bind(handler),
    clearHistory: handler.clearHistory.bind(handler),
    getSuggestedRoutes: handler.getSuggestedRoutes.bind(handler),
  };
}

export default NavigationHandler;
