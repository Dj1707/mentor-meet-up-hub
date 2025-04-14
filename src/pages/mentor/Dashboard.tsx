
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Plus, ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const SessionCard = ({ 
  title, 
  date, 
  time, 
  student,
  type,
  isPast = false 
}: { 
  title: string; 
  date: string; 
  time: string; 
  student: string;
  type: string;
  isPast?: boolean;
}) => (
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
          <Button variant="outline" size="sm" className="text-xs">
            <Check className="w-3 h-3 mr-1" /> Completed
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="text-xs">
            <Calendar className="w-3 h-3 mr-1" /> Start Session
          </Button>
        )}
        {!isPast && (
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            Reschedule
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);

const MentorDashboard = () => {
  const { user } = useAuth();
  const mentorName = user?.mentorProfile?.name || "Mentor";
  
  // Sample session data
  const upcomingSessions = [
    {
      id: "1",
      title: "Career Guidance Session",
      date: "Apr 16, 2025",
      time: "3:00 PM - 3:45 PM",
      student: "Alex Johnson",
      type: "Career Guidance"
    },
    {
      id: "2",
      title: "Technical Interview Prep",
      date: "Apr 18, 2025",
      time: "11:00 AM - 12:00 PM",
      student: "Jamie Rivera",
      type: "Interview Prep"
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
  
  // Stats
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
              <Link to="/mentor/sessions">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All <ArrowRight className="ml-1 w-3 h-3" />
                </Button>
              </Link>
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
              <Button className="w-full bg-mentor hover:bg-mentor/90">
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
              <Link to="/mentor/profile">
                <Button variant="outline" className="w-full">Complete Profile</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default MentorDashboard;
