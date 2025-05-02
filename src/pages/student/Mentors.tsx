
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import MentorCard from "@/components/student/mentors/MentorCard";
import SearchHeader from "@/components/student/mentors/SearchHeader";
import FilterSection from "@/components/student/mentors/FilterSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import mentors from "@/data/sampleMentors";

const StudentMentors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [expertiseFilter, setExpertiseFilter] = useState("");
  const [sessionTypeFilter, setSessionTypeFilter] = useState("");
  
  const filteredMentors = mentors.filter(mentor => {
    // Apply search filter
    if (searchTerm && !mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !mentor.role.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !mentor.company.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply expertise filter
    if (expertiseFilter && !mentor.expertise.includes(expertiseFilter)) {
      return false;
    }
    
    // Apply session type filter (assuming mentors have sessionTypeIds property)
    if (sessionTypeFilter && mentor.sessionTypeIds && 
        !mentor.sessionTypeIds.includes(sessionTypeFilter)) {
      return false;
    }
    
    return true;
  });
  
  return (
    <MainLayout title="Find Mentors">
      <SearchHeader 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />
      
      <FilterSection 
        expertiseFilter={expertiseFilter}
        setExpertiseFilter={setExpertiseFilter}
        sessionTypeFilter={sessionTypeFilter}
        setSessionTypeFilter={setSessionTypeFilter}
        showFilters={showFilters}
      />
      
      <ScrollArea className="h-[calc(100vh-220px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map(mentor => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
          
          {filteredMentors.length === 0 && (
            <div className="col-span-full p-8 text-center">
              <h3 className="font-medium text-lg">No mentors found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </MainLayout>
  );
};

export default StudentMentors;
