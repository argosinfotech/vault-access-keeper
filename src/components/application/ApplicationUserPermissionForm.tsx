
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { User, ApplicationPermission, CategoryType, CategoryPermission } from "@/types";
import { grantApplicationPermission } from "@/api/applicationPermissionApi";
import { toast } from "sonner";
import MainPermissionSelector from "./MainPermissionSelector";
import CategoryPermissionsAccordion from "./CategoryPermissionsAccordion";
import UserSelectField from "./UserSelectField";
import FormActionButtons from "./FormActionButtons";

const formSchema = z.object({
  userId: z.string().min(1, "Please select a user"),
  permission: z.nativeEnum(ApplicationPermission),
  categoryPermissions: z.array(
    z.object({
      category: z.nativeEnum(CategoryType),
      permission: z.nativeEnum(ApplicationPermission)
    })
  )
});

interface ApplicationUserPermissionFormProps {
  applicationId: string;
  users: User[];
  onSave: () => void;
  onCancel: () => void;
}

export default function ApplicationUserPermissionForm({
  applicationId,
  users,
  onSave,
  onCancel
}: ApplicationUserPermissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialCategoryPermissions: CategoryPermission[] = Object.values(CategoryType).map(category => ({
    category,
    permission: ApplicationPermission.VIEWER
  }));
  const [categoryPermissions, setCategoryPermissions] = useState<CategoryPermission[]>(initialCategoryPermissions);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      permission: ApplicationPermission.VIEWER,
      categoryPermissions: initialCategoryPermissions
    }
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (users.length === 0) {
      toast.error("No users available to grant permissions to");
      return;
    }
    setIsSubmitting(true);
    try {
      await grantApplicationPermission(
        values.userId,
        applicationId,
        values.permission,
        values.categoryPermissions
      );
      toast.success("User access granted successfully");
      onSave();
    } catch (error) {
      console.error("Error granting permission:", error);
      toast.error("Failed to grant user access");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryPermissionChange = (category: CategoryType, permission: ApplicationPermission) => {
    const updatedPermissions: CategoryPermission[] = categoryPermissions.map(cp =>
      cp.category === category
        ? { category, permission }
        : cp
    );
    setCategoryPermissions(updatedPermissions);
    form.setValue("categoryPermissions", updatedPermissions);
  };

  const updateAllCategoryPermissions = (permission: ApplicationPermission) => {
    const updatedPermissions: CategoryPermission[] = Object.values(CategoryType).map(category => ({
      category,
      permission
    }));
    setCategoryPermissions(updatedPermissions);
    form.setValue("categoryPermissions", updatedPermissions);
  };

  const handleMainPermissionChange = (permission: ApplicationPermission) => {
    form.setValue("permission", permission);
    updateAllCategoryPermissions(permission);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <UserSelectField control={form.control} users={users} />

        <MainPermissionSelector
          control={form.control}
          value={form.watch("permission")}
          onPermissionChange={handleMainPermissionChange}
        />

        <CategoryPermissionsAccordion
          categoryPermissions={categoryPermissions}
          onCategoryPermissionChange={handleCategoryPermissionChange}
        />

        <FormActionButtons onCancel={onCancel} isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
}
