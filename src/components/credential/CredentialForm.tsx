
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Credential, CategoryType, EnvironmentType } from "@/types";
import { mockApplications } from "@/lib/mock-data";
import { BasicInfoFields } from "@/components/credential/form/BasicInfoFields";
import { AccessFields } from "@/components/credential/form/AccessFields";
import { AdditionalFields } from "@/components/credential/form/AdditionalFields";
import { ApplicationField } from "@/components/credential/form/ApplicationField";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const credentialSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  url: z.string().optional(),
  environment: z.string(),
  category: z.string(),
  applicationId: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof credentialSchema>;

interface CredentialFormProps {
  credential?: Credential;
  onSave: (credential: Partial<Credential>) => void;
  onCancel: () => void;
  onSubmit?: (data: any) => Promise<void>;
  defaultValues?: Partial<FormValues>;
  applicationMode?: boolean;
}

const CredentialForm = ({ 
  credential, 
  onSave, 
  onCancel,
  onSubmit,
  defaultValues,
  applicationMode = false
}: CredentialFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const initialValues: FormValues = {
    title: defaultValues?.title || credential?.title || "",
    username: defaultValues?.username || credential?.username || "",
    password: defaultValues?.password || credential?.password || "",
    url: defaultValues?.url || credential?.url || "",
    environment: defaultValues?.environment || credential?.environment || EnvironmentType.DEVELOPMENT,
    category: defaultValues?.category || credential?.category || CategoryType.APPLICATION,
    applicationId: defaultValues?.applicationId || credential?.applicationId || "",
    notes: defaultValues?.notes || credential?.notes || "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(credentialSchema),
    defaultValues: initialValues,
  });

  const handleSubmit = async (values: FormValues) => {
    if (onSubmit) {
      await onSubmit(values);
      return;
    }

    // Convert values to proper types
    const credentialData: Partial<Credential> = {
      ...values,
      environment: values.environment as EnvironmentType,
      category: values.category as CategoryType,
      // Only include applicationId if it's not empty
      applicationId: values.applicationId && values.applicationId !== "" ? values.applicationId : undefined,
      // Set creator for new credentials only
      createdBy: credential ? undefined : "user-1", // Would come from auth context in real app
    };

    onSave(credentialData);
  };
  
  const applications = mockApplications;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicInfoFields 
          form={form} 
          showPassword={showPassword} 
          setShowPassword={setShowPassword} 
        />
        
        <AccessFields form={form} />
        
        <ApplicationField form={form} applications={applications} />
        
        <AdditionalFields form={form} />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {credential ? "Update Credential" : "Create Credential"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CredentialForm;
