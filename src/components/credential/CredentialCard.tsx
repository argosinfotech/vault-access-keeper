
import { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Credential, EnvironmentType, CategoryType } from "@/types";
import { Eye, EyeOff, Copy, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
        return "bg-warning text-warning-foreground";
      case EnvironmentType.DEVELOPMENT:
        return "bg-success text-success-foreground";
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className="text-xl">{getCategoryIcon(credential.category)}</span>
            <h3 className="font-semibold text-lg">{credential.title}</h3>
          </div>
          <Badge className={getEnvironmentColor(credential.environment)}>
            {credential.environment}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-[120px_1fr] gap-2">
            <span className="text-sm text-muted-foreground">Username:</span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{credential.username}</span>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-5 w-5" 
                onClick={() => copyToClipboard(credential.username)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-[120px_1fr] gap-2">
            <span className="text-sm text-muted-foreground">Password:</span>
            <div className="flex items-center gap-2">
              {showPassword ? (
                <span className="font-medium text-sm">{credential.password}</span>
              ) : (
                <span className="font-medium text-sm">••••••••••••••</span>
              )}
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-5 w-5"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-5 w-5" 
                onClick={() => copyToClipboard(credential.password)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          {credential.url && (
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <span className="text-sm text-muted-foreground">URL:</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate max-w-[200px]">{credential.url}</span>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-5 w-5"
                  onClick={() => window.open(credential.url, "_blank")}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
          
          {credential.notes && (
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <span className="text-sm text-muted-foreground">Notes:</span>
              <span className="text-sm">{credential.notes}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground pt-2 flex justify-between">
        <span>Created: {formatDistanceToNow(new Date(credential.createdAt))} ago</span>
        <span>Last updated: {formatDistanceToNow(new Date(credential.updatedAt))} ago</span>
      </CardFooter>
    </Card>
  );
};

export default CredentialCard;
