
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CredentialCard from "@/components/credential/CredentialCard";
import { Credential, EnvironmentType } from "@/types";

interface CredentialGridProps {
  credentials: Credential[];
}

const CredentialGrid = ({ credentials }: CredentialGridProps) => {
  const [activeTab, setActiveTab] = useState<EnvironmentType | "all">("all");

  const filterCredentials = (credentials: Credential[]) => {
    if (activeTab === "all") {
      return credentials;
    }
    
    return credentials.filter(cred => cred.environment === activeTab);
  };

  const filteredCredentials = filterCredentials(credentials);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as EnvironmentType | "all")}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value={EnvironmentType.PRODUCTION}>Production</TabsTrigger>
          <TabsTrigger value={EnvironmentType.STAGING}>Staging</TabsTrigger>
          <TabsTrigger value={EnvironmentType.DEVELOPMENT}>Development</TabsTrigger>
          <TabsTrigger value={EnvironmentType.TESTING}>Testing</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCredentials.map(credential => (
              <CredentialCard key={credential.id} credential={credential} />
            ))}
          </div>
          
          {filteredCredentials.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No credentials found for this environment.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CredentialGrid;
