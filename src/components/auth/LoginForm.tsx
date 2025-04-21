
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { mockUsers } from "@/lib/mock-data";
import { supabase } from "@/lib/supabaseClient";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";

// Helper function to generate a 6-digit OTP
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const LoginForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"login" | "otp">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [expectedOtp, setExpectedOtp] = useState("");
  const [otpSessionId, setOtpSessionId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Sends the OTP to the user's email using Supabase edge function
  async function sendOtpEmail(email: string, otp: string) {
    try {
      // In development mode without Supabase, we'll show the OTP in a toast
      const isSupabaseConnected = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!isSupabaseConnected) {
        console.log("Dev mode: OTP code is", otp);
        toast.info(`Dev mode: Your OTP code is ${otp}`, {
          duration: 10000,
        });
        return;
      }

      // If Supabase is connected, invoke the edge function
      const { error } = await supabase.functions.invoke("send-otp-email", {
        body: { email, otp }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw new Error("Failed to send OTP email");
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (step === "login") {
      // Mock password check; replace with real Supabase auth in production
      const user = mockUsers.find((u) => u.email === email);
      if (user && password === "password") {
        // Generate OTP and save it in memory (demo)
        const generatedOtp = generateOtp();
        setExpectedOtp(generatedOtp);

        // Store a sessionId for this OTP challenge in local storage (optional extra security in real apps)
        const sessionId = `${user.id}:${Date.now()}`;
        setOtpSessionId(sessionId);

        try {
          await sendOtpEmail(email, generatedOtp);
          setStep("otp");
        } catch (err) {
          setError("Failed to send OTP email. Please try again.");
        }
      } else {
        setError("Invalid email or password");
      }
      setIsLoading(false);
    } else if (step === "otp") {
      // Verify OTP code
      if (otp === expectedOtp) {
        // Log user in (mock)
        const user = mockUsers.find((u) => u.email === email);
        localStorage.setItem("currentUser", JSON.stringify(user));
        navigate("/");
      } else {
        setError("Invalid OTP. Please check your email and try again.");
      }
      setIsLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-[350px]">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {step === "login" ? "Vault Access Keeper" : "Verify OTP"}
          </CardTitle>
          <CardDescription>
            {step === "login"
              ? "Enter your credentials to access the vault"
              : "Enter the 6-digit OTP sent to your email"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-2 text-sm bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          )}
          {step === "login" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
            </>
          )}
          {step === "otp" && (
            <div className="space-y-2">
              <Label htmlFor="otp">Email OTP</Label>
              <div className="flex justify-center py-2">
                <InputOTP maxLength={6} value={otp} onChange={handleOtpChange}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Enter the 6-digit code sent to: <span className="font-semibold">{email}</span>
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {step === "login"
              ? isLoading
                ? "Logging in..."
                : "Login"
              : isLoading
                ? "Verifying..."
                : "Verify OTP"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default LoginForm;
