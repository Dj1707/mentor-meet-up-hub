
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, Filter, Search, Calendar as CalendarIcon, Star, Briefcase, Linkedin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

// Sample mentor data
const mentors = [
  {
    id: "1",
    name: "Taylor Smith",
    role: "Senior Software Engineer at Google",
    bio: "10+ years experience in web development and system design. Passionate about helping junior developers grow.",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    rating: 4.9,
    sessionCount: 120,
    expertise: ["Career Guidance", "Technical Interviews", "Resume Review"],
    availability: [
      { date: "May 10, 2025", slots: ["10:00 AM", "2:00 PM", "4:00 PM"] },
      { date: "May 11, 2025", slots: ["11:00 AM", "3:00 PM"] },
      { date: "May 12, 2025", slots: ["9:00 AM", "1:00 PM", "5:00 PM"] }
    ]
  },
  {
    id: "2",
    name: "Alex Johnson",
    role: "Product Manager at Amazon",
    bio: "Experienced PM with background in both startups and large tech companies. Specialized in product strategy and user research.",
    profilePicture: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
    rating: 4.7,
    sessionCount: 87,
    expertise: ["Product Management", "Career Transition", "Interview Prep"],
    availability: [
      { date: "May 9, 2025", slots: ["1:00 PM", "5:00 PM"] },
      { date: "May 10, 2025", slots: ["11:00 AM", "4:00 PM"] },
      { date: "May 13, 2025", slots: ["10:00 AM", "2:00 PM"] }
    ]
  },
  {
    id: "3",
    name: "Priya Singh",
    role: "Engineering Director at Microsoft",
    bio: "15+ years in tech leadership. Specialized in helping engineers advance their careers and develop leadership skills.",
    profilePicture: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    rating: 4.8,
    sessionCount: 156,
    expertise: ["Leadership Development", "Career Growth", "Technical Management"],
    availability: [
      { date: "May 11, 2025", slots: ["9:00 AM", "2:00 PM"] },
      { date: "May 12, 2025", slots: ["11:00 AM", "3:00 PM"] },
      { date: "May 14, 2025", slots: ["10:00 AM", "1:00 PM", "4:00 PM"] }
    ]
  }
];

const MentorCard = ({ mentor }: { mentor: typeof mentors[0] }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleBookSession = () => {
    // In a real app, this would make an API call to book the session
    toast({
      title: "Session Booked",
      description: `Your session with ${mentor.name} on ${selectedDate} at ${selectedSlot} has been booked.`,
    });
    
    setShowBooking(false);
    navigate("/student/sessions");
  };
  
  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={mentor.profilePicture} alt={mentor.name} />
              <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{mentor.name}</CardTitle>
              <CardDescription>{mentor.role}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{mentor.rating}</span>
            <span className="text-muted-foreground">({mentor.sessionCount} sessions)</span>
          </div>
          
          <p className="text-sm mb-4 line-clamp-3">{mentor.bio}</p>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {mentor.expertise.map((item, i) => (
              <Badge key={i} variant="secondary" className="text-xs">{item}</Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 pt-2 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => setShowProfile(true)}
          >
            View Profile
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => setShowBooking(true)}
          >
            Book Session
          </Button>
        </CardFooter>
      </Card>
      
      {/* Mentor Profile Modal */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={mentor.profilePicture} alt={mentor.name} />
                <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {mentor.name}
            </DialogTitle>
            <DialogDescription>{mentor.role}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{mentor.rating}</span>
                <span className="text-muted-foreground">({mentor.sessionCount} sessions)</span>
              </div>
              <div className="flex items-center">
                <Linkedin className="h-4 w-4 mr-1" />
                <span className="text-sm text-blue-600 underline">LinkedIn Profile</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">About</h4>
              <p className="text-sm">{mentor.bio}</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Expertise</h4>
              <div className="flex flex-wrap gap-1">
                {mentor.expertise.map((item, i) => (
                  <Badge key={i} variant="secondary">{item}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Experience</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Briefcase className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Google</p>
                    <p className="text-xs text-muted-foreground">Senior Software Engineer (2020 - Present)</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Briefcase className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Facebook</p>
                    <p className="text-xs text-muted-foreground">Software Engineer (2016 - 2020)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowProfile(false)}>Close</Button>
            <Button onClick={() => {
              setShowProfile(false);
              setShowBooking(true);
            }}>Book Session</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Booking Modal */}
      <Dialog open={showBooking} onOpenChange={setShowBooking}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book a Session with {mentor.name}</DialogTitle>
            <DialogDescription>
              Select a date and time that works for you
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Date</Label>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a date" />
                </SelectTrigger>
                <SelectContent>
                  {mentor.availability.map((day, i) => (
                    <SelectItem key={i} value={day.date}>
                      {day.date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedDate && (
              <div className="space-y-2">
                <Label>Select Time Slot</Label>
                <div className="grid grid-cols-2 gap-2">
                  {mentor.availability
                    .find(day => day.date === selectedDate)?.slots
                    .map((slot, i) => (
                      <Button
                        key={i}
                        type="button"
                        variant={selectedSlot === slot ? "default" : "outline"}
                        className="flex items-center justify-center gap-2"
                        onClick={() => setSelectedSlot(slot)}
                      >
                        <Clock className="h-4 w-4" />
                        {slot}
                      </Button>
                    ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setShowBooking(false)}>Cancel</Button>
            <Button 
              disabled={!selectedDate || !selectedSlot}
              onClick={handleBookSession}
            >
              Confirm Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const StudentMentors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [expertiseFilter, setExpertiseFilter] = useState("");
  
  const filteredMentors = mentors.filter(mentor => {
    // Apply search filter
    if (searchTerm && !mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !mentor.role.toLowerCase().includes(searchTerm.toLowerCase())) {
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
          Filters
        </Button>
      </div>
      
      {showFilters && (
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
      )}
      
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
