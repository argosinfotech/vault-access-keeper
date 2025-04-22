
import { useMemo, useState } from "react";
import { Application, CategoryType } from "@/types";
import { Button } from "@/components/ui/button";
import { Layout, Filter } from "lucide-react";
import ApplicationCard from "@/components/application/ApplicationCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ApplicationGridProps {
  applications: Application[];
  isLoading?: boolean;
  onEdit: (application: Application) => void;
  onRefresh: () => void;
}

export default function ApplicationGrid({ applications, isLoading, onEdit, onRefresh }: ApplicationGridProps) {
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>([]);

  const handleCategoryToggle = (category: CategoryType) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      }
      return [...prev, category];
    });
  };

  const filteredApplications = useMemo(() => {
    if (selectedCategories.length === 0) return applications;
    return applications.filter(app => selectedCategories.includes(app.category));
  }, [applications, selectedCategories]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Layout className="h-12 w-12 mx-auto mb-4 animate-pulse text-muted-foreground" />
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
        </h3>
        
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 rounded-md">
                <Filter className="h-4 w-4 mr-2" />
                Categories
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.values(CategoryType).map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => handleCategoryToggle(category)}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm" className="h-8" onClick={onRefresh}>
            Refresh
          </Button>
        </div>
      </div>
      
      {filteredApplications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApplications.map(app => (
            <ApplicationCard 
              key={app.id} 
              application={app} 
              onEdit={() => onEdit(app)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
          <Layout className="h-8 w-8 mb-2 opacity-50" />
          <p>No applications found.</p>
        </div>
      )}
    </div>
  );
}
