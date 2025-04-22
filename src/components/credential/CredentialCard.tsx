
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Credential, EnvironmentType, CategoryType } from "@/types";
import { Eye, EyeOff, Copy, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getApplicationById } from "@/api/applicationApi";
import { useNavigate } from "react-router-dom";

interface CredentialCardProps {
  credential: Credential;
}

const CredentialCard = ({ credential }: CredentialCardProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { data: application } = useQuery({
    queryKey: ['application', credential.applicationId],
    queryFn: () => getApplicationById(credential.applicationId || ''),
    enabled: !!credential.applicationId
  });

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
    <div className="group p-4 hover:bg-muted/50 rounded-lg transition-colors">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl flex-shrink-0">{getCategoryIcon(credential.category)}</span>
          <h3 className="font-medium truncate">{credential.title}</h3>
        </div>
        <Badge className={`${getEnvironmentColor(credential.environment)} text-xs`}>
          {credential.environment}
        </Badge>
      </div>
      
      {application && (
        <div className="mb-3">
          <Button 
            variant="link" 
            size="sm" 
            className="p-0 h-auto text-xs"
            onClick={() => navigate(`/applications/${application.id}`)}
          >
            Part of {application.name}
          </Button>
        </div>
      )}
      
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">Username</span>
          <div className="flex items-center gap-1">
            <code className="text-xs bg-muted px-1 py-0.5 rounded">{credential.username}</code>
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

        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">Password</span>
          <div className="flex items-center gap-1">
            <code className="text-xs bg-muted px-1 py-0.5 rounded">
              {showPassword ? credential.password : '••••••••'}
            </code>
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
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">URL</span>
            <div className="flex items-center gap-1">
              <code className="text-xs bg-muted px-1 py-0.5 rounded truncate max-w-[200px]">
                {credential.url}
              </code>
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

      <div className="mt-3 pt-2 text-[10px] text-muted-foreground border-t border-border">
        Updated {formatDistanceToNow(credential.updatedAt)} ago
      </div>
    </div>
  );
};

export default CredentialCard;
