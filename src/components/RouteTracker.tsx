import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigationHandler } from '../utils/navigationHandler';

interface RouteTrackerProps {
  children: React.ReactNode;
}

export default function RouteTracker({ children }: RouteTrackerProps) {
  const location = useLocation();
  const { addRoute } = useNavigationHandler();

  useEffect(() => {
    // Add current route to history
    addRoute(location.pathname);
  }, [location.pathname, addRoute]);

  return <>{children}</>;
}
