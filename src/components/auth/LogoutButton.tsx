import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const LogoutButton = ({ variant = "ghost" }: LogoutButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    try {
      // Clear all auth data
      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
      
      // Show success message
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      // Use replace instead of navigate to prevent back navigation to authenticated pages
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Logout failed",
        description: "There was an issue logging you out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button variant={variant} onClick={handleLogout} className="flex items-center gap-2">
      <LogOut className="h-4 w-4" />
      <span>Logout</span>
    </Button>
  );
};

export default LogoutButton;
