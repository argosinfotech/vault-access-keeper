import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { authApi } from "@/lib/api";

export default function Login() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in
    if (authApi.isAuthenticated()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <LoginForm />
    </div>
  );
}
