
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SessionCard } from "@/components/mentor/sessions/SessionCard";
import { AddAvailabilityDialog } from "@/components/mentor/sessions/AddAvailabilityDialog";
import { StudentFeedbackDisplay } from "@/components/mentor/sessions/StudentFeedbackDisplay";
import { InvoiceTab } from "@/components/mentor/sessions/InvoiceTab";
import { SessionFeedback } from "@/types";
import { sessionTypes, getSessionTypeById } from "@/data/sessionTypes";
import { ViewSubmission } from "@/components/mentor/sessions/ViewSubmission";
import { useToast } from "@/components/ui/use-toast";

const MentorSessions = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showFilters, setShowFilters] = useState(false);
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState(false);
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [currentSessionType, setCurrentSessionType] = useState<any>(null);
  const [currentSubmission, setCurrentSubmission] = useState<any>(null);
  const [currentStudentName, setCurrentStudentName] = useState("");
  
  const [sessionsNeedingFeedback, setSessionsNeedingFeedback] = useState<string[]>([
    "3",
    "4"
  ]);

  const handleFeedbackSubmit = (sessionId: string, feedback: SessionFeedback) => {
    console.log("Submitting feedback for session", sessionId, feedback);
    
    toast({
      title: "Feedback submitted",
      description: "Your feedback has been sent to the student."
    });
    
    setSessionsNeedingFeedback(prev => prev.filter(id => id !== sessionId));
  };

  // Sample submissions for testing
  const studentSubmissions = {
    "1": {
      fileUrl: "https://example.com/resume.pdf",
      notes: "Here is my updated resume with recent projects."
    },
    "2": {
      linkUrl: "https://portfolio.example.com",
      notes: "Please review my latest UX work."
    }
  };

  const handleViewSubmission = (sessionId: string, studentName: string) => {
    const session = [...upcomingSessions, ...completedSessions].find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionType(session.sessionType);
      setCurrentSubmission(studentSubmissions[sessionId]);
      setCurrentStudentName(studentName);
      setSubmissionDialogOpen(true);
    }
  };

  const upcomingSessions = [
    {
      id: "1",
      title: "Resume Review 1:1",
      date: "Apr 16, 2025",
      time: "3:00 PM - 3:45 PM",
      student: "Alex Johnson",
      studentEmail: "alex.johnson@example.com",
      studentProfile: {
        resumeUrl: "https://example.com/resume/alex_johnson_resume.pdf",
        linkedIn: "https://linkedin.com/in/alexjohnson"
      },
      type: "Resume Review",
      status: "scheduled" as const,
      sessionTypeId: "6",
      sessionType: getSessionTypeById("6"),
      hasSubmission: true,
      sessionResources: [
        {
          id: "1",
          name: "Career Path Guide",
          url: "#",
          type: "pdf" as const
        },
        {
          id: "2",
          name: "Industry Insights",
          url: "#",
          type: "spreadsheet" as const
        }
      ]
    },
    {
      id: "2",
      title: "Portfolio Review 1:1",
      date: "Apr 18, 2025",
      time: "2:00 PM - 3:00 PM",
      student: "Jamie Rivera",
      studentEmail: "jamie.rivera@example.com",
      studentProfile: {
        resumeUrl: "",
        linkedIn: "https://linkedin.com/in/jamierivera"
      },
      type: "Portfolio Review",
      status: "scheduled" as const,
      sessionTypeId: "5",
      sessionType: getSessionTypeById("5"),
      hasSubmission: true
    }
  ];

  const completedSessions = [
    {
      id: "3",
      title: "Resume Review Session",
      date: "Apr 14, 2025",
      time: "11:00 AM - 11:30 AM",
      student: "Casey Kim",
      studentEmail: "casey.kim@example.com",
      studentProfile: {
        resumeUrl: "https://example.com/resume/casey_kim_resume.pdf",
        linkedIn: "https://linkedin.com/in/caseykim"
      },
      type: "Resume Review",
      status: "completed" as const,
      sessionTypeId: "6",
      sessionType: getSessionTypeById("6")
    },
    {
      id: "4",
      title: "Job Search Strategy",
      date: "Apr 13, 2025",
      time: "4:00 PM - 4:45 PM",
      student: "Morgan Smith",
      studentEmail: "morgan.smith@example.com",
      studentProfile: {
        resumeUrl: "https://example.com/resume/morgan_smith_resume.pdf",
        linkedIn: "https://linkedin.com/in/morgansmith"
      },
      type: "Behavioural 1:1",
      status: "completed" as const,
      sessionTypeId: "2",
      sessionType: getSessionTypeById("2")
    }
  ];

  return (
    <MainLayout title="Mentor Sessions">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Search sessions..."
            className="w-64"
          />
          <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={() => setAvailabilityDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Availability
        </Button>
      </div>

      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === "upcoming" && (
        <div className="grid grid-cols-1 gap-4">
          {upcomingSessions.map((session) => (
            <SessionCard 
              key={session.id}
              id={session.id}
              title={session.title}
              date={session.date}
              time={session.time}
              student={session.student}
              studentEmail={session.studentEmail}
              studentProfile={session.studentProfile}
              type={session.type}
              status={session.status}
              sessionTypeId={session.sessionTypeId}
              sessionType={session.sessionType}
              hasSubmission={session.hasSubmission}
              sessionResources={session.sessionResources}
              onViewSubmission={() => handleViewSubmission(session.id, session.student)}
            />
          ))}
        </div>
      )}

      {activeTab === "completed" && (
        <div className="grid grid-cols-1 gap-4">
          {completedSessions.map((session) => (
            <SessionCard 
              key={session.id}
              id={session.id}
              title={session.title}
              date={session.date}
              time={session.time}
              student={session.student}
              studentEmail={session.studentEmail}
              studentProfile={session.studentProfile}
              type={session.type}
              status={session.status}
              sessionTypeId={session.sessionTypeId}
              sessionType={session.sessionType}
              onFeedbackSubmit={sessionsNeedingFeedback.includes(session.id) ? handleFeedbackSubmit : undefined}
            />
          ))}
        </div>
      )}

      {activeTab === "feedback" && (
        <StudentFeedbackDisplay />
      )}

      {activeTab === "invoices" && (
        <InvoiceTab />
      )}

      <AddAvailabilityDialog 
        open={availabilityDialogOpen} 
        setOpen={setAvailabilityDialogOpen} 
      />

      {currentSessionType && (
        <ViewSubmission
          open={submissionDialogOpen}
          setOpen={setSubmissionDialogOpen}
          sessionType={currentSessionType}
          submission={currentSubmission}
          studentName={currentStudentName}
        />
      )}
    </MainLayout>
  );
};

export default MentorSessions;
