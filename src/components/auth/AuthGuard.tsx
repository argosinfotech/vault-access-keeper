import { ReactNode, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);

  // Check authentication once on mount
  useEffect(() => {
    const checkAuth = () => {
      // Direct token check from localStorage
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.log("AuthGuard - No token found, redirecting to login");
        navigate("/login", { state: { from: location.pathname } });
      } else {
        console.log("AuthGuard - Token found, allowing access");
      }
      
      setAuthChecked(true);
    };
    
    if (!isLoading && !user) {
      checkAuth();
    } else if (!isLoading) {
      setAuthChecked(true);
    }
  }, [isLoading, user]);

  // Show loading state
  if (isLoading || !authChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Simple check - either user from context or token from localStorage
  const hasToken = !!localStorage.getItem("token");
  
  // Render children when authenticated
  return (user || hasToken) ? <>{children}</> : null;
};

export default AuthGuard;
