
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Filter, Plus, Search, Star, Video, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SessionCard = ({ 
  title, 
  date, 
  time, 
  mentor,
  mentorImage,
  type,
  status,
  meetingLink,
  feedbackReceived,
  onJoin,
  onReschedule,
  onCancel,
  onLeaveFeedback,
  onViewFeedback
}: { 
  title: string; 
  date: string; 
  time: string; 
  mentor: string;
  mentorImage?: string;
  type: string;
  status: "scheduled" | "completed" | "cancelled";
  meetingLink?: string;
  feedbackReceived?: boolean;
  onJoin: () => void;
  onReschedule: () => void;
  onCancel: () => void;
  onLeaveFeedback: () => void;
  onViewFeedback: () => void;
}) => {
  let statusClass = "";
  let statusText = "";
  
  switch (status) {
    case "scheduled":
      statusClass = "bg-blue-100 text-blue-800";
      statusText = "Scheduled";
      break;
    case "completed":
      statusClass = "bg-green-100 text-green-800";
      statusText = "Completed";
      break;
    case "cancelled":
      statusClass = "bg-red-100 text-red-800";
      statusText = "Cancelled";
      break;
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-start text-lg">
          <span>{title}</span>
          <div className="flex space-x-2">
            <span className="text-xs bg-mentor-muted text-mentor px-2 py-1 rounded-full">{type}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${statusClass}`}>{statusText}</span>
          </div>
        </CardTitle>
        <CardDescription className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" /> {date}
          <span className="mx-2">•</span>
          <Clock className="w-4 h-4 mr-1" /> {time}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={mentorImage} alt={mentor} />
            <AvatarFallback>{mentor[0]}</AvatarFallback>
          </Avatar>
          <span>Mentor: {mentor}</span>
        </div>
        
        {status === "scheduled" && meetingLink && (
          <div className="p-3 bg-blue-50 rounded-md mb-4">
            <div className="flex items-center gap-2 text-blue-800">
              <Video className="h-4 w-4" />
              <p className="font-medium">Meeting Link Available</p>
            </div>
            <p className="text-xs text-blue-800 mt-1">
              Your meeting is scheduled for {date} at {time}
            </p>
          </div>
        )}
        
        {status === "completed" && feedbackReceived && (
          <div className="p-3 bg-green-50 rounded-md mb-4">
            <div className="flex items-center gap-2 text-green-800">
              <MessageCircle className="h-4 w-4" />
              <p className="font-medium">Feedback Received</p>
            </div>
            <p className="text-xs text-green-800 mt-1">
              Mentor has provided feedback on your session
            </p>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {status === "scheduled" && (
            <>
              <Button variant="default" size="sm" onClick={onJoin}>
                <Video className="mr-1 h-4 w-4" /> Join Session
              </Button>
              <Button variant="outline" size="sm" onClick={onReschedule}>Reschedule</Button>
              <Button variant="ghost" size="sm" className="text-destructive" onClick={onCancel}>Cancel</Button>
            </>
          )}
          {status === "completed" && (
            <>
              <Button variant="outline" size="sm" onClick={onLeaveFeedback}>Leave Feedback</Button>
              {feedbackReceived && (
                <Button variant="outline" size="sm" onClick={onViewFeedback}>View Mentor Feedback</Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const BookSessionDialog = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  const [step, setStep] = useState(1);
  const [sessionType, setSessionType] = useState("");
  const [mentor, setMentor] = useState("");
  const { toast } = useToast();
  
  const handleNext = () => {
    setStep(step + 1);
  };
  
  const handlePrevious = () => {
    setStep(step - 1);
  };
  
  const handleBooking = () => {
    // Handle booking logic
    toast({
      title: "Session Booked",
      description: "Your session has been successfully booked. You'll receive a confirmation email shortly.",
    });
    
    setOpen(false);
    setStep(1);
  };
  
  const mentors = [
    { id: "1", name: "Taylor Smith", expertise: "Career Guidance", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" },
    { id: "2", name: "Jordan Lee", expertise: "Technical Interviews", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a" },
    { id: "3", name: "Morgan Jones", expertise: "Resume Review", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2" },
  ];
  
  const sessionTypes = [
    { id: "1", name: "Career Guidance", duration: 45 },
    { id: "2", name: "Technical Interview Prep", duration: 60 },
    { id: "3", name: "Resume Review", duration: 30 },
    { id: "4", name: "Job Search Strategy", duration: 45 },
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
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {sessionTypes.map((type) => (
                <div 
                  key={type.id}
                  className={`p-4 border rounded-md cursor-pointer transition-colors ${
                    sessionType === type.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
                  }`}
                  onClick={() => setSessionType(type.id)}
                >
                  <div className="font-medium">{type.name}</div>
                  <div className="text-sm text-muted-foreground">Duration: {type.duration} min</div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button onClick={handleNext} disabled={!sessionType}>Next</Button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-4">
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
        )}
        
        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 border rounded-md cursor-pointer hover:border-primary/50">
                <div className="font-medium">May 16, 2025</div>
                <div className="text-sm text-muted-foreground">3:00 PM - 3:45 PM</div>
              </div>
              <div className="p-4 border rounded-md cursor-pointer hover:border-primary/50">
                <div className="font-medium">May 16, 2025</div>
                <div className="text-sm text-muted-foreground">4:00 PM - 4:45 PM</div>
              </div>
              <div className="p-4 border rounded-md cursor-pointer hover:border-primary/50">
                <div className="font-medium">May 17, 2025</div>
                <div className="text-sm text-muted-foreground">10:00 AM - 10:45 AM</div>
              </div>
              <div className="p-4 border rounded-md cursor-pointer hover:border-primary/50">
                <div className="font-medium">May 17, 2025</div>
                <div className="text-sm text-muted-foreground">2:00 PM - 2:45 PM</div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious}>Previous</Button>
              <Button onClick={handleBooking}>Book Session</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const FeedbackDialog = ({ open, setOpen, type }: { 
  open: boolean; 
  setOpen: (open: boolean) => void;
  type: "leave" | "view";
}) => {
  const [rating, setRating] = useState("4");
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  
  const handleSubmit = () => {
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback!",
    });
    setOpen(false);
  };
  
  // Sample mentor feedback
  const mentorFeedback = {
    rating: 5,
    strengths: ["Strong problem solving", "Clear communication", "Well prepared"],
    improvements: ["Practice more algorithmic questions", "Work on system design concepts"],
    comment: "It was a pleasure working with you. You demonstrated a good understanding of fundamental concepts and were able to articulate your thoughts clearly. To further improve, I'd recommend focusing on more complex problem-solving scenarios and diving deeper into system design patterns for your next interview."
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === "leave" ? "Leave Feedback" : "Mentor Feedback"}
          </DialogTitle>
          <DialogDescription>
            {type === "leave" ? 
              "Share your experience with your mentor" : 
              "Feedback provided by your mentor"}
          </DialogDescription>
        </DialogHeader>
        
        {type === "leave" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Rating</Label>
              <RadioGroup value={rating} onValueChange={setRating} className="flex">
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex items-center space-x-1">
                    <RadioGroupItem value={value.toString()} id={`rating-${value}`} />
                    <Label htmlFor={`rating-${value}`} className="cursor-pointer">
                      {value}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star 
                    key={value}
                    className={`h-5 w-5 ${
                      parseInt(rating) >= value ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comment">Comments</Label>
              <Textarea 
                id="comment"
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>Submit Feedback</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Rating from Mentor</Label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star 
                    key={value}
                    className={`h-5 w-5 ${
                      mentorFeedback.rating >= value ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Strengths</Label>
              <ul className="list-disc pl-5 text-sm">
                {mentorFeedback.strengths.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-2">
              <Label>Areas for Improvement</Label>
              <ul className="list-disc pl-5 text-sm">
                {mentorFeedback.improvements.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-2">
              <Label>Comments</Label>
              <p className="text-sm">{mentorFeedback.comment}</p>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => setOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const MeetingDialog = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Session</DialogTitle>
          <DialogDescription>
            Your mentor is waiting for you
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-md">
            <div className="flex items-center gap-2 text-blue-800">
              <Video className="h-4 w-4" />
              <p className="font-medium">Video Conference</p>
            </div>
            <p className="text-sm text-blue-600 mt-2">
              <a href="https://meet.google.com/example-link" target="_blank" className="underline">
                https://meet.google.com/example-link
              </a>
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm">Tips for a productive meeting:</p>
            <ul className="list-disc pl-5 text-sm">
              <li>Make sure your microphone and camera are working</li>
              <li>Join from a quiet place</li>
              <li>Prepare your questions in advance</li>
              <li>Take notes during the session</li>
            </ul>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
            <Button 
              onClick={() => {
                window.open("https://meet.google.com/example-link", "_blank");
                setOpen(false);
              }}
            >
              <Video className="mr-2 h-4 w-4" />
              Join Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const StudentSessions = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showFilters, setShowFilters] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [viewFeedbackDialogOpen, setViewFeedbackDialogOpen] = useState(false);
  const [meetingDialogOpen, setMeetingDialogOpen] = useState(false);
  
  // Sample session data
  const upcomingSessions = [
    {
      id: "1",
      title: "Career Guidance Session",
      date: "May 16, 2025",
      time: "3:00 PM - 3:45 PM",
      mentor: "Taylor Smith",
      mentorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      type: "Career Guidance",
      status: "scheduled" as const,
      meetingLink: "https://meet.google.com/example-link"
    },
    {
      id: "2",
      title: "Technical Interview Prep",
      date: "May 18, 2025",
      time: "11:00 AM - 12:00 PM",
      mentor: "Jordan Lee",
      mentorImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
      type: "Interview Prep",
      status: "scheduled" as const
    }
  ];
  
  const pastSessions = [
    {
      id: "3",
      title: "Resume Review Session",
      date: "May 10, 2025",
      time: "2:00 PM - 2:30 PM",
      mentor: "Morgan Jones",
      mentorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
      type: "Resume Review",
      status: "completed" as const,
      feedbackReceived: true
    },
    {
      id: "4",
      title: "Job Search Strategy",
      date: "May 3, 2025",
      time: "10:00 AM - 10:45 AM",
      mentor: "Taylor Smith",
      mentorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      type: "Career Guidance",
      status: "cancelled" as const
    }
  ];
  
  const { toast } = useToast();
  
  const handleReschedule = () => {
    toast({
      title: "Reschedule requested",
      description: "You'll receive an email with available slots.",
    });
  };
  
  const handleCancel = () => {
    toast({
      title: "Session cancelled",
      description: "Your session has been cancelled. You can book another one anytime.",
      variant: "destructive"
    });
  };
  
  return (
    <MainLayout title="My Sessions">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
        <Button onClick={() => setBookingDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Book a Session
        </Button>
      </div>
      
      {showFilters && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="session-type">Session Type</Label>
                <Select>
                  <SelectTrigger id="session-type">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="career">Career Guidance</SelectItem>
                    <SelectItem value="interview">Interview Prep</SelectItem>
                    <SelectItem value="resume">Resume Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mentor">Mentor</Label>
                <Select>
                  <SelectTrigger id="mentor">
                    <SelectValue placeholder="All mentors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All mentors</SelectItem>
                    <SelectItem value="taylor">Taylor Smith</SelectItem>
                    <SelectItem value="jordan">Jordan Lee</SelectItem>
                    <SelectItem value="morgan">Morgan Jones</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-range">Date Range</Label>
                <Select>
                  <SelectTrigger id="date-range">
                    <SelectValue placeholder="Last 30 days" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="60">Last 60 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="all">All time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingSessions.length > 0 ? (
            upcomingSessions.map(session => (
              <SessionCard 
                key={session.id}
                title={session.title}
                date={session.date}
                time={session.time}
                mentor={session.mentor}
                mentorImage={session.mentorImage}
                type={session.type}
                status={session.status}
                meetingLink={session.meetingLink}
                onJoin={() => setMeetingDialogOpen(true)}
                onReschedule={handleReschedule}
                onCancel={handleCancel}
                onLeaveFeedback={() => {}}
                onViewFeedback={() => {}}
              />
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">You have no upcoming sessions</p>
                <Button onClick={() => setBookingDialogOpen(true)}>Book a Session</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {pastSessions.length > 0 ? (
            pastSessions.map(session => (
              <SessionCard 
                key={session.id}
                title={session.title}
                date={session.date}
                time={session.time}
                mentor={session.mentor}
                mentorImage={session.mentorImage}
                type={session.type}
                status={session.status}
                feedbackReceived={session.feedbackReceived}
                onJoin={() => {}}
                onReschedule={() => {}}
                onCancel={() => {}}
                onLeaveFeedback={() => setFeedbackDialogOpen(true)}
                onViewFeedback={() => setViewFeedbackDialogOpen(true)}
              />
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">You have no past sessions</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      <BookSessionDialog open={bookingDialogOpen} setOpen={setBookingDialogOpen} />
      <FeedbackDialog open={feedbackDialogOpen} setOpen={setFeedbackDialogOpen} type="leave" />
      <FeedbackDialog open={viewFeedbackDialogOpen} setOpen={setViewFeedbackDialogOpen} type="view" />
      <MeetingDialog open={meetingDialogOpen} setOpen={setMeetingDialogOpen} />
    </MainLayout>
  );
};

export default StudentSessions;
