import { useState } from "react";
import Header from "@/components/Header";
import CredentialTable from "@/components/credential/CredentialTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CredentialDrawer from "@/components/credential/CredentialDrawer";
import { Credential } from "@/types";

const Credentials = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editCredential, setEditCredential] = useState<Credential | null>(null);
  const [credentials, setCredentials] = useState<Credential[]>([]);

  const handleAddCredential = (newCredential: Partial<Credential>) => {
    // Basic ID generation for demo purposes
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

  return (
    <div className="flex-1">
      <Header title="Credentials" />
      <div className="px-8 py-6">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">All Credentials</h2>
          <Button size="sm" className="flex items-center gap-1" onClick={() => setDrawerOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>Add Credential</span>
          </Button>
        </div>
        <CredentialTable
          credentials={credentials}
          onEdit={handleEditCredential}
          onDelete={(id: string) => setCredentials(credentials.filter((c) => c.id !== id))}
        />
      </div>
      <CredentialDrawer
        open={drawerOpen}
        credential={editCredential}
        onClose={handleCloseDrawer}
        onSave={handleCredentialSave}
      />
    </div>
  );
};

export default Credentials;
