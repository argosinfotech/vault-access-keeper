import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import CredentialTable from "@/components/credential/CredentialTable";
import CredentialGrid from "@/components/credential/CredentialGrid";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, LayoutList } from "lucide-react";
import CredentialDrawer from "@/components/credential/CredentialDrawer";
import ApplicationsDrawer from "@/components/application/ApplicationsDrawer";
import ViewCredentialModal from "@/components/credential/ViewCredentialModal";
import { Application, Credential, CategoryType, EnvironmentType } from "@/types";
//import { mockApplications } from "@/lib/mock-data";
import { applicationApi } from "@/lib/api";
import * as credentialApi from "@/api/credentialApi";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const Credentials = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [appsDrawerOpen, setAppsDrawerOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [editCredential, setEditCredential] = useState<Credential | null>(null);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Fetch credentials when component mounts
    fetchCredentials();
    // Fetch applications
    fetchApplications();
  }, []);

  const fetchCredentials = async () => {
    setLoading(true);
    try {
      const data = await credentialApi.getCredentials();
      console.log("Mapped credentials:", data);
      setCredentials(data);
    } catch (error) {
      console.error("Failed to fetch credentials:", error);
      toast({
        title: "Error",
        description: "Failed to load credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const data = await applicationApi.getAll();
      // Transform API response to match the Application type
      const transformedData = data.map(item => ({
        id: item.applicationId.toString(),
        name: item.name,
        description: item.description,
        createdBy: item.createdBy.toString(),
        createdAt: new Date(item.createdDate),
        updatedAt: item.modifiedDate ? new Date(item.modifiedDate) : new Date(item.createdDate),
      }));
      setApplications(transformedData);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      // Don't show a toast here as it's not critical for the credential page
    }
  };

  const handleEditCredential = async (credential: Credential) => {
    try {
      // Validate the credential has all required fields
      if (!credential) {
        console.error("Attempted to edit null credential");
        toast({
          title: "Error",
          description: "Cannot edit invalid credential",
          variant: "destructive",
        });
        return;
      }

      // Validate credential has an ID
      if (!credential.id) {
        console.error("Attempted to edit credential without ID");
        toast({
          title: "Error",
          description: "Cannot edit credential without ID",
          variant: "destructive",
        });
        return;
      }

      console.log("Fetching up-to-date credential data for editing:", credential.id);
      setLoading(true);
      
      try {
        // Get the latest credential data from the API
        const parsedId = parseInt(credential.id);
        if (isNaN(parsedId)) {
          throw new Error("Invalid credential ID format");
        }
        
        const response = await credentialApi.getById(parsedId);
        if (!response) {
          throw new Error("Failed to retrieve credential");
        }
        
        console.log("Retrieved credential for editing:", response);
        setEditCredential(response);
        setDrawerOpen(true);
      } catch (error) {
        console.error("Error fetching credential by ID:", error);
        toast({
          title: "Error",
          description: "Failed to retrieve credential data for editing",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error in handleEditCredential:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditCredential(null);
  };

  const handleCredentialSave = async (credential: Credential) => {
    console.log("handleCredentialSave called with:", credential);
    try {
      setLoading(true);
      
      // Handle application ID properly
      let applicationId = null;
      if (credential.applicationId && credential.applicationId !== "none") {
        applicationId = parseInt(credential.applicationId);
        if (isNaN(applicationId)) {
          console.warn(`Invalid application ID format: ${credential.applicationId}`);
          applicationId = null;
        }
      }

      // Ensure category is valid
      const category = credential.category || CategoryType.OTHER;
      console.log("Category for save:", category);

      // Ensure notes is properly passed
      const notes = credential.notes !== undefined ? credential.notes : "";
      console.log("Notes for save:", notes);

      // Transform to backend model
      const credentialData = {
        title: credential.title,
        username: credential.username,
        password: editCredential ? 
          (credential.password !== '••••••••' ? credential.password : undefined) : 
          credential.password,
        url: credential.url || "",
        environmentTypeId: credentialApi.mapEnvironmentToId(credential.environment),
        categoryTypeId: typeof credential.category === 'number' 
          ? credential.category 
          : credentialApi.mapCategoryToId(category),
        applicationId: applicationId,
        notes: notes,
        isActive: true
      };
      
      console.log("Submitting credential data with categoryTypeId:", credentialData.categoryTypeId);
      
      if (editCredential) {
        // Make sure we have a valid ID before updating
        const credentialId = editCredential.id;
        if (!credentialId) {
          throw new Error("Cannot update credential: Missing ID");
        }
        
        // Check if the ID is valid
        const parsedId = parseInt(credentialId);
        if (isNaN(parsedId)) {
          console.error("Invalid credential ID for update:", credentialId);
          throw new Error("Cannot update credential: Invalid ID format");
        }
        
        // Update existing credential
        console.log("Updating credential with ID:", parsedId, credentialData);
        await credentialApi.update(parsedId, credentialData);
        
        toast({
          title: "Success",
          description: "Credential updated successfully.",
        });
      } else {
        // Create new credential
        console.log("Creating new credential:", credentialData);
        await credentialApi.create(credentialData);
        
        toast({
          title: "Success",
          description: "Credential created successfully.",
        });
      }
      
      // Refresh credentials after updating
      await fetchCredentials();
    } catch (error) {
      console.error("Failed to save credential:", error);
      toast({
        title: "Error",
        description: typeof error === 'object' && error !== null && 'message' in error 
          ? error.message as string 
          : "Failed to save credential. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setDrawerOpen(false);
      setEditCredential(null);
    }
  };

  const handleDeleteCredential = async (id: string) => {
    try {
      // Make sure we have a valid ID
      if (!id) {
        throw new Error("Cannot delete credential: Missing ID");
      }
      
      // Check if the ID is valid
      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        console.error("Invalid credential ID for deletion:", id);
        throw new Error("Cannot delete credential: Invalid ID format");
      }
      
      await credentialApi.remove(parsedId);
      
      toast({
        title: "Success",
        description: "Credential deleted successfully.",
      });
      
      // Refresh credentials after deleting
      fetchCredentials();
    } catch (error) {
      console.error("Failed to delete credential:", error);
      toast({
        title: "Error",
        description: typeof error === 'object' && error !== null && 'message' in error 
          ? error.message as string 
          : "Failed to delete credential. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleApplicationSave = (application: Application) => {
    if (application.id) {
      // Edit existing application
      setApplications(applications.map(app => 
        app.id === application.id ? application : app
      ));
    } else {
      // Add new application
      const newApp: Application = {
        ...application,
        id: `app-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "user-1",
      };
      setApplications([...applications, newApp]);
    }
    setAppsDrawerOpen(false);
  };

  const handleViewCredential = (credential: Credential) => {
    setSelectedCredential(credential);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedCredential(null);
  };

  return (
    <div className="flex-1">
      <Header title="Credentials" />
      <div className="px-8 py-6">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">All Credentials</h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={viewMode === "grid" ? "default" : "outline"}
              className="flex items-center gap-1"
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === "table" ? "default" : "outline"}
              className="flex items-center gap-1"
              onClick={() => setViewMode("table")}
              aria-label="Table view"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button 
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => setAppsDrawerOpen(true)}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>Manage Apps</span>
            </Button>
            <Button 
              size="sm"
              className="flex items-center gap-1"
              onClick={() => {
                setEditCredential(null);
                setDrawerOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              <span>Add Credential</span>
            </Button>
          </div>
        </div>
        <div>
          {loading ? (
            <div className="flex justify-center items-center p-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading credentials...</span>
            </div>
          ) : viewMode === "grid" ? (
            <CredentialGrid 
              credentials={credentials} 
              onView={handleViewCredential}
              onEdit={handleEditCredential}
            />
          ) : (
            <CredentialTable
              credentials={credentials}
              onEdit={handleEditCredential}
              onDelete={handleDeleteCredential}
              onView={handleViewCredential}
            />
          )}
        </div>
      </div>
      <CredentialDrawer
        open={drawerOpen}
        credential={editCredential}
        applications={applications}
        onClose={handleCloseDrawer}
        onSave={handleCredentialSave}
      />
      <ApplicationsDrawer
        open={appsDrawerOpen}
        onClose={() => setAppsDrawerOpen(false)}
        onSave={handleApplicationSave}
      />
      <ViewCredentialModal
        open={viewModalOpen}
        onClose={handleCloseViewModal}
        credential={selectedCredential}
      />
    </div>
  );
};

export default Credentials;
