
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Star, Briefcase, Linkedin, User, FileText, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

// Define the mentor type
export interface MentorCardProps {
  mentor: {
    id: string;
    name: string;
    role: string;
    company: string;
    bio: string;
    profilePicture?: string;
    linkedIn?: string;
    rating: number;
    sessionCount: number;
    expertise: string[];
    pastSectors?: string[];
    availability: {
      date: string;
      slots: string[];
    }[];
  };
}

const MentorCard = ({ mentor }: MentorCardProps) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleBookSession = () => {
    toast({
      title: "Session Booked",
      description: `Your session with ${mentor.name} on ${selectedDate} at ${selectedSlot} has been booked.`,
    });
    
    setShowBooking(false);
    navigate("/student/sessions");
  };
  
  return (
    <>
      <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/10">
              <AvatarImage src={mentor.profilePicture} alt={mentor.name} />
              <AvatarFallback className="text-lg bg-primary/10">{mentor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-lg">{mentor.name}</CardTitle>
              <CardDescription className="flex flex-col">
                <span className="flex items-center">
                  <Briefcase className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  {mentor.role} at {mentor.company}
                </span>
                {mentor.linkedIn && (
                  <a 
                    href={`https://${mentor.linkedIn}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-[#0A66C2] hover:text-[#0A66C2]/80 text-sm mt-1 group"
                  >
                    <Linkedin className="h-4 w-4 mr-1 fill-[#0A66C2]" />
                    <span className="underline group-hover:no-underline">LinkedIn Profile</span>
                  </a>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{mentor.rating}</span>
            <span className="text-muted-foreground">({mentor.sessionCount} sessions)</span>
          </div>
          
          <p className="text-sm mb-3 line-clamp-2">{mentor.bio}</p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {mentor.expertise.map((item, i) => (
              <Badge key={i} variant="secondary" className="text-xs">{item}</Badge>
            ))}
          </div>
          
          {mentor.pastSectors && mentor.pastSectors.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-1">Past Sector Experience:</p>
              <div className="flex flex-wrap gap-1">
                {mentor.pastSectors.slice(0, 2).map((sector, i) => (
                  <Badge key={i} variant="outline" className="text-xs bg-slate-50">
                    <FileText className="h-3 w-3 mr-1" />
                    {sector}
                  </Badge>
                ))}
                {mentor.pastSectors.length > 2 && (
                  <Badge variant="outline" className="text-xs bg-slate-50">
                    +{mentor.pastSectors.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2 pt-2 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => setShowProfile(true)}
          >
            <User className="mr-1 h-4 w-4" />
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
      
      {/* Mentor Profile Dialog */}
      <MentorProfileDialog mentor={mentor} open={showProfile} onOpenChange={setShowProfile} onBookSession={() => {
        setShowProfile(false);
        setShowBooking(true);
      }} />
      
      {/* Booking Dialog */}
      <BookingDialog 
        mentor={mentor} 
        open={showBooking} 
        onOpenChange={setShowBooking} 
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedSlot={selectedSlot}
        setSelectedSlot={setSelectedSlot}
        onBookSession={handleBookSession}
      />
    </>
  );
};

interface MentorProfileDialogProps {
  mentor: MentorCardProps['mentor'];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookSession: () => void;
}

const MentorProfileDialog = ({ mentor, open, onOpenChange, onBookSession }: MentorProfileDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <Avatar className="h-16 w-16 border-2 border-primary/10">
              <AvatarImage src={mentor.profilePicture} alt={mentor.name} />
              <AvatarFallback className="text-lg bg-primary/10">{mentor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-xl mb-1">{mentor.name}</DialogTitle>
              <DialogDescription className="flex flex-col">
                <span className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-1 text-muted-foreground" />
                  {mentor.role} at {mentor.company}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">{mentor.rating}</span>
              <span className="text-muted-foreground">({mentor.sessionCount} sessions)</span>
            </div>
            
            {mentor.linkedIn && (
              <a 
                href={`https://${mentor.linkedIn}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white px-3 py-1.5 rounded-md transition-colors"
              >
                <Linkedin className="h-4 w-4 fill-white" />
                <span className="text-sm">LinkedIn Profile</span>
              </a>
            )}
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
          
          {mentor.pastSectors && mentor.pastSectors.length > 0 && (
            <div>
              <h4 className="font-medium mb-1">Past Sector Experience</h4>
              <div className="flex flex-wrap gap-1">
                {mentor.pastSectors.map((sector, i) => (
                  <Badge key={i} variant="outline" className="bg-slate-50">
                    <FileText className="h-3 w-3 mr-1" />
                    {sector}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <h4 className="font-medium mb-1">Experience</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Briefcase className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{mentor.company}</p>
                  <p className="text-xs text-muted-foreground">{mentor.role} (Current)</p>
                </div>
              </div>
              {mentor.id === "1" && (
                <div className="flex items-start gap-2">
                  <Briefcase className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Facebook</p>
                    <p className="text-xs text-muted-foreground">Software Engineer (2016 - 2020)</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={onBookSession}>Book Session</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface BookingDialogProps {
  mentor: MentorCardProps['mentor'];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedSlot: string;
  setSelectedSlot: (slot: string) => void;
  onBookSession: () => void;
}

const BookingDialog = ({ 
  mentor, 
  open, 
  onOpenChange, 
  selectedDate, 
  setSelectedDate, 
  selectedSlot, 
  setSelectedSlot, 
  onBookSession 
}: BookingDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            disabled={!selectedDate || !selectedSlot}
            onClick={onBookSession}
          >
            Confirm Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MentorCard;
