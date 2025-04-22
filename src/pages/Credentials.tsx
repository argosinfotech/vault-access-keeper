import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import CredentialTable from "@/components/credential/CredentialTable";
import { Button } from "@/components/ui/button";
import { Plus, Apps } from "lucide-react";
import CredentialDrawer from "@/components/credential/CredentialDrawer";
import ApplicationsDrawer from "@/components/application/ApplicationsDrawer";
import { Application } from "@/types";
import { mockApplications } from "@/lib/mock-data";

const Credentials = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [appsDrawerOpen, setAppsDrawerOpen] = useState(false);
  const [editCredential, setEditCredential] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [applications, setApplications] = useState(mockApplications);
  const navigate = useNavigate();

  const handleAddCredential = (newCredential: Partial<Credential>) => {
    const credentialToAdd: Credential = {
      ...newCredential,
      id: `credential-${Date.now()}`,
      createdAt: new Date(),
      title: newCredential.title || "Untitled",
      username: newCredential.username || "Unknown",
      password: newCredential.password || "N/A",
      environment: newCredential.environment || "development",
      category: newCredential.category || "application",
    } as Credential;

    setCredentials([...credentials, credentialToAdd]);
    setDrawerOpen(false);
  };

  const handleEditCredential = (credential: Credential) => {
    setEditCredential(credential);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditCredential(null);
  };

  const handleCredentialSave = (updatedCredential: Credential) => {
    const updatedCredentials = credentials.map((credential) =>
      credential.id === updatedCredential.id ? updatedCredential : credential
    );
    setCredentials(updatedCredentials);
    setDrawerOpen(false);
    setEditCredential(null);
  };

  const handleApplicationSave = (application: Application) => {
    if (application.id) {
      setApplications(applications.map(app => 
        app.id === application.id ? application : app
      ));
    } else {
      const newApp = {
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

  return (
    <div className="flex-1">
      <Header title="Credentials" />
      <div className="px-8 py-6">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">All Credentials</h2>
          <div className="flex gap-2">
            <Button 
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => setAppsDrawerOpen(true)}
            >
              <Apps className="h-4 w-4" />
              <span>Manage Apps</span>
            </Button>
            <Button 
              size="sm"  
              className="flex items-center gap-1"
              onClick={() => setDrawerOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Add Credential</span>
            </Button>
          </div>
        </div>
        <CredentialTable
          credentials={credentials}
          onEdit={handleEditCredential}
          onDelete={(id) => setCredentials(credentials.filter(c => c.id !== id))}
        />
      </div>
      <CredentialDrawer
        open={drawerOpen}
        credential={editCredential}
        onClose={handleCloseDrawer}
        onSave={handleCredentialSave}
      />
      <ApplicationsDrawer
        open={appsDrawerOpen}
        onClose={() => setAppsDrawerOpen(false)}
        onSave={handleApplicationSave}
      />
    </div>
  );
};

export default Credentials;
