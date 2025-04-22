
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

export interface BasicInfoFieldsProps {
  form: UseFormReturn<any>;
  showPassword?: boolean; 
  setShowPassword?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function BasicInfoFields({ form }: BasicInfoFieldsProps) {
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input placeholder="My Credential" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
