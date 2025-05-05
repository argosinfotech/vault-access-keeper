import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authApi } from "@/lib/api";

interface ProtectedRouteProps {
  requiredRole?: number; // Optional role requirement
}

/**
 * A wrapper component for routes that require authentication.
 * Redirects to login if user is not authenticated.
 * Can also check for specific roles if provided.
 */
const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthenticated = authApi.isAuthenticated();
  const currentUser = authApi.getCurrentUser();
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page but save the current location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If a specific role is required, check if user has that role
  if (requiredRole !== undefined && currentUser?.role !== requiredRole) {
    // User doesn't have the required role, redirect to home or unauthorized page
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated and has the required role, render the route
  return <Outlet />;
};

export default ProtectedRoute; 