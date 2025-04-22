
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CredentialCard from "@/components/credential/CredentialCard";
import { Credential, EnvironmentType, CategoryType } from "@/types";
import { Layout } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface CredentialGridProps {
  credentials: Credential[];
}

const CredentialGrid = ({ credentials }: CredentialGridProps) => {
  const [activeTab, setActiveTab] = useState<EnvironmentType | "all">("all");
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>([]);

  const filterCredentials = (credentials: Credential[]) => {
    let filtered = credentials;
    
    // Filter by environment
    if (activeTab !== "all") {
      filtered = filtered.filter(cred => cred.environment === activeTab);
    }
    
    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(cred => selectedCategories.includes(cred.category));
    }
    
    return filtered;
  };

  const filteredCredentials = filterCredentials(credentials);

  const handleCategoryToggle = (category: CategoryType) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      }
      return [...prev, category];
    });
  };

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

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    Categories
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {Object.values(CategoryType).map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                    >
                      {category}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Layout className="h-4 w-4" />
                <span>{filteredCredentials.length} credentials</span>
              </div>
            </div>
          </div>
          
          <TabsContent value={activeTab} className="mt-6">
            <div className="divide-y divide-border rounded-lg border bg-background">
              {filteredCredentials.map(credential => (
                <CredentialCard key={credential.id} credential={credential} />
              ))}
            </div>
            
            {filteredCredentials.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <Layout className="h-8 w-8 mb-2 opacity-50" />
                <p>No credentials found.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CredentialGrid;
