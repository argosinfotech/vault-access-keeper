
import { useState } from "react";
import Header from "@/components/Header";
import UserTable from "@/components/user/UserTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import UserDrawer from "@/components/user/UserDrawer";
import { User } from "@/types";

const Users = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const handleAddUser = () => {
    setEditUser(null);
    setDrawerOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditUser(null);
  };

  return (
    <div className="flex-1">
      <Header title="User Management" />
      <div className="px-8 py-6">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">All Users</h2>
          <Button size="sm" className="flex items-center gap-1" onClick={handleAddUser}>
            <Plus className="h-4 w-4" />
            <span>Add User</span>
          </Button>
        </div>
        <UserTable onEditUser={handleEditUser} />
      </div>
      <UserDrawer
        open={drawerOpen}
        mode={editUser ? "edit" : "add"}
        user={editUser}
        onClose={handleCloseDrawer}
      />
    </div>
  );
};

export default Users;
