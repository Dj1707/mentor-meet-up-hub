
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Filter, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const SessionCard = ({ 
  title, 
  date, 
  time, 
  mentor,
  type,
  status
}: { 
  title: string; 
  date: string; 
  time: string; 
  mentor: string;
  type: string;
  status: "scheduled" | "completed" | "cancelled";
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
        <p className="text-sm mb-4">Mentor: {mentor}</p>
        <div className="flex space-x-2">
          {status === "scheduled" && (
            <>
              <Button variant="default" size="sm">Join Session</Button>
              <Button variant="outline" size="sm">Reschedule</Button>
              <Button variant="ghost" size="sm" className="text-destructive">Cancel</Button>
            </>
          )}
          {status === "completed" && (
            <Button variant="outline" size="sm">Leave Feedback</Button>
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
  
  const handleNext = () => {
    setStep(step + 1);
  };
  
  const handlePrevious = () => {
    setStep(step - 1);
  };
  
  const handleBooking = () => {
    // Handle booking logic
    setOpen(false);
    setStep(1);
  };
  
  const mentors = [
    { id: "1", name: "Taylor Smith", expertise: "Career Guidance" },
    { id: "2", name: "Jordan Lee", expertise: "Technical Interviews" },
    { id: "3", name: "Morgan Jones", expertise: "Resume Review" },
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
                  <div className="font-medium">{m.name}</div>
                  <div className="text-sm text-muted-foreground">Expertise: {m.expertise}</div>
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
                <div className="font-medium">April 16, 2025</div>
                <div className="text-sm text-muted-foreground">3:00 PM - 3:45 PM</div>
              </div>
              <div className="p-4 border rounded-md cursor-pointer hover:border-primary/50">
                <div className="font-medium">April 16, 2025</div>
                <div className="text-sm text-muted-foreground">4:00 PM - 4:45 PM</div>
              </div>
              <div className="p-4 border rounded-md cursor-pointer hover:border-primary/50">
                <div className="font-medium">April 17, 2025</div>
                <div className="text-sm text-muted-foreground">10:00 AM - 10:45 AM</div>
              </div>
              <div className="p-4 border rounded-md cursor-pointer hover:border-primary/50">
                <div className="font-medium">April 17, 2025</div>
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

const StudentSessions = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showFilters, setShowFilters] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  
  // Sample session data
  const upcomingSessions = [
    {
      id: "1",
      title: "Career Guidance Session",
      date: "Apr 16, 2025",
      time: "3:00 PM - 3:45 PM",
      mentor: "Taylor Smith",
      type: "Career Guidance",
      status: "scheduled" as const
    },
    {
      id: "2",
      title: "Technical Interview Prep",
      date: "Apr 18, 2025",
      time: "11:00 AM - 12:00 PM",
      mentor: "Jordan Lee",
      type: "Interview Prep",
      status: "scheduled" as const
    }
  ];
  
  const pastSessions = [
    {
      id: "3",
      title: "Resume Review Session",
      date: "Apr 10, 2025",
      time: "2:00 PM - 2:30 PM",
      mentor: "Morgan Jones",
      type: "Resume Review",
      status: "completed" as const
    },
    {
      id: "4",
      title: "Job Search Strategy",
      date: "Apr 3, 2025",
      time: "10:00 AM - 10:45 AM",
      mentor: "Taylor Smith",
      type: "Career Guidance",
      status: "cancelled" as const
    }
  ];
  
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
                type={session.type}
                status={session.status}
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
                type={session.type}
                status={session.status}
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
    </MainLayout>
  );
};

export default StudentSessions;
