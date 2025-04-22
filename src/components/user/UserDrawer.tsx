
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import UserForm from "./UserForm";
import { User } from "@/types";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserDrawerProps {
  open: boolean;
  mode?: "add" | "edit";
  user?: User | null;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  onSave?: (user: User) => void;
}

const UserDrawer = ({ 
  open, 
  mode = "add", 
  user, 
  onClose, 
  onOpenChange,
  onSave
}: UserDrawerProps) => {
  const handleClose = () => {
    if (onClose) onClose();
    if (onOpenChange) onOpenChange(false);
  };

  const handleCompleted = () => {
    // Just call onClose without passing the user object
    // The UserForm component will handle saving the user data
    handleClose();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange || handleClose}>
      <SheetContent side="right" className="max-w-md ml-auto w-full shadow-lg">
        <div className="flex flex-col h-full">
          <SheetHeader className="flex flex-row items-center justify-between border-b pb-3">
            <SheetTitle>{mode === "add" ? "Add User" : "Edit User"}</SheetTitle>
            <SheetClose asChild>
              <Button
                aria-label="Close"
                variant="ghost"
                className="ml-auto p-2 text-muted-foreground hover:text-foreground"
                onClick={handleClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </SheetClose>
          </SheetHeader>
          <div className="p-4">
            <UserForm
              mode={mode}
              user={user}
              onCompleted={handleCompleted}
              onCancel={handleClose}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserDrawer;
