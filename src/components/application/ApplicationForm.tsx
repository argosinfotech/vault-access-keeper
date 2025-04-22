
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
import { addApplication, updateApplication } from "@/api/applicationApi";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  // category removed
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
      // category removed
    },
  });

  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      let application: Application;
      if (defaultValues?.id) {
        // Update existing application, don't provide category anymore
        const updatedApp = await updateApplication(defaultValues.id, {
          name: data.name,
          description: data.description,
        });
        application = updatedApp;
      } else {
        // Create new application, don't provide category anymore
        const newApp = await addApplication({
          name: data.name,
          description: data.description,
          createdBy: "current-user-id", // In a real app, get from auth context
        });
        application = newApp;
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
