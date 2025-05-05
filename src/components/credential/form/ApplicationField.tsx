import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Application } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { useEffect, useMemo } from "react";

interface ApplicationFieldProps {
  form: UseFormReturn<any>;
  applications?: Application[];
}

export function ApplicationField({ form, applications = [] }: ApplicationFieldProps) {
  const appOptions = useMemo(() => {
    return [
      { id: "none", name: "None (Standalone credential)" }, 
      ...(applications || []).map(app => ({
        id: app.id,
        name: app.name
      }))
    ];
  }, [applications]);

  // Get the current value from the form
  const currentAppId = form.watch("applicationId");
  
  // Debug log to help diagnose issues
  useEffect(() => {
    console.log("ApplicationField - current applicationId:", currentAppId);
    console.log("Available applications:", applications);
  }, [currentAppId, applications]);

  return (
    <FormField
      control={form.control}
      name="applicationId"
      render={({ field }) => {
        // Ensure we have a valid value or default to "none"
        const selectedValue = field.value || "none";
        console.log("ApplicationField rendering with value:", selectedValue);
        
        return (
          <FormItem>
            <FormLabel>Application (Optional)</FormLabel>
            <FormControl>
              <select
                className="w-full border rounded-md px-2 py-2"
                {...field}
                value={field.value || "none"}
                onChange={(e) => {
                  const value = e.target.value === "none" ? undefined : e.target.value;
                  field.onChange(value);
                  console.log("ApplicationId changed to:", value);
                }}
              >
                <option value="none">None</option>
                {applications.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.name}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormDescription>
              Link this credential to an application for better organization
            </FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
