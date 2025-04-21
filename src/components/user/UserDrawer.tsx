
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

interface UserDrawerProps {
  open: boolean;
  mode: "add" | "edit";
  user?: User | null;
  onClose: () => void;
}

const UserDrawer = ({ open, mode, user, onClose }: UserDrawerProps) => {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="max-w-md ml-auto w-full shadow-lg">
        <div className="flex flex-col h-full">
          <SheetHeader className="flex flex-row items-center justify-between border-b pb-3">
            <SheetTitle>{mode === "add" ? "Add User" : "Edit User"}</SheetTitle>
            <SheetClose asChild>
              <button
                aria-label="Close"
                className="ml-auto p-2 text-muted-foreground hover:text-foreground"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </button>
            </SheetClose>
          </SheetHeader>
          <div className="p-4">
            <UserForm
              mode={mode}
              user={user}
              onCompleted={onClose}
              onCancel={onClose}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserDrawer;
