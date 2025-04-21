
import Header from "@/components/Header";
import UserTable from "@/components/user/UserTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Users = () => {
  return (
    <div className="flex-1">
      <Header title="User Management" />
      
      <div className="px-8 py-6">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">All Users</h2>
          <Button size="sm" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>Add User</span>
          </Button>
        </div>
        
        <UserTable />
      </div>
    </div>
  );
};

export default Users;
