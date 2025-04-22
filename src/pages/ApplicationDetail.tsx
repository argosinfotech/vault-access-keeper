
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getApplicationById } from "@/api/applicationApi";
import { getCredentialsByApplication } from "@/api/credentialApi";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUp } from "lucide-react";
import Header from "@/components/Header";
import CredentialCard from "@/components/credential/CredentialCard";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CredentialForm from "@/components/credential/CredentialForm";
import { EnvironmentType, Credential } from "@/types";
import { toast } from "sonner";

const ApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState<EnvironmentType | null>(null);

  const { data: application, isLoading: isLoadingApp } = useQuery({
    queryKey: ['application', id],
    queryFn: () => getApplicationById(id || ''),
    enabled: !!id
  });

  const { 
    data: credentials, 
    isLoading: isLoadingCreds, 
    refetch 
  } = useQuery({
    queryKey: ['credentials', 'application', id],
    queryFn: () => getCredentialsByApplication(id || ''),
    enabled: !!id
  });

  const handleAddCredential = async (data: any) => {
    try {
      // In a real app, use API to save
      await refetch();
      setIsSheetOpen(false);
      toast.success("Credential added successfully");
    } catch (error) {
      toast.error("Failed to add credential");
      console.error(error);
    }
  };

  const isLoading = isLoadingApp || isLoadingCreds;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Loading application details...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <p className="text-muted-foreground">Application not found</p>
        <Button variant="link" onClick={() => navigate('/applications')}>
          Return to Applications
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <Header title={application.name} />
      
      <div className="px-8 py-6">
        <div className="flex justify-between mb-6">
          <div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mb-4 rounded-md"
              onClick={() => navigate('/applications')}
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              Back to Applications
            </Button>
            <h2 className="text-xl font-semibold">{application.name} Credentials</h2>
            {application.description && (
              <p className="text-muted-foreground mt-1">{application.description}</p>
            )}
          </div>
          
          <Button 
            size="sm" 
            className="flex items-center gap-1 h-9 rounded-md"
            onClick={() => setIsSheetOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Add Credential</span>
          </Button>
        </div>
        
        <div className="mt-8">
          {Object.values(EnvironmentType).map(env => {
            const envCredentials = credentials?.filter(c => c.environment === env) || [];
            return (
              <div key={env} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium capitalize">{env} Environment</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-md"
                    onClick={() => {
                      setSelectedEnvironment(env);
                      setIsSheetOpen(true);
                    }}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add {env}
                  </Button>
                </div>
                
                {envCredentials.length > 0 ? (
                  <div className="divide-y divide-border rounded-lg border bg-background">
                    {envCredentials.map(credential => (
                      <CredentialCard key={credential.id} credential={credential} />
                    ))}
                  </div>
                ) : (
                  <div className="border rounded-lg p-8 text-center text-muted-foreground bg-muted/20">
                    <p>No credentials for {env} environment yet.</p>
                    <Button
                      variant="link"
                      onClick={() => {
                        setSelectedEnvironment(env);
                        setIsSheetOpen(true);
                      }}
                    >
                      Add one now
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="max-w-md ml-auto w-full shadow-lg">
          <SheetHeader>
            <SheetTitle>Add New Credential</SheetTitle>
          </SheetHeader>
          <div className="px-4">
            <CredentialForm 
              onSubmit={handleAddCredential}
              onCancel={() => setIsSheetOpen(false)}
              defaultValues={{
                environment: selectedEnvironment || undefined,
                category: application.category,
                applicationId: application.id,
                // Pre-populate with application name
                title: `${application.name} - ${selectedEnvironment || ''}`,
              }}
              applicationMode={true}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ApplicationDetail;
