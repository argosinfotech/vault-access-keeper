
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ApplicationPermission, User, UserApplicationPermission } from "@/types";
import { getUsersWithPermissions, removeApplicationPermission } from "@/api/applicationPermissionApi";
import { getUsers } from "@/api/userApi";
import { toast } from "sonner";
import ApplicationUserPermissionForm from "./ApplicationUserPermissionForm";

interface ApplicationUserPermissionsProps {
  applicationId: string;
}

export default function ApplicationUserPermissions({ applicationId }: ApplicationUserPermissionsProps) {
  const [isAddingUser, setIsAddingUser] = useState(false);
  
  const { data: permissions, isLoading: permissionsLoading, refetch } = useQuery({
    queryKey: ['applicationPermissions', applicationId],
    queryFn: () => getUsersWithPermissions(applicationId)
  });

  const { data: allUsers } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    enabled: isAddingUser
  });

  const handleRemoveUser = async (userId: string) => {
    try {
      await removeApplicationPermission(userId, applicationId);
      toast.success("User access removed");
      refetch();
    } catch (error) {
      console.error("Failed to remove user access:", error);
      toast.error("Failed to remove user access");
    }
  };

  const handleAddUser = () => {
    setIsAddingUser(true);
  };

  const handlePermissionSaved = () => {
    setIsAddingUser(false);
    refetch();
  };

  // Filter out users who already have permission
  const availableUsers = allUsers?.filter(user => 
    !permissions?.some(p => p.userId === user.id)
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">User Access</h3>
        <Button 
          size="sm" 
          onClick={handleAddUser}
          disabled={isAddingUser}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          <span>Add User</span>
        </Button>
      </div>
      
      {isAddingUser && (
        <div className="bg-muted/50 p-4 rounded-md border mb-4">
          <ApplicationUserPermissionForm 
            applicationId={applicationId}
            users={availableUsers}
            onCancel={() => setIsAddingUser(false)}
            onSave={handlePermissionSaved}
          />
        </div>
      )}

      {permissionsLoading ? (
        <div className="text-center py-4">Loading permissions...</div>
      ) : permissions && permissions.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Permission</TableHead>
              <TableHead>Since</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((permission) => (
              <TableRow key={permission.id}>
                <TableCell>
                  <div className="font-medium">{permission.userName}</div>
                  <div className="text-sm text-muted-foreground">{permission.userEmail}</div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                    permission.permission === ApplicationPermission.ADMIN 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-green-100 text-green-800"
                  }`}>
                    {permission.permission}
                  </span>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(permission.createdAt)} ago
                </TableCell>
                <TableCell>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleRemoveUser(permission.userId)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-6 border rounded-md bg-muted/30">
          <p className="text-muted-foreground">No users have been given access to this application yet.</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={handleAddUser}
          >
            Add User Access
          </Button>
        </div>
      )}
    </div>
  );
}
