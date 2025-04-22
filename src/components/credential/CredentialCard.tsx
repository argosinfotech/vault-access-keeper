
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Credential, EnvironmentType, CategoryType } from "@/types";
import { Eye, EyeOff, Copy, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface CredentialCardProps {
  credential: Credential;
}

const CredentialCard = ({ credential }: CredentialCardProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const getEnvironmentColor = (env: EnvironmentType) => {
    switch (env) {
      case EnvironmentType.PRODUCTION:
        return "bg-destructive text-destructive-foreground";
      case EnvironmentType.STAGING:
        return "bg-yellow-500 text-white";
      case EnvironmentType.DEVELOPMENT:
        return "bg-green-500 text-white";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getCategoryIcon = (category: CategoryType) => {
    switch (category) {
      case CategoryType.APPLICATION:
        return "💻";
      case CategoryType.DATABASE:
        return "🗄️";
      case CategoryType.HOSTING:
        return "☁️";
      case CategoryType.API:
        return "🔌";
      case CategoryType.EMAIL:
        return "📧";
      default:
        return "🔑";
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl flex-shrink-0">{getCategoryIcon(credential.category)}</span>
            <h3 className="font-medium text-sm truncate">{credential.title}</h3>
          </div>
          <Badge className={`${getEnvironmentColor(credential.environment)} text-xs`}>
            {credential.environment}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2 space-y-2">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="text-muted-foreground">Username</span>
            <div className="flex items-center gap-1">
              <span className="font-mono text-xs truncate max-w-[120px]">{credential.username}</span>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(credential.username, "Username")}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="text-muted-foreground">Password</span>
            <div className="flex items-center gap-1">
              <span className="font-mono text-xs truncate max-w-[120px]">
                {showPassword ? credential.password : '••••••••'}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(credential.password, "Password")}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {credential.url && (
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">URL</span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-xs truncate max-w-[120px]">{credential.url}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => window.open(credential.url, "_blank")}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="pt-2 text-[10px] text-muted-foreground border-t">
          Updated {formatDistanceToNow(credential.updatedAt)} ago
        </div>
      </CardContent>
    </Card>
  );
};

export default CredentialCard;
