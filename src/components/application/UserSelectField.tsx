
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@/types";

interface UserSelectFieldProps {
  control: any;
  users: User[];
}

export default function UserSelectField({ control, users }: UserSelectFieldProps) {
  return (
    <FormField
      control={control}
      name="userId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>User</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            defaultValue={field.value}
            disabled={users.length === 0}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
