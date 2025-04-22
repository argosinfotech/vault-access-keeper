
import { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { mockUsers } from "@/lib/mock-data";
import { UserDrawer } from "@/components/user/UserDrawer";
import { User, UserRole } from "@/types";
import { MoreHorizontal, PenLine, Trash2 } from "lucide-react";
import { format } from "date-fns";

const UserTable = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsDrawerOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsDrawerOpen(true);
  };

  const handleUserSave = (user: User) => {
    if (editingUser) {
      setUsers(users.map(u => u.id === user.id ? user : u));
    } else {
      // Generate a basic ID for now - API would handle real IDs
      const newUser = {
        ...user,
        id: `user-${Date.now()}`,
        createdAt: new Date(),
      };
      setUsers([...users, newUser]);
    }
    setIsDrawerOpen(false);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="hidden md:table-cell">Last Login</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className="hidden md:table-cell">
                {format(new Date(user.createdAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {user.lastLogin ? format(new Date(user.lastLogin), "MMM d, yyyy") : "Never"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleEditUser(user)}>
                      <PenLine className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <UserDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        user={editingUser}
        onSave={handleUserSave}
      />
    </div>
  );
};

export default UserTable;
