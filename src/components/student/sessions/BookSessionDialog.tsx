
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { sessionTypes } from "@/data/sessionTypes";
import { Search, Calendar, Video } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Link as LinkIcon, File, ExternalLink } from "lucide-react";
import { SessionSubmissionUpload } from "./SessionSubmissionUpload";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import googleAuthService from "@/services/googleAuthService";
import googleCalendarService from "@/services/googleCalendarService";
import googleMeetService from "@/services/googleMeetService";
import { sendSessionBookingEmails } from "@/services/emailService";
import { useAuth } from "@/context/AuthContext";

interface BookSessionDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSessionBooked?: () => void;
}

export const BookSessionDialog = ({ open, setOpen, onSessionBooked }: BookSessionDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedSessionType, setSelectedSessionType] = useState("");
  const [mentor, setMentor] = useState("");
  const [showSubmission, setShowSubmission] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [isGoogleConnected] = useState(googleAuthService.isAuthenticated());
  const [addToCalendar, setAddToCalendar] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  
  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setStep(1);
      setSelectedSessionType("");
      setMentor("");
      setShowSubmission(false);
      setSelectedTimeSlot("");
    }
  }, [open]);
  
  const handleNext = () => {
    setStep(step + 1);
    
    // If we're moving to step 3 and session type requires submission, show submission form
    if (step === 2) {
      const sessionType = sessionTypes.find(type => type.id === selectedSessionType);
      if (sessionType?.submissionType && sessionType.submissionType !== "none") {
        setShowSubmission(true);
      }
    }
  };
  
  const handlePrevious = () => {
    setStep(step - 1);
    
    // If going back from submission step
    if (step === 3 && showSubmission) {
      setShowSubmission(false);
    }
  };
  
  const handleBooking = async () => {
    if (!selectedSessionType || !mentor || !selectedTimeSlot) {
      toast({
        title: "Missing Information",
        description: "Please complete all required selections.",
        variant: "destructive"
      });
      return;
    }
    
    setIsBooking(true);
    
    try {
      // Get the selected session type
      const sessionTypeObj = sessionTypes.find(type => type.id === selectedSessionType);
      
      // Get the selected mentor
      const selectedMentor = mentors.find(m => m.id === mentor);
      
      // Parse the selected time slot
      const [date, timeRange] = selectedTimeSlot.split('|');
      const [startTimeStr, endTimeStr] = timeRange.split('-');
      
      // Create Date objects for start and end times
      const startTime = new Date(`${date} ${startTimeStr.trim()}`);
      const endTime = new Date(`${date} ${endTimeStr.trim()}`);
      
      // Generate session ID
      const sessionId = `session-${Date.now()}`;
      
      // Default meeting link (in case Google Meet creation fails)
      let meetingLink = `https://meet.google.com/simulated-${Math.random().toString(36).substring(2, 9)}`;
      let calendarEventId = null;
      
      // If Google Calendar is connected and user wants to add to calendar
      if (isGoogleConnected && addToCalendar) {
        try {
          // Create Google Meet link
          const meetResult = await googleMeetService.createMeeting(
            sessionTypeObj?.name || "Mentoring Session",
            startTime,
            endTime
          );
          
          if (meetResult) {
            meetingLink = meetResult.meetLink;
            
            // Create calendar event with the meet link
            const eventResult = await googleCalendarService.createEventFromSession(
              {
                id: sessionId,
                sessionTypeId: selectedSessionType,
                sessionType: sessionTypeObj,
                mentorId: selectedMentor?.id || "",
                studentId: user?.id || "",
                startTime: startTime,
                endTime: endTime,
                status: "scheduled",
                meetingLink: meetingLink
              },
              selectedMentor?.email || "mentor@example.com",
              user?.email || "student@example.com"
            );
            
            if (eventResult) {
              calendarEventId = eventResult.eventId;
              
              // If the calendar event has its own meet link, use that instead
              if (eventResult.meetLink) {
                meetingLink = eventResult.meetLink;
              }
            }
          }
        } catch (error) {
          console.error("Error creating Google Calendar event or Meet:", error);
          // Continue with booking even if Google integration fails
        }
      }
      
      // Prepare session data
      const newSession = {
        id: sessionId,
        sessionTypeId: selectedSessionType,
        sessionType: sessionTypeObj,
        mentorId: selectedMentor?.id || "",
        studentId: user?.id || "",
        startTime: startTime,
        endTime: endTime,
        status: "scheduled",
        meetingLink: meetingLink,
        calendarEventId: calendarEventId,
        meetProvider: isGoogleConnected && addToCalendar ? 'google' : 'other'
      };
      
      console.log("New session booked:", newSession);
      
      // Send confirmation emails with calendar invites
      await sendSessionBookingEmails(
        newSession,
        user?.email || "student@example.com",
        selectedMentor?.email || "mentor@example.com",
        meetingLink
      );
      
      toast({
        title: "Session Booked",
        description: "Your session has been successfully booked. You'll receive a confirmation email shortly.",
      });
      
      if (onSessionBooked) {
        onSessionBooked();
      }
      
      setOpen(false);
      setStep(1);
      setSelectedSessionType("");
      setMentor("");
      setShowSubmission(false);
      setSelectedTimeSlot("");
      
    } catch (error) {
      console.error("Error booking session:", error);
      toast({
        title: "Booking Error",
        description: "There was an error booking your session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsBooking(false);
    }
  };
  
  const mentors = [
    { id: "1", name: "Taylor Smith", email: "taylor.smith@example.com", expertise: "Career Guidance", image: "" },
    { id: "2", name: "Jordan Lee", email: "jordan.lee@example.com", expertise: "Technical Interviews", image: "" },
    { id: "3", name: "Morgan Jones", email: "morgan.jones@example.com", expertise: "Resume Review", image: "" },
  ];

  const getSelectedSessionType = () => {
    return sessionTypes.find(type => type.id === selectedSessionType);
  };

  const getSubmissionTypeText = (submissionType?: string) => {
    switch (submissionType) {
      case "resume":
        return "You'll need to upload your resume before the session.";
      case "portfolio":
        return "You'll need to share your portfolio link before the session.";
      case "collateral":
        return "You'll need to upload your materials before the session.";
      case "link":
        return "You'll need to share relevant links before the session.";
      default:
        return "";
    }
  };

  const getSubmissionTypeIcon = (submissionType?: string) => {
    switch (submissionType) {
      case "resume":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "portfolio":
        return <ExternalLink className="h-4 w-4 text-purple-500" />;
      case "collateral":
        return <File className="h-4 w-4 text-orange-500" />;
      case "link":
        return <LinkIcon className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const selectedTypeObject = getSelectedSessionType();

  const handleSubmission = (data: any) => {
    toast({
      title: "Submission Uploaded",
      description: "Your materials have been uploaded successfully.",
    });
    
    // Move to next step after submission
    setShowSubmission(false);
    setStep(3);
  };
  
  // Available time slots (would be fetched from an API in a real app)
  const timeSlots = [
    { id: "1", date: "2025-05-16", startTime: "3:00 PM", endTime: "3:45 PM" },
    { id: "2", date: "2025-05-16", startTime: "4:00 PM", endTime: "4:45 PM" },
    { id: "3", date: "2025-05-17", startTime: "10:00 AM", endTime: "10:45 AM" },
    { id: "4", date: "2025-05-17", startTime: "2:00 PM", endTime: "2:45 PM" },
  ];
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book a Session</DialogTitle>
          <DialogDescription>
            {step === 1 && "Select a session type to get started"}
            {step === 2 && "Choose a mentor for your session"}
            {step === 3 && "Pick an available time slot"}
          </DialogDescription>
        </DialogHeader>
        
        {step === 1 && (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 pr-4">
              <div className="grid grid-cols-1 gap-4">
                {sessionTypes.map((type) => (
                  <div 
                    key={type.id}
                    className={`p-4 border rounded-md cursor-pointer transition-colors ${
                      selectedSessionType === type.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedSessionType(type.id)}
                  >
                    <div className="font-medium">{type.name}</div>
                    <div className="text-sm text-muted-foreground">Duration: {type.duration} min</div>
                    <div className="text-sm text-muted-foreground">Price: ₹{type.price}</div>
                    {type.submissionType && type.submissionType !== "none" && (
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        {getSubmissionTypeIcon(type.submissionType)}
                        <span className="text-blue-600">{getSubmissionTypeText(type.submissionType)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button onClick={handleNext} disabled={!selectedSessionType}>Next</Button>
              </div>
            </div>
          </ScrollArea>
        )}
        
        {step === 2 && (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 pr-4">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search mentors..." className="pl-8" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {mentors.map((m) => (
                  <div 
                    key={m.id}
                    className={`p-4 border rounded-md cursor-pointer transition-colors ${
                      mentor === m.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
                    }`}
                    onClick={() => setMentor(m.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={m.image} alt={m.name} />
                        <AvatarFallback>{m.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{m.name}</div>
                        <div className="text-sm text-muted-foreground">Expertise: {m.expertise}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrevious}>Previous</Button>
                <Button onClick={handleNext} disabled={!mentor}>Next</Button>
              </div>
            </div>
          </ScrollArea>
        )}

        {showSubmission && selectedTypeObject && (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 pr-4">
              <SessionSubmissionUpload
                sessionType={selectedTypeObject}
                sessionId="temp-session-id"
                onSubmit={handleSubmission}
              />
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrevious}>Previous</Button>
                <Button onClick={() => {
                  setShowSubmission(false);
                  setStep(3);
                }}>Skip for now</Button>
              </div>
            </div>
          </ScrollArea>
        )}
        
        {step === 3 && !showSubmission && (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 pr-4">
              <div className="grid grid-cols-1 gap-4">
                {timeSlots.map((slot) => {
                  const formattedDate = new Date(slot.date).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric'
                  });
                  const timeValue = `${slot.date}|${slot.startTime} - ${slot.endTime}`;
                  
                  return (
                    <div 
                      key={slot.id}
                      className={`p-4 border rounded-md cursor-pointer transition-colors ${
                        selectedTimeSlot === timeValue ? "border-primary bg-primary/5" : "hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedTimeSlot(timeValue)}
                    >
                      <div className="font-medium">{formattedDate}</div>
                      <div className="text-sm text-muted-foreground">{slot.startTime} - {slot.endTime}</div>
                    </div>
                  );
                })}
              </div>
              
              {/* Google Calendar integration option */}
              {isGoogleConnected && (
                <div className="flex items-center space-x-2 py-2">
                  <Switch 
                    id="add-to-calendar" 
                    checked={addToCalendar}
                    onCheckedChange={setAddToCalendar}
                  />
                  <div className="flex items-center">
                    <Label htmlFor="add-to-calendar" className="mr-2">Add to Google Calendar</Label>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              )}
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrevious}>Previous</Button>
                <Button 
                  onClick={handleBooking} 
                  disabled={!selectedTimeSlot || isBooking}
                >
                  {isBooking ? "Booking..." : "Book Session"}
                </Button>
              </div>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};
