import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/types";
import { currentUser } from "@/lib/mock-data";
import { Search, Bell } from "lucide-react";

interface HeaderProps {
  title: string;
  children?: ReactNode;
}

const Header = ({ title, children }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex items-center justify-between h-16 px-8 border-b">
      <h1 className="text-2xl font-bold">{title}</h1>
      
      <div className="flex items-center gap-4">
        {children}
        
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        
        <Button size="icon" variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </Button>
      </div>
    </div>
  );
};

export default Header;
