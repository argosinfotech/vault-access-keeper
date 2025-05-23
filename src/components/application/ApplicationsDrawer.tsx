
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Application } from "@/types";
import ApplicationForm from "./ApplicationForm";

interface ApplicationsDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (application: Application) => void;
  application?: Application;
}

export default function ApplicationsDrawer({ 
  open, 
  onClose, 
  onSave, 
  application 
}: ApplicationsDrawerProps) {
  const handleFormSubmit = (application: Application) => {
    onSave(application);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="max-w-md ml-auto w-full shadow-lg">
        <div className="flex flex-col h-full">
          <SheetHeader className="flex flex-row items-center justify-between border-b pb-3">
            <SheetTitle>
              {application ? "Edit Application" : "Add Application"}
            </SheetTitle>
            
          </SheetHeader>
          <div className="p-4">
            <ApplicationForm
              defaultValues={application}
              onSubmit={handleFormSubmit}
              onCancel={onClose}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
