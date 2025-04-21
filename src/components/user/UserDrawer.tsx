
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
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
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="max-w-md ml-auto w-full shadow-lg">
        <div className="flex flex-col h-full">
          <DrawerHeader className="flex flex-row items-center justify-between border-b pb-3">
            <DrawerTitle>{mode === "add" ? "Add User" : "Edit User"}</DrawerTitle>
            <DrawerClose asChild>
              <button aria-label="Close" className="ml-auto p-2 text-muted-foreground hover:text-foreground" onClick={onClose}>
                <X className="h-5 w-5" />
              </button>
            </DrawerClose>
          </DrawerHeader>
          <div className="p-4">
            <UserForm
              mode={mode}
              user={user}
              onCompleted={onClose}
              onCancel={onClose}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default UserDrawer;
