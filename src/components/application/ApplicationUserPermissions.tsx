
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApplicationPermission, User, UserApplicationPermission } from "@/types";
import { getUsersWithPermissions, removeApplicationPermission } from "@/api/applicationPermissionApi";
import { getUsers } from "@/api/userApi";
import { toast } from "sonner";
import ApplicationUserTable from "./ApplicationUserTable";
import AddUserPermissionSection from "./AddUserPermissionSection";
import EmptyPermissionsState from "./EmptyPermissionsState";
import PermissionsLoadingState from "./PermissionsLoadingState";

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

  const handleAddUser = () => setIsAddingUser(true);

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
        <AddUserPermissionSection
          isAddingUser={isAddingUser}
          onAddUser={handleAddUser}
          users={availableUsers}
          applicationId={applicationId}
          onCancel={() => setIsAddingUser(false)}
          onSave={handlePermissionSaved}
        />
      </div>

      {isAddingUser && null}

      {permissionsLoading ? (
        <PermissionsLoadingState />
      ) : permissions && permissions.length > 0 ? (
        <ApplicationUserTable
          permissions={permissions}
          onRemoveUser={handleRemoveUser}
        />
      ) : (
        <EmptyPermissionsState onAddUser={handleAddUser} />
      )}
    </div>
  );
}
