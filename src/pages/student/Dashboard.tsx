
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, BookOpen, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const SessionCard = ({ 
  title, 
  date, 
  time, 
  mentor,
  type,
  isPast = false 
}: { 
  title: string; 
  date: string; 
  time: string; 
  mentor: string;
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
      <p className="text-sm mb-4">Mentor: {mentor}</p>
      <div className="flex justify-between">
        {isPast ? (
          <Button variant="outline" size="sm" className="text-xs">
            <Check className="w-3 h-3 mr-1" /> Completed
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="text-xs">
            <Calendar className="w-3 h-3 mr-1" /> Join Session
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

const StudentDashboard = () => {
  const { user } = useAuth();
  const studentName = user?.studentProfile?.name || "Student";
  
  // Sample session data
  const upcomingSessions = [
    {
      id: "1",
      title: "Career Guidance Session",
      date: "Apr 16, 2025",
      time: "3:00 PM - 3:45 PM",
      mentor: "Taylor Smith",
      type: "Career Guidance"
    },
    {
      id: "2",
      title: "Technical Interview Prep",
      date: "Apr 18, 2025",
      time: "11:00 AM - 12:00 PM",
      mentor: "Jordan Lee",
      type: "Interview Prep"
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
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">You have no upcoming sessions</p>
                    <Button className="mt-4">Book a Session</Button>
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
              <Button className="w-full bg-mentor hover:bg-mentor/90">
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
              <Link to="/student/profile">
                <Button variant="outline" className="w-full">Complete Profile</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentDashboard;
