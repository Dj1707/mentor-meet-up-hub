
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText, MessageSquare } from "lucide-react";
import { SessionType, SessionFeedback } from "@/types";

interface SessionCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  student: string;
  studentEmail: string;
  studentProfile?: {
    resumeUrl?: string;
    linkedIn?: string;
  };
  type: string;
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  sessionTypeId: string;
  sessionType?: SessionType;
  hasSubmission?: boolean;
  sessionResources?: Array<{
    id: string;
    name: string;
    url: string;
    type: "pdf" | "spreadsheet" | "csv";
  }>;
  onFeedbackSubmit?: (sessionId: string, feedback: SessionFeedback) => void;
  onViewSubmission?: () => void;
}

export const SessionCard = ({
  id,
  title,
  date,
  time,
  student,
  studentEmail,
  studentProfile,
  type,
  status,
  sessionTypeId,
  sessionType,
  hasSubmission,
  sessionResources,
  onFeedbackSubmit,
  onViewSubmission
}: SessionCardProps) => {
  const needsSubmissionType = sessionType?.submissionType && sessionType.submissionType !== "none";
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">{title}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-1" /> {date}
              <span className="mx-2">•</span>
              <Clock className="w-4 h-4 mr-1" /> {time}
            </div>
          </div>
          <div className="flex space-x-2">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {type}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              status === "scheduled" ? "bg-blue-100 text-blue-800" :
              status === "completed" ? "bg-green-100 text-green-800" :
              status === "cancelled" ? "bg-red-100 text-red-800" :
              "bg-amber-100 text-amber-800"
            }`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p><strong>Student:</strong> {student}</p>
          <p className="text-sm text-muted-foreground">{studentEmail}</p>
        </div>
        
        {/* Student Submission */}
        {needsSubmissionType && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-blue-700 font-medium">
                  {hasSubmission ? 
                    "Student has submitted materials" : 
                    "Waiting for student submission"}
                </span>
              </div>
              {hasSubmission && onViewSubmission && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-blue-600"
                  onClick={onViewSubmission}
                >
                  View Submission
                </Button>
              )}
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {status === "completed" && onFeedbackSubmit && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => {
                // This is just a placeholder. In a real app, you would open a dialog to collect feedback
                const feedback: SessionFeedback = {
                  rating: 5,
                  notes: "Great session!", // Changed from 'comment' to 'notes'
                  actionItems: ["Review resume format", "Practice interview questions"], // Added actionItems
                  timestamp: Date.now(),
                };
                onFeedbackSubmit(id, feedback);
              }}
            >
              <MessageSquare className="w-4 h-4 mr-1" /> Provide Feedback
            </Button>
          )}
          
          {/* Add other buttons (Join Meeting, View Notes, etc.) as needed */}
        </div>
      </CardContent>
    </Card>
  );
};
