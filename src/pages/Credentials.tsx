
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { getCredentials } from "@/api/credentialApi";
import { toast } from "sonner";

const Credentials = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const { data: credentials, isLoading, error, refetch } = useQuery({
    queryKey: ['credentials'],
    queryFn: getCredentials
  });

  const handleAddCredential = async (data: any) => {
    await refetch();
    setIsSheetOpen(false);
    toast.success("Credential added successfully");
  };

  if (error) {
    console.error(error);
    toast.error("Failed to load credentials");
  }

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
              className="flex items-center gap-1 rounded-md"
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            <Button 
              size="sm" 
              className="flex items-center gap-1 rounded-md"
              onClick={() => setIsSheetOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Add New</span>
            </Button>
          </div>
        </div>
        
        <CredentialGrid credentials={credentials || []} isLoading={isLoading} />
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
