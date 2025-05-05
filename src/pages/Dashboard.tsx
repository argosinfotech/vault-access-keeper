import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import AuditLogTable from "@/components/dashboard/AuditLogTable";
import { Shield, User, Database, Clock, RefreshCw } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

// API base URL
const API_BASE_URL = "https://localhost:44364/api";

// Auto-refresh interval in milliseconds (1 minute)
const REFRESH_INTERVAL = 60000;

interface DashboardSummary {
  totalCredentials: number;
  productionCredentials: number;
  totalUsers: number;
  recentActivity: number;
}

const Dashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary>({
    totalCredentials: 0,
    productionCredentials: 0,
    totalUsers: 0,
    recentActivity: 0
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      // Fetch dashboard summary data
      const response = await axios.get(`${API_BASE_URL}/Dashboard/summary`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSummary(response.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // Initial data fetch
    fetchDashboardData();
    
    // Set up auto-refresh
    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, REFRESH_INTERVAL);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [fetchDashboardData]);

  const handleManualRefresh = () => {
    fetchDashboardData();
  };

  return (
    <div className="flex-1 space-y-6">
      <Header title="Dashboard">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleManualRefresh}
            disabled={loading}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </Header>
      
      <div className="px-8">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="Total Credentials" 
            value={summary.totalCredentials}
            icon={<Database className="h-4 w-4" />}
            loading={loading}
          />
          <StatsCard 
            title="Production Credentials" 
            value={summary.productionCredentials}
            icon={<Shield className="h-4 w-4" />}
            loading={loading}
          />
          <StatsCard 
            title="Total Users" 
            value={summary.totalUsers}
            icon={<User className="h-4 w-4" />}
            loading={loading}
          />
          <StatsCard 
            title="Recent Activity" 
            value={summary.recentActivity}
            description="Actions in the last 7 days"
            icon={<Clock className="h-4 w-4" />}
            loading={loading}
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
