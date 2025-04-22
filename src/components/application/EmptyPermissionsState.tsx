
import { Button } from "@/components/ui/button";

interface EmptyPermissionsStateProps {
  onAddUser: () => void;
}

export default function EmptyPermissionsState({ onAddUser }: EmptyPermissionsStateProps) {
  return (
    <div className="text-center py-6 border rounded-md bg-muted/30">
      <p className="text-muted-foreground">No users have been given access to this application yet.</p>
      <Button
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={onAddUser}
      >
        Add User Access
      </Button>
    </div>
  );
}
