
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CredentialCard from "@/components/credential/CredentialCard";
import { Credential, EnvironmentType } from "@/types";
import { Layout } from "lucide-react";

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
      <div className="flex items-center justify-between mb-4">
        <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as EnvironmentType | "all")} className="w-full">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-fit grid-cols-5 h-9">
              <TabsTrigger value="all" className="px-3">All</TabsTrigger>
              <TabsTrigger value={EnvironmentType.PRODUCTION} className="px-3">Prod</TabsTrigger>
              <TabsTrigger value={EnvironmentType.STAGING} className="px-3">Stage</TabsTrigger>
              <TabsTrigger value={EnvironmentType.DEVELOPMENT} className="px-3">Dev</TabsTrigger>
              <TabsTrigger value={EnvironmentType.TESTING} className="px-3">Test</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Layout className="h-4 w-4" />
              <span>{filteredCredentials.length} credentials</span>
            </div>
          </div>
          
          <TabsContent value={activeTab} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCredentials.map(credential => (
                <CredentialCard key={credential.id} credential={credential} />
              ))}
            </div>
            
            {filteredCredentials.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <Layout className="h-8 w-8 mb-2 opacity-50" />
                <p>No credentials found for this environment.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CredentialGrid;
