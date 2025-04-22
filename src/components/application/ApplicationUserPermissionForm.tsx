
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { User, ApplicationPermission } from "@/types";
import { grantApplicationPermission } from "@/api/applicationPermissionApi";
import { toast } from "sonner";

const formSchema = z.object({
  userId: z.string().min(1, "Please select a user"),
  permission: z.nativeEnum(ApplicationPermission)
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      permission: ApplicationPermission.VIEWER
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
        values.permission
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
              <FormLabel>Permission Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <FormMessage />
            </FormItem>
          )}
        />

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
