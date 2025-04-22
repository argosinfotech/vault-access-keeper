
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { User, ApplicationPermission, CategoryType, CategoryPermission } from "@/types";
import { grantApplicationPermission } from "@/api/applicationPermissionApi";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlusCircle, Trash } from "lucide-react";

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
  // Initialize with all category types and default permission
  const [categoryPermissions, setCategoryPermissions] = useState<CategoryPermission[]>(
    Object.values(CategoryType).map(category => ({
      category,
      permission: ApplicationPermission.VIEWER
    }))
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      permission: ApplicationPermission.VIEWER,
      // Explicitly define category and permission as non-optional by creating proper CategoryPermission objects
      categoryPermissions: Object.values(CategoryType).map(category => ({
        category: category,
        permission: ApplicationPermission.VIEWER
      })) as CategoryPermission[]
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
    const updatedPermissions = categoryPermissions.map(cp => 
      cp.category === category ? { category, permission } : cp
    );
    setCategoryPermissions(updatedPermissions);
    form.setValue("categoryPermissions", updatedPermissions);
  };

  // Set all category permissions to match the main permission
  const updateAllCategoryPermissions = (permission: ApplicationPermission) => {
    const updatedPermissions = Object.values(CategoryType).map(category => ({
      category,
      permission
    }));
    setCategoryPermissions(updatedPermissions);
    form.setValue("categoryPermissions", updatedPermissions);
  };

  // Update all category permissions when the main permission changes
  const handleMainPermissionChange = (permission: ApplicationPermission) => {
    form.setValue("permission", permission);
    updateAllCategoryPermissions(permission);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={users.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="permission"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Permission Level</FormLabel>
              <Select 
                onValueChange={(value) => handleMainPermissionChange(value as ApplicationPermission)} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select permission" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ApplicationPermission.ADMIN}>Admin (Full Access)</SelectItem>
                  <SelectItem value={ApplicationPermission.VIEWER}>Viewer (Read Only)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                This permission will be applied to all credential categories
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="category-permissions">
            <AccordionTrigger>Credential Category Permissions</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <FormDescription>
                  Set specific permissions for each credential category
                </FormDescription>

                {categoryPermissions.map((cp, index) => (
                  <div key={cp.category} className="flex items-center space-x-2">
                    <div className="flex-grow">
                      <FormLabel className="text-sm font-medium">{cp.category}</FormLabel>
                      <Select
                        value={cp.permission}
                        onValueChange={(value) => handleCategoryPermissionChange(
                          cp.category, 
                          value as ApplicationPermission
                        )}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ApplicationPermission.ADMIN}>Admin</SelectItem>
                          <SelectItem value={ApplicationPermission.VIEWER}>Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex justify-end gap-2 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Grant Access"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
