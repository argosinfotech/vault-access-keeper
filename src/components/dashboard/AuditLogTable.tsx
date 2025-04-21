
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { mockAuditLogs, mockUsers } from "@/lib/mock-data";
import { format } from "date-fns";

const AuditLogTable = () => {
  // Helper function to get user name from ID
  const getUserName = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    return user ? user.name : "Unknown User";
  };
  
  // Display only the most recent logs
  const recentLogs = [...mockAuditLogs]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Timestamp</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead className="hidden md:table-cell">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-mono text-xs">
                {format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}
              </TableCell>
              <TableCell>{getUserName(log.userId)}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span 
                    className={`h-2 w-2 rounded-full mr-2 ${
                      log.action.includes("CREATE") 
                        ? "bg-success" 
                        : log.action.includes("UPDATE") 
                        ? "bg-primary" 
                        : "bg-muted-foreground"
                    }`} 
                  />
                  {log.action.replace("_", " ")}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                {log.details}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AuditLogTable;
