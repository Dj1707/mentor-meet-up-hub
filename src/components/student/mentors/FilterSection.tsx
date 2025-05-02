
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sessionTypes } from "@/data/sessionTypes";

interface FilterSectionProps {
  expertiseFilter: string;
  setExpertiseFilter: (value: string) => void;
  sessionTypeFilter: string;
  setSessionTypeFilter: (value: string) => void;
  showFilters: boolean;
}

const FilterSection = ({ 
  expertiseFilter, 
  setExpertiseFilter, 
  sessionTypeFilter,
  setSessionTypeFilter,
  showFilters 
}: FilterSectionProps) => {
  if (!showFilters) return null;
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expertise">Expertise</Label>
            <Select value={expertiseFilter} onValueChange={setExpertiseFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All expertise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All expertise</SelectItem>
                <SelectItem value="Career Guidance">Career Guidance</SelectItem>
                <SelectItem value="Technical Interviews">Technical Interviews</SelectItem>
                <SelectItem value="Resume Review">Resume Review</SelectItem>
                <SelectItem value="Career Transition">Career Transition</SelectItem>
                <SelectItem value="Leadership Development">Leadership Development</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sessionType">Session Type</Label>
            <Select value={sessionTypeFilter} onValueChange={setSessionTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All session types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All session types</SelectItem>
                {sessionTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rating">Minimum Rating</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Any rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any rating</SelectItem>
                <SelectItem value="4.5">4.5+</SelectItem>
                <SelectItem value="4.0">4.0+</SelectItem>
                <SelectItem value="3.5">3.5+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="availability">Availability</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Any time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any time</SelectItem>
                <SelectItem value="this-week">This week</SelectItem>
                <SelectItem value="next-week">Next week</SelectItem>
                <SelectItem value="weekends">Weekends only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSection;
