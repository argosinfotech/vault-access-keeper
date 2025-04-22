
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Credential, EnvironmentType } from "@/types";
import { Badge } from "@/components/ui/badge";

interface CredentialTableProps {
  credentials: Credential[];
  onEdit?: (credential: Credential) => void;
  onDelete?: (id: string) => void;
  onView?: (credential: Credential) => void;
}

const CredentialTable = ({ credentials, onEdit, onDelete, onView }: CredentialTableProps) => {
  const getEnvironmentColor = (environment: EnvironmentType) => {
    switch (environment) {
      case EnvironmentType.PRODUCTION:
        return "bg-destructive text-destructive-foreground";
      case EnvironmentType.STAGING:
        return "bg-yellow-500 text-white";
      case EnvironmentType.DEVELOPMENT:
        return "bg-green-500 text-white";
      case EnvironmentType.TESTING:
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (!credentials.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No credentials found. Add your first credential to get started.
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Environment</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {credentials.map((credential) => (
            <TableRow key={credential.id}>
              <TableCell className="font-medium">{credential.title}</TableCell>
              <TableCell>{credential.username}</TableCell>
              <TableCell>
                <Badge className={getEnvironmentColor(credential.environment)}>
                  {credential.environment}
                </Badge>
              </TableCell>
              <TableCell className="capitalize">{credential.category}</TableCell>
              <TableCell>
                {formatDistanceToNow(credential.updatedAt, { addSuffix: true })}
              </TableCell>
              <TableCell className="text-right flex justify-end gap-2">
                {onView && (
                  <Button size="icon" variant="ghost" onClick={() => onView(credential)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                {onEdit && (
                  <Button size="icon" variant="ghost" onClick={() => onEdit(credential)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(credential.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CredentialTable;
