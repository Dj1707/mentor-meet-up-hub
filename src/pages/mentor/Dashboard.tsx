import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Plus, ArrowRight, Check, Link, Calendar as CalendarIcon } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SessionCard = ({ 
  title, 
  date, 
  time, 
  student,
  type,
  isPast = false,
  meetingLink = null
}: { 
  title: string; 
  date: string; 
  time: string; 
  student: string;
  type: string;
  isPast?: boolean;
  meetingLink?: string | null;
}) => {
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  
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
        <p className="text-sm mb-4">Student: {student}</p>
        <div className="flex justify-between">
          {isPast ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => setFeedbackDialogOpen(true)}
            >
              <Check className="w-3 h-3 mr-1" /> Submit Feedback
            </Button>
          ) : (
            meetingLink ? (
              <a href={meetingLink} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="text-xs">
                  <Link className="w-3 h-3 mr-1" /> Join Meeting
                </Button>
              </a>
            ) : (
              <Button variant="outline" size="sm" className="text-xs">
                <Calendar className="w-3 h-3 mr-1" /> Start Session
              </Button>
            )
          )}
          {!isPast && (
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              Reschedule
            </Button>
          )}
        </div>

        {/* Feedback Dialog */}
        <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Session Feedback for {student}</DialogTitle>
              <DialogDescription>Please provide feedback for this session</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="feedback-rating">Rating</Label>
                <Select defaultValue="4">
                  <SelectTrigger id="feedback-rating">
                    <SelectValue placeholder="Select a rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 - Excellent</SelectItem>
                    <SelectItem value="4">4 - Good</SelectItem>
                    <SelectItem value="3">3 - Average</SelectItem>
                    <SelectItem value="2">2 - Poor</SelectItem>
                    <SelectItem value="1">1 - Very Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback-notes">Notes</Label>
                <textarea 
                  id="feedback-notes"
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  placeholder="Provide detailed feedback on the session"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="action-items">Action Items</Label>
                <textarea 
                  id="action-items"
                  className="w-full min-h-[60px] p-2 border rounded-md"
                  placeholder="Any action items for the student"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setFeedbackDialogOpen(false)}>
                  Submit Feedback
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

const AddAvailabilityDialog = ({ open, setOpen }) => {
  const handleSave = () => {
    // Handle save logic
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Available Time Slots</DialogTitle>
          <DialogDescription>
            Create time slots when you're available to mentor students
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input id="start-time" type="time" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input id="end-time" type="time" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Session Types</Label>
            <div className="grid grid-cols-2 gap-2">
              {["Career Guidance", "Technical Interview", "Resume Review", "Job Search"].map((type, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input id={`type-${index}`} type="checkbox" className="h-4 w-4" />
                  <Label htmlFor={`type-${index}`} className="text-sm cursor-pointer">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Recurring Schedule</Label>
            <Select defaultValue="none">
              <SelectTrigger>
                <SelectValue placeholder="None (one-time only)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (one-time only)</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="meeting-link">Meeting Link (optional)</Label>
            <Input id="meeting-link" type="url" placeholder="https://meet.google.com/..." />
            <p className="text-sm text-muted-foreground">Add a link to your virtual meeting room</p>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const MentorDashboard = () => {
  const { user } = useAuth();
  const mentorName = user?.mentorProfile?.name || "Mentor";
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState(false);
  
  const upcomingSessions = [
    {
      id: "1",
      title: "Career Guidance Session",
      date: "Apr 16, 2025",
      time: "3:00 PM - 3:45 PM",
      student: "Alex Johnson",
      type: "Career Guidance",
      meetingLink: "https://meet.google.com/abc-defg-hij"
    },
    {
      id: "2",
      title: "Technical Interview Prep",
      date: "Apr 18, 2025",
      time: "11:00 AM - 12:00 PM",
      student: "Jamie Rivera",
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
      student: "Casey Kim",
      type: "Resume Review"
    }
  ];
  
  const stats = [
    { label: "Total Sessions", value: 24 },
    { label: "This Month", value: 8 },
    { label: "Hours Mentored", value: 18 },
    { label: "Earnings", value: "$720" }
  ];
  
  return (
    <MainLayout title={`Welcome, ${mentorName}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Today's Sessions</h2>
              <RouterLink to="/mentor/sessions">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All <ArrowRight className="ml-1 w-3 h-3" />
                </Button>
              </RouterLink>
            </div>
            <div className="space-y-4">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map(session => (
                  <SessionCard 
                    key={session.id}
                    title={session.title}
                    date={session.date}
                    time={session.time}
                    student={session.student}
                    type={session.type}
                    meetingLink={session.meetingLink}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">You have no sessions scheduled for today</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>
            <div className="space-y-4">
              {pastSessions.length > 0 ? (
                pastSessions.map(session => (
                  <SessionCard 
                    key={session.id}
                    title={session.title}
                    date={session.date}
                    time={session.time}
                    student={session.student}
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
                <Plus className="w-5 h-5 mr-2 text-mentor" />
                Create Availability
              </CardTitle>
              <CardDescription>Add time slots when you're available to mentor</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-mentor hover:bg-mentor/90"
                onClick={() => setAvailabilityDialogOpen(true)}
              >
                Add Available Time Slots
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Student Requests
              </CardTitle>
              <CardDescription>Pending session requests from students</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-4">
                No pending requests at the moment
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
              <CardDescription>Complete your profile to attract more students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex justify-between text-sm">
                <span>Progress</span>
                <span>75%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full mb-4">
                <div className="h-2 bg-primary rounded-full" style={{ width: "75%" }}></div>
              </div>
              <ul className="space-y-2 text-sm mb-4">
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-500" /> Basic info
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-500" /> Contact details
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-500" /> Job title
                </li>
                <li className="flex items-center text-muted-foreground">
                  <div className="w-4 h-4 mr-2 rounded-full border border-muted-foreground"></div> LinkedIn profile
                </li>
              </ul>
              <RouterLink to="/mentor/profile">
                <Button variant="outline" className="w-full">Complete Profile</Button>
              </RouterLink>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <AddAvailabilityDialog open={availabilityDialogOpen} setOpen={setAvailabilityDialogOpen} />
    </MainLayout>
  );
};

export default MentorDashboard;
