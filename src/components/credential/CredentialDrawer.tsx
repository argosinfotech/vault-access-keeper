import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import CredentialForm from "./CredentialForm";
import { Application, Credential } from "@/types";

interface CredentialDrawerProps {
  open: boolean;
  credential: Credential | null;
  applications: Application[];
  onClose: () => void;
  onSave: (credential: Credential) => void;
}

const CredentialDrawer = ({ open, credential, applications, onClose, onSave }: CredentialDrawerProps) => {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="max-w-md ml-auto w-full shadow-lg">
        <div className="flex flex-col h-full">
          <SheetHeader className="flex flex-row items-center justify-between border-b pb-3">
            <SheetTitle>
              {credential ? "Edit Credential" : "Add Credential"}
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 p-4 overflow-y-auto">
            <CredentialForm
              credential={credential || undefined}
              applications={applications}
              onSave={onSave}
              onCancel={onClose}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CredentialDrawer;
