
import { CategoryType, ApplicationPermission, CategoryPermission } from "@/types";
import { FormDescription, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoryPermissionsSelectorProps {
  categoryPermissions: CategoryPermission[];
  onChange: (category: CategoryType, permission: ApplicationPermission) => void;
}

export default function CategoryPermissionsSelector({
  categoryPermissions,
  onChange,
}: CategoryPermissionsSelectorProps) {
  return (
    <div className="space-y-4">
      <FormDescription>
        Set specific permissions for each credential category
      </FormDescription>
      {categoryPermissions.map((cp) => (
        <div key={cp.category} className="flex items-center space-x-2">
          <div className="flex-grow">
            <FormLabel className="text-sm font-medium">{cp.category}</FormLabel>
            <Select
              value={cp.permission}
              onValueChange={(value) =>
                onChange(cp.category, value as ApplicationPermission)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ApplicationPermission.ADMIN}>Admin</SelectItem>
                <SelectItem value={ApplicationPermission.VIEWER}>Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}
    </div>
  );
}
