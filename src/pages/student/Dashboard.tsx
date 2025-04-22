import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, BookOpen, Check, Link, Star } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const SessionCard = ({ 
  title, 
  date, 
  time, 
  mentor,
  type,
  isPast = false,
  meetingLink = null
}: { 
  title: string; 
  date: string; 
  time: string; 
  mentor: string;
  type: string;
  isPast?: boolean;
  meetingLink?: string | null;
}) => {
  const [viewFeedbackDialog, setViewFeedbackDialog] = useState(false);
  const [viewMentorDialog, setViewMentorDialog] = useState(false);
  const { toast } = useToast();
  
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
              <a href={meetingLink} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="text-xs">
                  <Link className="w-3 h-3 mr-1" /> Join Session
                </Button>
              </a>
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
  const { toast } = useToast();
  
  const availableMentors = [
    {
      id: "1",
      name: "Taylor Smith",
      role: "Senior Software Engineer",
      expertise: ["Career Guidance", "Technical Interviews"],
      rating: 4.9,
      reviews: 32,
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
      expertise: ["System Design", "Career Growth"],
      rating: 4.8,
      reviews: 24,
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
      expertise: ["Resume Review", "Interview Prep"],
      rating: 4.7,
      reviews: 18,
      availability: [
        { date: "Apr 23, 2025", slots: ["10:00 AM", "1:00 PM", "4:00 PM"] },
        { date: "Apr 25, 2025", slots: ["11:00 AM", "3:00 PM"] },
      ],
      sessionTypes: ["Resume Review", "Interview Prep"]
    }
  ];
  
  const sessionTypes = [
    { id: "1", name: "Career Guidance", duration: 45, price: 30, description: "Get personalized career advice from experienced professionals." },
    { id: "2", name: "Technical Interview Prep", duration: 60, price: 40, description: "Practice technical interviews with experienced engineers." },
    { id: "3", name: "Resume Review", duration: 30, price: 25, description: "Get your resume reviewed by industry professionals." },
    { id: "4", name: "System Design", duration: 60, price: 45, description: "Learn system design principles for senior-level interviews." }
  ];
  
  const handleBookSession = () => {
    toast({
      title: "Session Booked Successfully!",
      description: `Your ${selectedType ? sessionTypes.find(type => type.id === selectedType)?.name : 'session'} has been scheduled.`,
    });
    setOpen(false);
    setSelectedMentor(null);
    setSelectedType(null);
    setSelectedTimeSlot(null);
  };
  
  const filteredMentors = selectedType 
    ? availableMentors.filter(mentor => 
        mentor.sessionTypes.includes(sessionTypes.find(type => type.id === selectedType)?.name || ""))
    : availableMentors;
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Available Sessions</DialogTitle>
          <DialogDescription>
            Browse available mentors and their open time slots
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="mentors" className="mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="mentors">Browse Mentors</TabsTrigger>
            <TabsTrigger value="sessions">Session Types</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mentors" className="space-y-6">
            {filteredMentors.map((mentor) => (
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
                          <p className="text-sm text-muted-foreground">{mentor.role}</p>
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
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2"
                          onClick={() => setSelectedMentor(mentor.id === selectedMentor ? null : mentor.id)}
                        >
                          {mentor.id === selectedMentor ? "Hide Availability" : "View Availability"}
                        </Button>
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
            ))}
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
                  <CardDescription>{type.duration} minutes • ${type.price}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{type.description}</p>
                  <Button 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedType(type.id);
                      document.querySelector('[value="mentors"]')?.click();
                    }}
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
  );
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
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
      meetingLink: "https://meet.google.com/abc-defg-hij"
    },
    {
      id: "2",
      title: "Technical Interview Prep",
      date: "Apr 18, 2025",
      time: "11:00 AM - 12:00 PM",
      mentor: "Jordan Lee",
      type: "Interview Prep",
      meetingLink: null
    }
  ];
  
  const pastSessions = [
    {
      id: "3",
      title: "Resume Review Session",
      date: "Apr 10, 2025",
      time: "2:00 PM - 2:30 PM",
      mentor: "Morgan Jones",
      type: "Resume Review"
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
      
      <AvailableSessionsDialog open={bookingDialogOpen} setOpen={setBookingDialogOpen} />
    </MainLayout>
  );
};

export default StudentDashboard;
