import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Application } from "@/types";
import { toast } from "sonner";
import { applicationApi } from "@/lib/api";
import { authApi } from "@/lib/api";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ApplicationFormProps {
  onSubmit: (application: Application) => void;
  onCancel: () => void;
  defaultValues?: Partial<Application>;
}

export default function ApplicationForm({ 
  onSubmit, 
  onCancel, 
  defaultValues 
}: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
    },
  });

  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      let application: Application;
      const currentUser = authApi.getCurrentUser();
      const userId = currentUser?.id || "unknown";
      
      if (defaultValues?.id) {
        // Update existing application
        const appId = parseInt(defaultValues.id);
        
        await applicationApi.update(appId, {
          name: data.name,
          description: data.description || "",
          isActive: true
        });
        
        // Since the API doesn't return the full updated object,
        // we'll construct it from what we know
        application = {
          id: defaultValues.id,
          name: data.name,
          description: data.description,
          createdBy: defaultValues.createdBy || userId,
          createdAt: defaultValues.createdAt || new Date(),
          updatedAt: new Date()
        };
      } else {
        // Create new application
        const appId = await applicationApi.create({
          name: data.name,
          description: data.description || "",
          isActive: true
        });
        
        // Construct the application object with the new ID
        application = {
          id: appId.toString(),
          name: data.name,
          description: data.description,
          createdBy: userId,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }
      
      onSubmit(application);
    } catch (error) {
      toast.error("Failed to save application");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Application Name</FormLabel>
              <FormControl>
                <Input placeholder="My Application" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe this application..." 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-4 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="rounded-md"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="rounded-md"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
