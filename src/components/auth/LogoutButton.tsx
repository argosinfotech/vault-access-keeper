
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const LogoutButton = ({ variant = "ghost" }: LogoutButtonProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <Button variant={variant} onClick={handleLogout} className="flex items-center gap-2">
      <LogOut className="h-4 w-4" />
      <span>Logout</span>
    </Button>
  );
};

export default LogoutButton;
