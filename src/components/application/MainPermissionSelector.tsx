
import { ApplicationPermission } from "@/types";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MainPermissionSelectorProps {
  control: any;
  value: ApplicationPermission;
  onPermissionChange: (permission: ApplicationPermission) => void;
}

export default function MainPermissionSelector({ control, value, onPermissionChange }: MainPermissionSelectorProps) {
  return (
    <FormField
      control={control}
      name="permission"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Default Permission Level</FormLabel>
          <Select 
            onValueChange={(v) => onPermissionChange(v as ApplicationPermission)}
            value={value}
            defaultValue={value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select permission" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value={ApplicationPermission.ADMIN}>Admin (Full Access)</SelectItem>
              <SelectItem value={ApplicationPermission.VIEWER}>Viewer (Read Only)</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            This permission will be applied to all credential categories
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
