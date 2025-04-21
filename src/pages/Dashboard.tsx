
import Header from "@/components/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import AuditLogTable from "@/components/dashboard/AuditLogTable";
import { mockCredentials, mockUsers, mockAuditLogs } from "@/lib/mock-data";
import { Shield, User, Database, Clock } from "lucide-react";

const Dashboard = () => {
  // Calculate statistics
  const totalCredentials = mockCredentials.length;
  const totalUsers = mockUsers.length;
  const prodCredentials = mockCredentials.filter(cred => cred.environment === "production").length;
  
  // Get last week's logs
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const recentActivity = mockAuditLogs.filter(
    log => new Date(log.timestamp) > oneWeekAgo
  ).length;

  return (
    <div className="flex-1 space-y-6">
      <Header title="Dashboard" />
      
      <div className="px-8">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="Total Credentials" 
            value={totalCredentials}
            icon={<Database className="h-4 w-4" />}
          />
          <StatsCard 
            title="Production Credentials" 
            value={prodCredentials}
            icon={<Shield className="h-4 w-4" />}
          />
          <StatsCard 
            title="Total Users" 
            value={totalUsers}
            icon={<User className="h-4 w-4" />}
          />
          <StatsCard 
            title="Recent Activity" 
            value={recentActivity}
            description="Actions in the last 7 days"
            icon={<Clock className="h-4 w-4" />}
          />
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <AuditLogTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
