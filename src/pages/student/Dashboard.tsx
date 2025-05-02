
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, BookOpen, Check, Star, Linkedin, FileText } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { BookSessionDialog } from "@/components/student/sessions/BookSessionDialog";
import { sessionTypes, getSessionTypeById } from "@/data/sessionTypes";

const SessionCard = ({ 
  title, 
  date, 
  time, 
  mentor,
  type,
  isPast = false,
  meetingLink = null,
  sessionTypeId,
  sessionType,
  needsSubmission = false,
  hasSubmitted = false
}: { 
  title: string; 
  date: string; 
  time: string; 
  mentor: string;
  type: string;
  isPast?: boolean;
  meetingLink?: string | null;
  sessionTypeId?: string;
  sessionType?: any;
  needsSubmission?: boolean;
  hasSubmitted?: boolean;
}) => {
  const [viewFeedbackDialog, setViewFeedbackDialog] = useState(false);
  const [viewMentorDialog, setViewMentorDialog] = useState(false);
  const [submissionDialog, setSubmissionDialog] = useState(false);
  
  const handleManageSubmission = () => {
    setSubmissionDialog(true);
  };
  
  return (
    <Card className={`${isPast ? "opacity-70" : ""}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center text-lg">
          <span>{title}</span>
          <span className="text-xs bg-mentor-muted text-mentor px-2 py-1 rounded-full">{type}</span>
        </CardTitle>
        <CardDescription className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" /> {date}
          <span className="mx-2">•</span>
          <Clock className="w-4 h-4 mr-1" /> {time}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-2 flex justify-between">
          <span>Mentor: {mentor}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-6 px-2" 
            onClick={() => setViewMentorDialog(true)}
          >
            View Profile
          </Button>
        </p>
        
        {/* Submission Info for sessions that require it */}
        {needsSubmission && !isPast && (
          <div className={`p-3 ${hasSubmitted ? 'bg-green-50' : 'bg-blue-50'} rounded-md mb-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {sessionType?.submissionType === "resume" && <FileText className="h-4 w-4 mr-1 text-blue-600" />}
                <span className={`${hasSubmitted ? 'text-green-700' : 'text-blue-700'} font-medium`}>
                  {hasSubmitted ? "Submission Ready" : "Submission Required"}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className={hasSubmitted ? "text-green-700" : "text-blue-700"}
                onClick={handleManageSubmission}
              >
                {hasSubmitted ? "Edit Submission" : "Add Submission"}
              </Button>
            </div>
            <p className="text-xs mt-1 text-muted-foreground">
              {!hasSubmitted && sessionType?.submissionType === "resume" && 
                "Please upload your resume before the session"
              }
              {!hasSubmitted && sessionType?.submissionType === "portfolio" && 
                "Please share your portfolio link before the session"
              }
              {!hasSubmitted && sessionType?.submissionType === "collateral" && 
                "Please upload your materials before the session"
              }
            </p>
          </div>
        )}
        
        <div className="flex justify-between mt-4">
          {isPast ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => setViewFeedbackDialog(true)}
            >
              <Check className="w-3 h-3 mr-1" /> View Feedback
            </Button>
          ) : (
            meetingLink ? (
              <RouterLink to={meetingLink} target="_blank">
                <Button variant="outline" size="sm" className="text-xs">
                  <LinkIcon className="w-3 h-3 mr-1" /> Join Session
                </Button>
              </RouterLink>
            ) : (
              <Button variant="outline" size="sm" className="text-xs">
                <Calendar className="w-3 h-3 mr-1" /> Join Session
              </Button>
            )
          )}
          {!isPast && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-muted-foreground"
              onClick={() => toast({
                title: "Reschedule Request Sent",
                description: "We will contact you shortly to reschedule this session."
              })}
            >
              Reschedule
            </Button>
          )}
        </div>

        <Dialog open={viewMentorDialog} onOpenChange={setViewMentorDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Mentor Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-mentor text-white text-xl">
                    {mentor.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{mentor}</h3>
                  <p className="text-sm text-muted-foreground">Senior Software Engineer at Tech Co.</p>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-1 mb-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm ml-1">5.0 (24 reviews)</span>
                </div>
                <p className="text-sm">7 years experience in software development and technical interviewing</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Expertise</h4>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary">JavaScript</Badge>
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">System Design</Badge>
                  <Badge variant="secondary">Career Guidance</Badge>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">About</h4>
                <p className="text-sm">
                  Experienced software engineer specializing in frontend development and helping
                  junior developers navigate their career. I've conducted 200+ technical interviews
                  and helped dozens of mentees land jobs at top tech companies.
                </p>
              </div>
              <Button 
                className="w-full mt-2"
                onClick={() => {
                  setViewMentorDialog(false);
                  toast({
                    title: "Session Request Sent",
                    description: "You'll be notified once the mentor confirms your booking."
                  });
                }}
              >
                Book a Session
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={viewFeedbackDialog} onOpenChange={setViewFeedbackDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Session Feedback</DialogTitle>
              <DialogDescription>Feedback from your mentor</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-medium">Rating</h3>
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 text-gray-300" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Mentor Notes</h4>
                <div className="bg-secondary p-3 rounded-md text-sm">
                  <p>
                    Great session overall! You showed a good understanding of the fundamentals.
                    Your problem-solving approach was methodical, but you could improve on
                    articulating your thought process more clearly during coding exercises.
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Action Items</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Practice more medium-level algorithm questions</li>
                  <li>Review system design concepts we discussed</li>
                  <li>Schedule a follow-up session to work on mock interview skills</li>
                </ul>
              </div>
              <div className="pt-2">
                <Button 
                  className="w-full"
                  onClick={() => {
                    setViewFeedbackDialog(false);
                    toast({
                      title: "Follow-up Session Requested",
                      description: "You'll be notified once the mentor confirms your follow-up session."
                    });
                  }}
                >
                  Book Follow-up Session
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

const AvailableSessionsDialog = ({ open, setOpen }) => {
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [activeTab, setActiveTab] = useState("mentors");
  const [viewMentorDialog, setViewMentorDialog] = useState(false);
  const [currentMentor, setCurrentMentor] = useState(null);
  const { toast } = useToast();
  
  const availableMentors = [
    {
      id: "1",
      name: "Taylor Smith",
      role: "Senior Software Engineer",
      company: "Google",
      expertise: ["Career Guidance", "Technical Interviews"],
      rating: 4.9,
      reviews: 32,
      bio: "Experienced software engineer with 8+ years at major tech companies. Specialized in frontend development and mentoring junior developers. Passionate about helping others grow in their careers.",
      linkedIn: "linkedin.com/in/taylor-smith",
      availability: [
        { date: "Apr 22, 2025", slots: ["10:00 AM", "2:00 PM", "4:00 PM"] },
        { date: "Apr 23, 2025", slots: ["11:00 AM", "3:00 PM"] },
      ],
      sessionTypes: ["Career Guidance", "Technical Interview Prep"]
    },
    {
      id: "2",
      name: "Jordan Lee", 
      role: "Engineering Manager",
      company: "Microsoft",
      expertise: ["System Design", "Career Growth"],
      rating: 4.8,
      reviews: 24,
      bio: "Engineering manager with experience leading teams of 20+ engineers. Previously worked at Amazon and Facebook. Expert in system design and career development strategies.",
      linkedIn: "linkedin.com/in/jordan-lee-tech",
      availability: [
        { date: "Apr 22, 2025", slots: ["9:00 AM", "1:00 PM"] },
        { date: "Apr 24, 2025", slots: ["2:00 PM", "5:00 PM"] },
      ],
      sessionTypes: ["System Design", "Career Guidance"]
    },
    {
      id: "3",
      name: "Morgan Jones",
      role: "Technical Recruiter",
      company: "Apple",
      expertise: ["Resume Review", "Interview Prep"],
      rating: 4.7,
      reviews: 18,
      bio: "Technical recruiter with 5+ years of experience hiring for top tech companies. Expert in resume optimization and interview preparation with insider knowledge of hiring processes.",
      linkedIn: "linkedin.com/in/morgan-jones-recruiter",
      availability: [
        { date: "Apr 23, 2025", slots: ["10:00 AM", "1:00 PM", "4:00 PM"] },
        { date: "Apr 25, 2025", slots: ["11:00 AM", "3:00 PM"] },
      ],
      sessionTypes: ["Resume Review", "Interview Prep"]
    }
  ];
  
  const sessionTypes = [
    { id: "1", name: "Career Guidance", duration: 45, description: "Get personalized career advice from experienced professionals." },
    { id: "2", name: "Technical Interview Prep", duration: 60, description: "Practice technical interviews with experienced engineers." },
    { id: "3", name: "Resume Review", duration: 30, description: "Get your resume reviewed by industry professionals." },
    { id: "4", name: "System Design", duration: 60, description: "Learn system design principles for senior-level interviews." }
  ];
  
  const handleBookSession = () => {
    // Use the properly imported toast from useToast hook
    toast({
      title: "Session Booked Successfully!",
      description: `Your ${selectedType ? sessionTypes.find(type => type.id === selectedType)?.name : 'session'} has been scheduled.`,
    });
    setOpen(false);
    setSelectedMentor(null);
    setSelectedType(null);
    setSelectedTimeSlot(null);
  };
  
  const handleViewProfile = (mentor) => {
    setCurrentMentor(mentor);
    setViewMentorDialog(true);
  };
  
  // Fix the filtering logic to properly filter mentors based on selected session type
  const filteredMentors = selectedType 
    ? availableMentors.filter(mentor => {
        const sessionTypeName = sessionTypes.find(type => type.id === selectedType)?.name;
        return mentor.sessionTypes.includes(sessionTypeName);
      })
    : availableMentors;
  
  const handleFindMentors = (e, typeId) => {
    e.stopPropagation();
    setSelectedType(typeId);
    setActiveTab("mentors");
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Available Sessions</DialogTitle>
            <DialogDescription>
              Browse available mentors and their open time slots
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="mentors" className="mt-4">
            <TabsList className="mb-4">
              <TabsTrigger value="mentors">Browse Mentors</TabsTrigger>
              <TabsTrigger value="sessions">Session Types</TabsTrigger>
            </TabsList>
            
            <TabsContent value="mentors" className="space-y-6">
              {filteredMentors.length > 0 ? (
                filteredMentors.map((mentor) => (
                  <Card key={mentor.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-1/3">
                          <div className="flex items-center space-x-4 mb-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src="" />
                              <AvatarFallback className="bg-mentor text-white">
                                {mentor.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{mentor.name}</h3>
                              <p className="text-sm text-muted-foreground">{mentor.role} at {mentor.company}</p>
                              {mentor.linkedIn && (
                                <a 
                                  href={`https://${mentor.linkedIn}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center text-[#0A66C2] hover:text-[#0A66C2]/80 text-sm mt-1 group"
                                >
                                  <Linkedin className="h-4 w-4 mr-1 fill-[#0A66C2]" />
                                  <span className="underline group-hover:no-underline">LinkedIn</span>
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{mentor.rating} ({mentor.reviews} reviews)</span>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">Expertise</h4>
                              <div className="flex flex-wrap gap-1">
                                {mentor.expertise.map((skill, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleViewProfile(mentor)}
                              >
                                View Profile
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => setSelectedMentor(mentor.id === selectedMentor ? null : mentor.id)}
                              >
                                {mentor.id === selectedMentor ? "Hide Availability" : "View Availability"}
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {mentor.id === selectedMentor && (
                          <div className="md:w-2/3 border-l pl-4">
                            <h4 className="font-medium mb-3">Available Time Slots</h4>
                            <div className="space-y-4">
                              {mentor.availability.map((day, dayIndex) => (
                                <div key={dayIndex}>
                                  <h5 className="text-sm font-medium mb-2">{day.date}</h5>
                                  <div className="grid grid-cols-3 gap-2">
                                    {day.slots.map((slot, slotIndex) => (
                                      <Button 
                                        key={slotIndex} 
                                        variant={selectedTimeSlot === `${mentor.id}-${day.date}-${slot}` ? "default" : "outline"}
                                        size="sm" 
                                        className="text-xs"
                                        onClick={() => setSelectedTimeSlot(`${mentor.id}-${day.date}-${slot}`)}
                                      >
                                        {slot}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 pt-4 border-t">
                              <Button 
                                className="w-full" 
                                disabled={!selectedTimeSlot}
                                onClick={handleBookSession}
                              >
                                Book Session
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground py-4">No mentors available for the selected session type</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedType(null)}
                    >
                      Clear Selection
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="sessions" className="space-y-4">
              {sessionTypes.map((type) => (
                <Card 
                  key={type.id} 
                  className={`${selectedType === type.id ? "border-mentor" : ""} cursor-pointer transition-all`}
                  onClick={() => setSelectedType(type.id === selectedType ? null : type.id)}
                >
                  <CardHeader>
                    <CardTitle>{type.name}</CardTitle>
                    <CardDescription>{type.duration} minutes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{type.description}</p>
                    <Button 
                      className="w-full"
                      onClick={(e) => handleFindMentors(e, type.id)}
                    >
                      Find Available Mentors
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Mentor Profile Dialog */}
      <Dialog open={viewMentorDialog} onOpenChange={setViewMentorDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mentor Profile</DialogTitle>
            <DialogDescription>
              Learn more about this mentor's experience and expertise
            </DialogDescription>
          </DialogHeader>
          {currentMentor && (
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-mentor text-white text-xl">
                    {currentMentor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{currentMentor.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentMentor.role} at {currentMentor.company}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm ml-1">{currentMentor.rating} ({currentMentor.reviews} reviews)</span>
                </div>
                
                {currentMentor.linkedIn && (
                  <a 
                    href={`https://${currentMentor.linkedIn}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white px-3 py-1.5 rounded-md transition-colors"
                  >
                    <Linkedin className="h-4 w-4 fill-white" />
                    <span className="text-sm">LinkedIn</span>
                  </a>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Expertise</h4>
                <div className="flex flex-wrap gap-1">
                  {currentMentor.expertise.map((skill, i) => (
                    <Badge key={i} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">About</h4>
                <p className="text-sm">{currentMentor.bio}</p>
              </div>
              
              <Button 
                className="w-full mt-4"
                onClick={() => {
                  setViewMentorDialog(false);
                  setSelectedMentor(currentMentor.id);
                }}
              >
                View Availability & Book
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast(); // Properly get the toast function from useToast hook
  const studentName = user?.studentProfile?.name || "Student";
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  
  const upcomingSessions = [
    {
      id: "1",
      title: "Career Guidance Session",
      date: "Apr 16, 2025",
      time: "3:00 PM - 3:45 PM",
      mentor: "Taylor Smith",
      type: "Career Guidance",
      meetingLink: "https://meet.google.com/abc-defg-hij",
      sessionTypeId: "1",
      sessionType: getSessionTypeById("1"),
      needsSubmission: false
    },
    {
      id: "2",
      title: "Resume Review 1:1",
      date: "Apr 18, 2025",
      time: "11:00 AM - 12:00 PM",
      mentor: "Jordan Lee",
      type: "Resume Review",
      meetingLink: null,
      sessionTypeId: "6",
      sessionType: getSessionTypeById("6"),
      needsSubmission: true,
      hasSubmitted: false
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
      sessionTypeId: "6",
      sessionType: getSessionTypeById("6")
    }
  ];
  
  return (
    <MainLayout title={`Welcome, ${studentName}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
            <div className="space-y-4">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map(session => (
                  <SessionCard 
                    key={session.id}
                    title={session.title}
                    date={session.date}
                    time={session.time}
                    mentor={session.mentor}
                    type={session.type}
                    meetingLink={session.meetingLink}
                    sessionTypeId={session.sessionTypeId}
                    sessionType={session.sessionType}
                    needsSubmission={session.needsSubmission}
                    hasSubmitted={session.hasSubmitted}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">You have no upcoming sessions</p>
                    <Button className="mt-4" onClick={() => setBookingDialogOpen(true)}>Book a Session</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Past Sessions</h2>
            <div className="space-y-4">
              {pastSessions.length > 0 ? (
                pastSessions.map(session => (
                  <SessionCard 
                    key={session.id}
                    title={session.title}
                    date={session.date}
                    time={session.time}
                    mentor={session.mentor}
                    type={session.type}
                    sessionTypeId={session.sessionTypeId}
                    sessionType={session.sessionType}
                    isPast
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">You have no past sessions</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <Card className="bg-mentor-muted border-mentor">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-mentor" />
                Book a Session
              </CardTitle>
              <CardDescription>Find a mentor and schedule a session</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-mentor hover:bg-mentor/90"
                onClick={() => setBookingDialogOpen(true)}
              >
                Browse Available Sessions
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
              <CardDescription>Complete your profile to get better matches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex justify-between text-sm">
                <span>Progress</span>
                <span>60%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full mb-4">
                <div className="h-2 bg-primary rounded-full" style={{ width: "60%" }}></div>
              </div>
              <ul className="space-y-2 text-sm mb-4">
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-500" /> Basic info
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-500" /> Contact details
                </li>
                <li className="flex items-center text-muted-foreground">
                  <div className="w-4 h-4 mr-2 rounded-full border border-muted-foreground"></div> Target sectors
                </li>
                <li className="flex items-center text-muted-foreground">
                  <div className="w-4 h-4 mr-2 rounded-full border border-muted-foreground"></div> LinkedIn profile
                </li>
              </ul>
              <RouterLink to="/student/profile">
                <Button variant="outline" className="w-full">Complete Profile</Button>
              </RouterLink>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Popular Mentors</CardTitle>
              <CardDescription>Highly rated mentors in your areas of interest</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-mentor text-white">TS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">Taylor Smith</p>
                    <p className="text-xs text-muted-foreground">Career Guidance • 4.9 ★</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-auto text-xs"
                    onClick={() => {
                      setBookingDialogOpen(true);
                    }}
                  >
                    View
                  </Button>
                </div>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-mentor text-white">JL</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">Jordan Lee</p>
                    <p className="text-xs text-muted-foreground">Technical Interviews • 4.8 ★</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-auto text-xs"
                    onClick={() => {
                      setBookingDialogOpen(true);
                    }}
                  >
                    View
                  </Button>
                </div>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-mentor text-white">MJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">Morgan Jones</p>
                    <p className="text-xs text-muted-foreground">Resume Review • 4.7 ★</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-auto text-xs"
                    onClick={() => {
                      setBookingDialogOpen(true);
                    }}
                  >
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <BookSessionDialog open={bookingDialogOpen} setOpen={setBookingDialogOpen} />
    </MainLayout>
  );
};

export default StudentDashboard;
