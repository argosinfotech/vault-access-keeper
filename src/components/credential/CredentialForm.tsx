
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Credential, CategoryType, EnvironmentType } from "@/types";
import { mockApplications } from "@/lib/mock-data";
import { BasicInfoFields } from "@/components/credential/form/BasicInfoFields";
import { AccessFields } from "@/components/credential/form/AccessFields";
import { AdditionalFields } from "@/components/credential/form/AdditionalFields";
import { ApplicationField } from "@/components/credential/form/ApplicationField";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const CATEGORY_OPTIONS: Array<{ label: string; value: CategoryType }> = [
  { label: "Staging Hosting", value: CategoryType.STAGING_HOSTING },
  { label: "Production Hosting", value: CategoryType.PRODUCTION_HOSTING },
  { label: "Staging Application", value: CategoryType.STAGING_APPLICATION },
  { label: "Live Application", value: CategoryType.LIVE_APPLICATION },
  { label: "QA Application", value: CategoryType.QA_APPLICATION },
  { label: "Other", value: CategoryType.OTHER },
];

const credentialSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  url: z.string().optional(),
  environment: z.string(),
  category: z.nativeEnum(CategoryType),
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
    category: defaultValues?.category || credential?.category || CategoryType.STAGING_HOSTING,
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
        <BasicInfoFields form={form} />
        
        <AccessFields form={form} />

        {/* Category Field - updated to fixed list */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <select
                  className="w-full border rounded-md px-2 py-2"
                  {...field}
                  value={field.value}
                >
                  {CATEGORY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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

