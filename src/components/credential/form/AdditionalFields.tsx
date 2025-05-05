import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface AdditionalFieldsProps {
  form: UseFormReturn<any>;
}

export function AdditionalFields({ form }: AdditionalFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL (optional)</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Notes</FormLabel>
            <FormControl>
              <textarea
                className="w-full border rounded-md px-2 py-2"
                rows={4}
                placeholder="Add any additional notes or details..."
                value={field.value || ""}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  console.log("Notes changed to:", e.target.value);
                }}
                onBlur={field.onBlur}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
