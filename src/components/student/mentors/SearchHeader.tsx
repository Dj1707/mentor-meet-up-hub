
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";

interface SearchHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
}

const SearchHeader = ({ searchTerm, setSearchTerm, showFilters, setShowFilters }: SearchHeaderProps) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search mentors..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Button 
        variant="outline" 
        className="w-full sm:w-auto"
        onClick={() => setShowFilters(!showFilters)}
      >
        <Filter className="mr-2 h-4 w-4" />
        {showFilters ? "Hide Filters" : "Show Filters"}
      </Button>
    </div>
  );
};

export default SearchHeader;
