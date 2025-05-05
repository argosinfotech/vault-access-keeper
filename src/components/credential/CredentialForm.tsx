import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Application, Credential, CategoryType, EnvironmentType } from "@/types";
import { BasicInfoFields } from "@/components/credential/form/BasicInfoFields";
import { AccessFields } from "@/components/credential/form/AccessFields";
import { AdditionalFields } from "@/components/credential/form/AdditionalFields";
import { ApplicationField } from "@/components/credential/form/ApplicationField";
import { Skeleton } from "@/components/ui/skeleton";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as credentialApi from "@/api/credentialApi";
import * as categoryApi from "@/api/categoryApi";

interface CategoryOption {
  label: string;
  value: number;
  description?: string;
}

const credentialSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  url: z.string().optional(),
  environment: z.string(),
  category: z.number(),
  applicationId: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof credentialSchema>;

interface CredentialFormProps {
  credential?: Credential;
  applications: Application[];
  onSave: (credential: Partial<Credential>) => void;
  onCancel: () => void;
  onSubmit?: (data: any) => Promise<void>;
  defaultValues?: Partial<FormValues>;
  applicationMode?: boolean;
}

const CredentialForm = ({ 
  credential, 
  applications,
  onSave, 
  onCancel,
  onSubmit,
  defaultValues,
  applicationMode = false
}: CredentialFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch category types from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const categoryTypes = await categoryApi.getCategoryTypes();
        
        // Map the response to our CategoryOption format
        const categoryOptions = categoryTypes.map(category => ({
          label: category.name,
          value: category.id,
          description: category.description
        }));
        
        setCategories(categoryOptions);
      } catch (error) {
        console.error("Error fetching category types:", error);
        // Fallback to hardcoded categories if API fails
        setCategories([
          { label: "Development Hosting", value: 1 },
          { label: "Production Hosting", value: 2 },
          { label: "Staging Application", value: 3 },
          { label: "Live Application", value: 4 },
          { label: "QA Application", value: 5 },
          { label: "Other", value: 6 },
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Log credential for debugging
  useEffect(() => {
    console.log("CredentialForm rendering with credential:", credential);
    console.log("Available applications:", applications);
  }, [credential, applications]);

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(credentialSchema),
    defaultValues: {
      title: "",
      username: "",
      password: "",
      url: "",
      environment: EnvironmentType.DEVELOPMENT,
      category: 6, // Default to OTHER = 6
      applicationId: "none",
      notes: "",
    }
  });

  // Reset the form values when credential changes
  useEffect(() => {
    if (credential) {
      console.log("Setting form values for editing credential:", credential);
      
      // Ensure applicationId is properly formatted
      const appId = credential.applicationId && credential.applicationId !== "undefined" 
        ? credential.applicationId 
        : "none";
      
      // Convert category from enum to ID
      const categoryId = credential.category 
        ? credentialApi.mapCategoryToId(credential.category) 
        : 6; // Default to OTHER = 6
      
      // Reset the form with all values from the credential
      form.reset({
        title: credential.title || "",
        username: credential.username || "",
        password: credential.password || "",
        url: credential.url || "",
        environment: credential.environment || EnvironmentType.DEVELOPMENT,
        category: categoryId,
        applicationId: appId,
        notes: credential.notes || "",
      });
      
      // Force field updates for fields not automatically binding
      setTimeout(() => {
        form.setValue("category", categoryId);
        form.setValue("applicationId", appId);
        form.setValue("notes", credential.notes || "");
        console.log("Form values after setTimeout reset:", form.getValues());
      }, 0);
      
      console.log("Form values after reset:", form.getValues());
    }
  }, [credential, form]);

  const handleSubmit = async (values: FormValues) => {
    console.log("Form submitted with values:", values);
    setSubmitting(true);
    
    try {
      if (onSubmit) {
        console.log("Using custom onSubmit handler");
        await onSubmit(values);
        return;
      }

      // Convert values to proper types
      const credentialData: Partial<Credential> = {
        ...values,
        environment: values.environment as EnvironmentType,
        // Pass the numeric ID directly - use type assertion to satisfy TypeScript
        category: values.category as unknown as CategoryType,
        // Only include applicationId if it's not empty and not "none"
        applicationId: (values.applicationId && values.applicationId !== "" && values.applicationId !== "none") 
          ? values.applicationId 
          : undefined,
        // Set creator for new credentials only
        createdBy: credential ? undefined : "user-1", // Would come from auth context in real app
      };

      // If editing, make sure to include the ID
      if (credential && credential.id) {
        credentialData.id = credential.id;
      }

      console.log("Calling onSave with processed credential data:", credentialData);
      onSave(credentialData);
    } catch (error) {
      console.error("Error submitting credential form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicInfoFields form={form} />
        
        <AccessFields form={form} />

        {/* Category Field - using API data */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                {loadingCategories ? (
                  <Skeleton className="w-full h-10" />
                ) : (
                  <select
                    className="w-full border rounded-md px-2 py-2"
                    {...field}
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(parseInt(e.target.value, 10));
                      console.log("Category changed to:", parseInt(e.target.value, 10));
                    }}
                  >
                    {categories.map(option => (
                      <option key={option.value} value={option.value} title={option.description}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <ApplicationField form={form} applications={applications} />
        
        <AdditionalFields form={form} />
        
        <div className="flex justify-end space-x-2 pt-6 mt-6 sticky bottom-0 bg-white">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting || loadingCategories}>
            {submitting ? "Submitting..." : credential ? "Update Credential" : "Create Credential"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CredentialForm;

