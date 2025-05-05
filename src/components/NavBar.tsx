import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserRole } from "@/types";
import { Shield, Key, User, Database, Settings } from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";

const NavBar = () => {
  const location = useLocation();
  const [activePage, setActivePage] = useState<string>("dashboard");
  const [userData, setUserData] = useState<any>(null);
  
  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);
  
  // Update active page based on location
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setActivePage("dashboard");
    else if (path.includes("/credentials")) setActivePage("credentials");
    else if (path.includes("/users")) setActivePage("users");
    else if (path.includes("/settings")) setActivePage("settings");
  }, [location]);

  // Get role display text
  const getRoleDisplay = (roleId: number) => {
    switch (roleId) {
      case 1: return "admin";
      case 2: return "manager";
      case 3: return "viewer";
      default: return "user";
    }
  };

  if (!userData) {
    return null; // Don't render navbar if user data isn't loaded
  }

  return (
    <div className="bg-sidebar text-sidebar-foreground h-screen w-64 p-4 fixed left-0 top-0 flex flex-col">
      <div className="flex items-center gap-2 mb-8 px-2">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-bold">Vault Access</h1>
      </div>
      
      <nav className="space-y-1 flex-1">
        <Link to="/" 
          className={`flex items-center gap-3 px-3 py-2 rounded-md w-full ${
            activePage === "dashboard" 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          }`}
        >
          <Key className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
        
        <Link to="/credentials" 
          className={`flex items-center gap-3 px-3 py-2 rounded-md w-full ${
            activePage === "credentials" 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          }`}
        >
          <Database className="h-5 w-5" />
          <span>Credentials</span>
        </Link>

        {userData.role === 1 && (
          <Link to="/users" 
            className={`flex items-center gap-3 px-3 py-2 rounded-md w-full ${
              activePage === "users" 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <User className="h-5 w-5" />
            <span>User Management</span>
          </Link>
        )}
        
        <Link to="/settings" 
          className={`flex items-center gap-3 px-3 py-2 rounded-md w-full ${
            activePage === "settings" 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </nav>
      
      <div className="border-t border-sidebar-border pt-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              {userData.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{userData.name}</span>
              <span className="text-xs text-sidebar-foreground/70">{getRoleDisplay(userData.role)}</span>
            </div>
          </div>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
