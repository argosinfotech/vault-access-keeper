import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ApplicationGrid from "@/components/application/ApplicationGrid";
import ApplicationForm from "@/components/application/ApplicationForm";
import { applicationApi } from "@/lib/api";
import { Application } from "@/types";
import { toast } from "sonner";

const Applications = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  
  const { data: applications, isLoading, error, refetch } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const response = await applicationApi.getAll();
      return response.map((app) => ({
        id: app.applicationId.toString(),
        name: app.name,
        description: app.description || undefined,
        createdBy: app.createdBy?.toString() || "unknown",
        createdAt: new Date(app.createdDate),
        updatedAt: new Date(app.modifiedDate || app.createdDate),
      }));
    }
  });

  const handleApplicationAction = async () => {
    await refetch();
    setIsSheetOpen(false);
    setSelectedApplication(null);
    toast.success(selectedApplication ? "Application updated" : "Application added");
  };

  const handleEditApplication = (application: Application) => {
    setSelectedApplication(application);
    setIsSheetOpen(true);
  };

  if (error) {
    toast.error("Failed to load applications");
  }

  return (
    <div className="flex-1">
      <Header title="Applications" />
      
      <div className="px-8 py-6">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">All Applications</h2>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-1 rounded-md"
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            <Button 
              size="sm" 
              className="flex items-center gap-1 rounded-md"
              onClick={() => {
                setSelectedApplication(null);
                setIsSheetOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              <span>Add New</span>
            </Button>
          </div>
        </div>
        
        <ApplicationGrid 
          applications={applications || []} 
          isLoading={isLoading}
          onEdit={handleEditApplication}
          onRefresh={refetch}
        />
      </div>
      
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="max-w-md ml-auto w-full shadow-lg">
          <SheetHeader>
            <SheetTitle>{selectedApplication ? "Edit Application" : "Add New Application"}</SheetTitle>
          </SheetHeader>
          <div className="px-4">
            <ApplicationForm 
              defaultValues={selectedApplication || undefined}
              onSubmit={handleApplicationAction}
              onCancel={() => {
                setIsSheetOpen(false);
                setSelectedApplication(null);
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Applications;
