
import { useState } from "react";
import Header from "@/components/Header";
import CredentialGrid from "@/components/credential/CredentialGrid";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CredentialForm from "@/components/credential/CredentialForm";
import { mockCredentials } from "@/lib/mock-data";
import { toast } from "sonner";

const Credentials = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [credentials, setCredentials] = useState([...mockCredentials]);

  const handleAddCredential = (data) => {
    // In a real application, you would make an API call to save the credential
    const newCredential = {
      id: `cred-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setCredentials([newCredential, ...credentials]);
    setIsSheetOpen(false);
    toast.success("Credential added successfully");
  };

  return (
    <div className="flex-1">
      <Header title="Credentials" />
      
      <div className="px-8 py-6">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">All Credentials</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            <Button 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setIsSheetOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Add New</span>
            </Button>
          </div>
        </div>
        
        <CredentialGrid credentials={credentials} />
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
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Credentials;
