
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CategoryPermissionsSelector from "./CategoryPermissionsSelector";
import { CategoryType, ApplicationPermission, CategoryPermission } from "@/types";

interface CategoryPermissionsAccordionProps {
  categoryPermissions: CategoryPermission[];
  onCategoryPermissionChange: (category: CategoryType, permission: ApplicationPermission) => void;
}

export default function CategoryPermissionsAccordion({
  categoryPermissions,
  onCategoryPermissionChange,
}: CategoryPermissionsAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="category-permissions">
        <AccordionTrigger>Credential Category Permissions</AccordionTrigger>
        <AccordionContent>
          <CategoryPermissionsSelector
            categoryPermissions={categoryPermissions}
            onChange={onCategoryPermissionChange}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
