import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import CredentialTable from "@/components/credential/CredentialTable";
import CredentialDrawer from "@/components/credential/CredentialDrawer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { mockApplications, mockCredentials } from "@/lib/mock-data";
import { Application, Credential, CategoryType, EnvironmentType } from "@/types";
import CredentialForm from "@/components/credential/CredentialForm";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { X } from "lucide-react";

const ApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | undefined>(undefined);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null);

  useEffect(() => {
    if (!id) {
      navigate("/applications");
      return;
    }

    const foundApplication = mockApplications.find((app) => app.id === id);
    if (!foundApplication) {
      navigate("/applications");
      return;
    }

    setApplication(foundApplication);
    setCredentials(mockCredentials.filter(c => c.applicationId === id));
  }, [id, navigate]);

  const handleAddCredential = () => {
    setEditingCredential(null);
    setDrawerOpen(true);
  };

  const handleEditCredential = (credential: Credential) => {
    setEditingCredential(credential);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingCredential(null);
  };

  const handleSubmit = (credentialData: Partial<Credential>) => {
    if (!application) return;

    // Simulate API call to create/update credential
    if (editingCredential) {
      // Update existing credential
      const updatedCredentials = credentials.map(c =>
        c.id === editingCredential.id ? { ...c, ...credentialData } : c
      );
      setCredentials(updatedCredentials);
    } else {
      // Create new credential
      const newCredential: Credential = {
        id: `credential-${Date.now()}`,
        ...credentialData,
        applicationId: application.id,
        createdBy: "user-1", // Replace with actual user ID
        createdAt: new Date(),
      } as Credential;
      setCredentials([...credentials, newCredential]);
    }

    handleCloseDrawer();
  };

  if (!application) {
    return <div>Loading...</div>;
  }

  const { name: applicationName, id: applicationId } = application;

  return (
    <div className="flex-1">
      <Header title={applicationName} />
      <div className="px-8 py-6">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">Credentials</h2>
          <Button size="sm" className="flex items-center gap-1" onClick={handleAddCredential}>
            <Plus className="h-4 w-4" />
            <span>Add Credential</span>
          </Button>
        </div>
        <CredentialTable
          credentials={credentials}
          onEdit={handleEditCredential}
        />
      </div>

      <Sheet open={drawerOpen} onOpenChange={handleCloseDrawer}>
        <SheetContent side="right" className="max-w-md ml-auto w-full shadow-lg">
          <div className="flex flex-col h-full">
            <SheetHeader className="flex flex-row items-center justify-between border-b pb-3">
              <SheetTitle>{editingCredential ? "Edit Credential" : "Add Credential"}</SheetTitle>
              <SheetClose asChild>
                <Button
                  aria-label="Close"
                  variant="ghost"
                  className="ml-auto h-8 w-8 p-0"
                  onClick={handleCloseDrawer}
                >
                  <X className="h-4 w-4" />
                </Button>
              </SheetClose>
            </SheetHeader>
            <div className="p-4">
              <CredentialForm
                onSave={handleSubmit}
                onCancel={handleCloseDrawer}
                defaultValues={{ 
                  environment: EnvironmentType.DEVELOPMENT, 
                  category: CategoryType.STAGING_APPLICATION, 
                  applicationId: applicationId,
                  title: applicationName
                }}
                applicationMode={true}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ApplicationDetail;
