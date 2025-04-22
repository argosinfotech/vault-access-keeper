
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ApplicationPermission, UserApplicationPermission } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface ApplicationUserTableProps {
  permissions: UserApplicationPermission[];
  onRemoveUser: (userId: string) => void;
}

export default function ApplicationUserTable({ permissions, onRemoveUser }: ApplicationUserTableProps) {
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});

  const toggleUserExpanded = (userId: string) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[30px]"></TableHead>
          <TableHead>User</TableHead>
          <TableHead>Default Permission</TableHead>
          <TableHead>Since</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {permissions.map((permission) => (
          <>
            <TableRow key={permission.id}>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => toggleUserExpanded(permission.userId)}
                >
                  {expandedUsers[permission.userId]
                    ? <ChevronDown className="h-4 w-4" />
                    : <ChevronRight className="h-4 w-4" />
                  }
                </Button>
              </TableCell>
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
                  onClick={() => onRemoveUser(permission.userId)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
            {expandedUsers[permission.userId] && (
              <TableRow>
                <TableCell></TableCell>
                <TableCell colSpan={4}>
                  <div className="bg-muted/30 p-3 rounded border-l-2 border-primary/40">
                    <h4 className="text-sm font-medium mb-2">Category Permissions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {permission.categoryPermissions.length > 0
                        ? permission.categoryPermissions.map(cp => (
                          <div key={cp.category} className="flex justify-between items-center text-sm">
                            <span>{cp.category}</span>
                            <Badge variant={cp.permission === ApplicationPermission.ADMIN ? "default" : "secondary"}>
                              {cp.permission}
                            </Badge>
                          </div>
                        ))
                        : <p className="text-sm text-muted-foreground">Using default permission for all categories</p>
                      }
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </>
        ))}
      </TableBody>
    </Table>
  );
}
