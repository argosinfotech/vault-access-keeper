
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
import { useMemo } from "react";

interface ApplicationFieldProps {
  form: UseFormReturn<any>;
  applications: Application[];
}

export function ApplicationField({ form, applications }: ApplicationFieldProps) {
  const appOptions = useMemo(() => {
    return [
      { id: "none", name: "None (Standalone credential)" }, 
      ...applications.map(app => ({
        id: app.id,
        name: app.name
      }))
    ];
  }, [applications]);

  return (
    <FormField
      control={form.control}
      name="applicationId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Application (Optional)</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value || "none"}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select application" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {appOptions.map((app) => (
                <SelectItem key={app.id} value={app.id}>
                  {app.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            Link this credential to an application for better organization
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
