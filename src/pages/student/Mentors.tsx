
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import MentorCard from "@/components/student/mentors/MentorCard";
import SearchHeader from "@/components/student/mentors/SearchHeader";
import FilterSection from "@/components/student/mentors/FilterSection";
import mentors from "@/data/sampleMentors";

const StudentMentors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [expertiseFilter, setExpertiseFilter] = useState("");
  
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
        showFilters={showFilters}
      />
      
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
    </MainLayout>
  );
};

export default StudentMentors;
