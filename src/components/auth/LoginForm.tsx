import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

// API base URL
const API_BASE_URL = "https://localhost:44364/api";

interface LoginResponse {
  token: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  userRoleId: number;
}

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("Attempting login...");
      // Call the authentication API directly with axios
      const response = await axios.post(`${API_BASE_URL}/Auth/login`, {
        username,
        password
      });

      const data = response.data as LoginResponse;
      console.log("Login successful, received token", data.token ? "✓" : "✗");

      // Store the user data and token
      const userData = {
        id: data.username, // Using username as ID for now
        email: data.email,
        name: `${data.firstName || ""} ${data.lastName || ""}`.trim() || data.username,
        role: data.userRoleId,
        token: data.token,
      };

      console.log("Storing user data in localStorage");
      localStorage.setItem("currentUser", JSON.stringify(userData));
      localStorage.setItem("token", data.token); // Store token separately for easy access

      // Show success toast
      toast.success("Login successful");
      console.log("About to redirect to dashboard...");

      // Most reliable way to force full page reload
      window.location.replace("/");
    } catch (err) {
      let errorMessage = "Authentication failed. Please try again.";
      
      if (axios.isAxiosError(err)) {
        // Handle axios errors
        errorMessage = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      console.error("Login error:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-[350px]">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Vault Access Keeper</CardTitle>
          <CardDescription>
            Enter your credentials to access the vault
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md flex items-start">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="username">Username or Email</Label>
            <Input
              id="username"
              type="text"
              placeholder="Username or Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default LoginForm;
