
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
import { sessionTypes } from "@/data/sessionTypes";
import { ViewSubmission } from "@/components/mentor/sessions/ViewSubmission";

const MentorSessions = () => {
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
      sessionType: sessionTypes.find(s => s.id === "6"),
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
      sessionType: sessionTypes.find(s => s.id === "5"),
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
      sessionType: sessionTypes.find(s => s.id === "6")
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
      status: "no-show" as const,
      sessionTypeId: "2",
      sessionType: sessionTypes.find(s => s.id === "2")
    }
  ];

  return (
    <MainLayout title="Sessions">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sessions</h1>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button 
              onClick={() => setAvailabilityDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Availability
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input type="date" placeholder="Filter by date" />
              </div>
              <div>
                <Input type="text" placeholder="Search by student name" />
              </div>
              <div>
                <Input type="text" placeholder="Filter by session type" />
              </div>
            </div>
          </Card>
        )}

        <Tabs defaultValue="upcoming" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="feedback">Student Feedback</TabsTrigger>
            <TabsTrigger value="invoice">Invoice</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingSessions.map(session => (
              <SessionCard
                key={session.id}
                {...session}
                onViewSubmission={
                  session.hasSubmission 
                    ? () => handleViewSubmission(session.id, session.student)
                    : undefined
                }
              />
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedSessions.map(session => (
              <SessionCard
                key={session.id}
                {...session}
                onFeedbackSubmit={
                  sessionsNeedingFeedback.includes(session.id)
                    ? handleFeedbackSubmit
                    : undefined
                }
              />
            ))}
          </TabsContent>

          <TabsContent value="feedback">
            <StudentFeedbackDisplay />
          </TabsContent>

          <TabsContent value="invoice">
            <InvoiceTab />
          </TabsContent>
        </Tabs>

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
      </div>
    </MainLayout>
  );
};

export default MentorSessions;
