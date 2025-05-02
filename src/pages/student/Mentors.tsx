
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import MentorCard from "@/components/student/mentors/MentorCard";
import SearchHeader from "@/components/student/mentors/SearchHeader";
import FilterSection from "@/components/student/mentors/FilterSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import userService from "@/services/userService";
import { MentorProfile } from "@/types";

// Interface for our transformed mentor data
interface MentorDisplayData {
  id: string;
  name: string;
  role: string;
  company: string;
  bio: string;
  profilePicture: string;
  linkedIn: string;
  rating: number;
  sessionCount: number;
  expertise: string[];
  pastSectors: string[];
  sessionTypeIds: string[];
  availability: { date: string, slots: string[] }[]; // Made this required
}

const StudentMentors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [expertiseFilter, setExpertiseFilter] = useState("");
  const [sessionTypeFilter, setSessionTypeFilter] = useState("");
  const [mentors, setMentors] = useState<MentorDisplayData[]>([]);
  
  // Fetch mentors from userService on component mount
  useEffect(() => {
    // Get all users from userService
    const users = userService.getAllUsers();
    
    // Filter only mentor users with active status
    const activeMentors = users.filter(user => 
      user.role === "mentor" && 
      user.mentorProfile && 
      (user.mentorProfile.onboardingStatus === "active" || user.mentorProfile.onboardingStatus === undefined)
    );
    
    // Transform the data to match our display requirements
    const transformedMentors = activeMentors.map(user => {
      const profile = user.mentorProfile as MentorProfile;
      return {
        id: user.id,
        name: profile.name || "Unknown",
        role: profile.jobTitle || profile.role || "Mentor",
        company: profile.company || "",
        bio: profile.bio || "No bio provided",
        profilePicture: profile.profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        linkedIn: profile.linkedIn || "",
        rating: profile.rating || 0,
        sessionCount: profile.sessionCount || 0,
        expertise: profile.expertise || ["Career Guidance"],
        pastSectors: profile.pastSectors || [],
        sessionTypeIds: profile.sessionTypeIds || [],
        // Ensure availability is always an array with at least one default item
        availability: profile.availability || [
          {
            date: "2025-05-10",
            slots: ["10:00 AM", "2:00 PM", "4:00 PM"]
          },
          {
            date: "2025-05-11", 
            slots: ["11:00 AM", "3:00 PM"]
          }
        ]
      };
    });
    
    setMentors(transformedMentors);
  }, []);
  
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
    
    // Apply session type filter
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
          {filteredMentors.length > 0 ? (
            filteredMentors.map(mentor => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))
          ) : (
            <div className="col-span-full p-8 text-center">
              <h3 className="font-medium text-lg">No mentors found</h3>
              <p className="text-muted-foreground">
                {mentors.length === 0 
                  ? "There are no mentors available at this time. Please check back later." 
                  : "Try adjusting your search filters"}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </MainLayout>
  );
};

export default StudentMentors;
