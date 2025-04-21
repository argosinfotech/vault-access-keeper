
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-tr from-purple-900 via-indigo-900 to-blue-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <LoginForm />
    </div>
  );
};

export default Login;
