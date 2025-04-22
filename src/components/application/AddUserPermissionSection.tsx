
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ApplicationUserPermissionForm from "./ApplicationUserPermissionForm";
import { User } from "@/types";

interface AddUserPermissionSectionProps {
  isAddingUser: boolean;
  onAddUser: () => void;
  users: User[];
  applicationId: string;
  onCancel: () => void;
  onSave: () => void;
}

export default function AddUserPermissionSection({
  isAddingUser,
  onAddUser,
  users,
  applicationId,
  onCancel,
  onSave
}: AddUserPermissionSectionProps) {
  return (
    <>
      <Button
        size="sm"
        onClick={onAddUser}
        disabled={isAddingUser}
        className="flex items-center gap-1"
      >
        <Plus className="h-4 w-4" />
        <span>Add User</span>
      </Button>

      {isAddingUser && (
        <div className="bg-muted/50 p-4 rounded-md border mb-4">
          <ApplicationUserPermissionForm
            applicationId={applicationId}
            users={users}
            onCancel={onCancel}
            onSave={onSave}
          />
        </div>
      )}
    </>
  );
}
