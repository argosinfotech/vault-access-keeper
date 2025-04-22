
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Credential, EnvironmentType, CategoryType } from "@/types";
import { toast } from "sonner";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { AccessFields } from "./form/AccessFields";
import { AdditionalFields } from "./form/AdditionalFields";
import { ApplicationField } from "./form/ApplicationField";
import { addCredential, updateCredential } from "@/api/credentialApi";
import { useQuery } from "@tanstack/react-query";
import { getApplications } from "@/api/applicationApi";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  url: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal('')),
  environment: z.nativeEnum(EnvironmentType),
  category: z.nativeEnum(CategoryType),
  applicationId: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CredentialFormProps {
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
  defaultValues?: Partial<FormValues>;
  applicationMode?: boolean;
}

export default function CredentialForm({ 
  onSubmit, 
  onCancel, 
  defaultValues,
  applicationMode = false
}: CredentialFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: applications } = useQuery({
    queryKey: ['applications'],
    queryFn: getApplications,
    enabled: !applicationMode // Only fetch applications in regular mode
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      username: defaultValues?.username || "",
      password: defaultValues?.password || "",
      url: defaultValues?.url || "",
      environment: defaultValues?.environment || EnvironmentType.DEVELOPMENT,
      category: defaultValues?.category || CategoryType.APPLICATION,
      applicationId: defaultValues?.applicationId || undefined,
      notes: defaultValues?.notes || "",
    },
  });

  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // In a real app, this should be connected to your auth system
      const userId = "current-user-id"; 
      
      const credentialData = {
        ...data,
        createdBy: userId,
      };
      
      await addCredential(credentialData);
      onSubmit(data);
      toast.success("Credential saved successfully!");
    } catch (error) {
      toast.error("Failed to save credential.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
        <BasicInfoFields form={form} />
        
        {!applicationMode && (
          <ApplicationField form={form} applications={applications || []} />
        )}
        
        <AccessFields form={form} />
        <AdditionalFields form={form} />

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
