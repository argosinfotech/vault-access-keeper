
import { useMemo, useState } from "react";
import { Application } from "@/types";
import { Button } from "@/components/ui/button";
import { Layout } from "lucide-react";
import ApplicationCard from "@/components/application/ApplicationCard";

interface ApplicationGridProps {
  applications: Application[];
  isLoading?: boolean;
  onEdit: (application: Application) => void;
  onRefresh: () => void;
}

export default function ApplicationGrid({ applications, isLoading, onEdit, onRefresh }: ApplicationGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Layout className="h-12 w-12 mx-auto mb-4 animate-pulse text-muted-foreground" />
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          {applications.length} application{applications.length !== 1 ? 's' : ''}
        </h3>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="h-8" onClick={onRefresh}>
            Refresh
          </Button>
        </div>
      </div>
      
      {applications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map(app => (
            <ApplicationCard 
              key={app.id} 
              application={app} 
              onEdit={() => onEdit(app)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
          <Layout className="h-8 w-8 mb-2 opacity-50" />
          <p>No applications found.</p>
        </div>
      )}
    </div>
  );
}
