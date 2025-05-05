import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthUser, getCurrentUser, signInWithEmail, signOut } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load user on mount - only once
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        // Check localStorage first
        const token = localStorage.getItem("token");
        const userDataStr = localStorage.getItem("currentUser");
        
        if (token && userDataStr) {
          try {
            const userData = JSON.parse(userDataStr) as AuthUser;
            setUser(userData);
            return;
          } catch (e) {
            console.error("Error parsing stored user data:", e);
          }
        }
        
        // Fall back to authentication service
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error loading user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: authUser, error } = await signInWithEmail(email, password);
      
      if (error || !authUser) {
        toast.error(error || "Login failed");
        return false;
      }
      
      setUser(authUser);
      toast.success(`Welcome back, ${authUser.name}`);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const success = await signOut();
      if (success) {
        // Clear localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        
        setUser(null);
        navigate("/login");
        toast.success("You have been logged out");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
