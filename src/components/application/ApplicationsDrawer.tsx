
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
  const handleClose = () => {
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="max-w-md ml-auto w-full shadow-lg">
        <div className="flex flex-col h-full">
          <SheetHeader className="flex flex-row items-center justify-between border-b pb-3">
            <SheetTitle>
              {application ? "Edit Application" : "Add Application"}
            </SheetTitle>
            <SheetClose asChild>
              <Button
                aria-label="Close"
                variant="ghost"
                className="ml-auto h-8 w-8 p-0"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </SheetHeader>
          <div className="p-4">
            <ApplicationForm
              defaultValues={application}
              onSubmit={onSave}
              onCancel={handleClose}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
