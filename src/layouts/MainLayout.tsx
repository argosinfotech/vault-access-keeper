
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";

const MainLayout = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen">
      <NavBar />
      <div className="flex-1 ml-64">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
