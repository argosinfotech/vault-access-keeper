import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Credential } from "@/types";
import { credentialsApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Eye, EyeOff, Copy, Check } from "lucide-react";

interface ViewCredentialModalProps {
  open: boolean;
  onClose: () => void;
  credential: Credential | null;
}

const ViewCredentialModal = ({ open, onClose, credential }: ViewCredentialModalProps) => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleViewPassword = async () => {
    if (!credential) return;
    
    setLoading(true);
    try {
      const response = await credentialsApi.access(parseInt(credential.id));
      setPassword(response.password);
    } catch (error) {
      console.error("Failed to access credential password:", error);
      toast({
        title: "Error",
        description: "Failed to access credential password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      toast({
        title: "Copied",
        description: "Password copied to clipboard",
      });
      
      // Reset the copied status after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const resetState = () => {
    setPassword("");
    setShowPassword(false);
    setCopied(false);
    onClose();
  };

  if (!credential) return null;

  return (
    <Dialog open={open} onOpenChange={resetState}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>View Credential: {credential.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Username:</div>
            <div className="col-span-3">{credential.username}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Password:</div>
            <div className="col-span-3 flex items-center gap-2">
              {!password ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleViewPassword}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "View Password"
                  )}
                </Button>
              ) : (
                <div className="flex items-center w-full">
                  <div className="flex-grow border rounded-l-md px-3 py-2">
                    {showPassword ? password : "•".repeat(password.length)}
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-none border-l-0"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-l-none"
                    onClick={copyToClipboard}
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              )}
            </div>
          </div>
          {credential.url && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">URL:</div>
              <div className="col-span-3">
                <a 
                  href={credential.url.startsWith('http') ? credential.url : `https://${credential.url}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {credential.url}
                </a>
              </div>
            </div>
          )}
          {credential.notes && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Notes:</div>
              <div className="col-span-3">{credential.notes}</div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={resetState}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCredentialModal; 