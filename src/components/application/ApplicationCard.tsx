
import { formatDistanceToNow } from "date-fns";
import { Application } from "@/types";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ApplicationCardProps {
  application: Application;
  onEdit: () => void;
}

export default function ApplicationCard({ application, onEdit }: ApplicationCardProps) {
  const navigate = useNavigate();
  
  return (
    <div className="group border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl flex-shrink-0">💼</span>
          <h3 className="font-medium truncate">{application.name}</h3>
        </div>
        <Button 
          size="sm" 
          variant="ghost" 
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <Edit className="h-3.5 w-3.5" />
        </Button>
      </div>

      {application.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {application.description}
        </p>
      )}

      <div className="flex justify-between mt-4 pt-2 text-xs text-muted-foreground border-t border-border">
        <span>Application</span>
        <span>Updated {formatDistanceToNow(application.updatedAt)} ago</span>
      </div>
      
      <Button 
        variant="outline" 
        size="sm"
        className="w-full mt-4 rounded-md"
        onClick={() => navigate(`/applications/${application.id}`)}
      >
        View Credentials
      </Button>
    </div>
  );
}
