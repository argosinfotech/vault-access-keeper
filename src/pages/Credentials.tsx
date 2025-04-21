
import { useState } from "react";
import Header from "@/components/Header";
import CredentialGrid from "@/components/credential/CredentialGrid";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";

const Credentials = () => {
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
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Add New</span>
            </Button>
          </div>
        </div>
        
        <CredentialGrid />
      </div>
    </div>
  );
};

export default Credentials;
