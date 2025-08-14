import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

const PrivateRoute: React.FC = () => {

  console.log("🛡️ 13. PrivateRoute checking access...");
  
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);

  console.log("🔒 14. PrivateRoute state:", { isAuthenticated, isLoading, user });
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    console.log("⏳ 15. PrivateRoute - still loading...");
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#219ebc] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    console.log("🚫 16. Not authenticated, redirecting to login...");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("✅ 17. Authenticated, rendering protected content...");
  // Render protected routes
  return <Outlet />;
};

export default PrivateRoute;