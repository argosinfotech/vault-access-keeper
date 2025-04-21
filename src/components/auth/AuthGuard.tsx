
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/login");
    }
  }, [navigate]);

  return <>{children}</>;
};

export default AuthGuard;
