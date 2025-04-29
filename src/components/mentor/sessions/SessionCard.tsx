
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock, File, FileSpreadsheet, FileText, Check, X, Plus, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SessionStatus, SessionTypeResource } from "@/types";
import { StudentResumeDialog } from "./StudentResumeDialog";

interface SessionFeedback {
  rating: number;
  notes: string;
  actionItems: string[];
}

interface SessionCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  student: string;
  studentEmail?: string;
  studentProfile?: {
    resumeUrl?: string;
  };
  type: string;
  status: SessionStatus;
  sessionTypeId: string;
  sessionResources?: SessionTypeResource[];
  onFeedbackSubmit?: (sessionId: string, feedback: SessionFeedback) => void;
}

const resourceTypeIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <FileText className="h-4 w-4 mr-2" />;
    case "csv":
      return <File className="h-4 w-4 mr-2" />;
    case "spreadsheet":
      return <FileSpreadsheet className="h-4 w-4 mr-2" />;
    default:
      return <File className="h-4 w-4 mr-2" />;
  }
};

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
  sessionResources = [],
  onFeedbackSubmit
}: SessionCardProps) => {
  const { toast } = useToast();
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [resourcesDialogOpen, setResourcesDialogOpen] = useState(false);
  const [confirmCancelDialog, setConfirmCancelDialog] = useState(false);
  const [rescheduleDialog, setRescheduleDialog] = useState(false);
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);

  const [feedback, setFeedback] = useState<SessionFeedback>({
    rating: 5,
    notes: "",
    actionItems: [""]
  });

  const hasResume = studentProfile?.resumeUrl && studentProfile.resumeUrl.trim() !== '';

  const addActionItem = () => {
    setFeedback(prev => ({
      ...prev,
      actionItems: [...prev.actionItems, ""]
    }));
  };

  const updateActionItem = (index: number, value: string) => {
    setFeedback(prev => {
      const newItems = [...prev.actionItems];
      newItems[index] = value;
      return {
        ...prev,
        actionItems: newItems
      };
    });
  };

  const removeActionItem = (index: number) => {
    setFeedback(prev => {
      const newItems = prev.actionItems.filter((_, i) => i !== index);
      return {
        ...prev,
        actionItems: newItems.length ? newItems : [""]
      };
    });
  };

  const handleFeedbackSubmit = () => {
    const cleanedFeedback = {
      ...feedback,
      actionItems: feedback.actionItems.filter(item => item.trim() !== "")
    };
    
    if (onFeedbackSubmit) {
      onFeedbackSubmit(id, cleanedFeedback);
    }
    
    setFeedbackDialogOpen(false);
    toast({
      title: "Feedback Submitted",
      description: "Your feedback has been recorded and sent to the student."
    });
  };

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
    case "no-show":
      statusClass = "bg-orange-100 text-orange-800";
      statusText = "No Show";
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
        <p className="text-sm mb-4">Student: {student}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {status === "scheduled" && (
            <>
              <Button variant="default" size="sm">Start Session</Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setResourcesDialogOpen(true)}
              >
                View Resources
              </Button>
              {hasResume && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setResumeDialogOpen(true)}
                >
                  <FileText className="h-4 w-4 mr-1" /> View Resume
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setRescheduleDialog(true)}>
                Reschedule
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-destructive"
                onClick={() => setConfirmCancelDialog(true)}
              >
                Cancel
              </Button>
            </>
          )}

          {(status === "completed" || status === "no-show") && (
            <>
              <Button variant="outline" size="sm">View Notes</Button>
              {hasResume && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setResumeDialogOpen(true)}
                >
                  <FileText className="h-4 w-4 mr-1" /> View Resume
                </Button>
              )}
            </>
          )}

          {(status === "completed" || status === "no-show") && !onFeedbackSubmit && (
            <Badge variant="secondary">Feedback Submitted</Badge>
          )}

          {(status === "completed" || status === "no-show") && onFeedbackSubmit && (
            <Button
              variant="default"
              size="sm"
              className="bg-mentor hover:bg-mentor/90"
              onClick={() => setFeedbackDialogOpen(true)}
            >
              <Check className="mr-1 h-4 w-4" />
              Submit Feedback
            </Button>
          )}
        </div>

        {/* Resources Dialog */}
        <Dialog open={resourcesDialogOpen} onOpenChange={setResourcesDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Session Resources</DialogTitle>
              <DialogDescription>
                Reference materials for this session type
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {sessionResources && sessionResources.length > 0 ? (
                <div className="space-y-2">
                  {sessionResources.map((resource, index) => (
                    <a 
                      key={index} 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center p-2 border rounded-md hover:bg-gray-50 transition-colors"
                    >
                      {resourceTypeIcon(resource.type)}
                      <span>{resource.name}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No resources available for this session type
                </p>
              )}
              <div className="mt-4 flex justify-end">
                <Button onClick={() => setResourcesDialogOpen(false)}>Close</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Resume Dialog */}
        {hasResume && (
          <StudentResumeDialog
            open={resumeDialogOpen}
            setOpen={setResumeDialogOpen}
            resumeUrl={studentProfile?.resumeUrl || ""}
            studentName={student}
          />
        )}

        {/* Feedback Dialog */}
        <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Session Feedback</DialogTitle>
              <DialogDescription>
                Provide feedback for your session with {student}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="rating">Overall Rating</Label>
                <Select 
                  value={feedback.rating.toString()}
                  onValueChange={(value) => setFeedback(prev => ({ ...prev, rating: parseInt(value) }))}
                >
                  <SelectTrigger id="rating">
                    <SelectValue placeholder="Select a rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 - Excellent</SelectItem>
                    <SelectItem value="4">4 - Good</SelectItem>
                    <SelectItem value="3">3 - Average</SelectItem>
                    <SelectItem value="2">2 - Below Average</SelectItem>
                    <SelectItem value="1">1 - Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Feedback Notes</Label>
                <Textarea
                  id="notes"
                  value={feedback.notes}
                  onChange={(e) => setFeedback(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Provide detailed feedback on the student's progress, strengths, and areas for improvement"
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Action Items for Student</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={addActionItem}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Item
                  </Button>
                </div>
                
                {feedback.actionItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updateActionItem(index, e.target.value)}
                      placeholder={`Action item ${index + 1}`}
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeActionItem(index)}
                      disabled={feedback.actionItems.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-mentor hover:bg-mentor/90"
                  onClick={handleFeedbackSubmit}
                >
                  Submit Feedback
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Reschedule Dialog */}
        <Dialog open={rescheduleDialog} onOpenChange={setRescheduleDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reschedule Session</DialogTitle>
              <DialogDescription>Select a new date and time for this session</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-date">New Date</Label>
                <Input id="new-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-time">New Time</Label>
                <Input id="new-time" type="time" />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setRescheduleDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  setRescheduleDialog(false);
                  toast({
                    title: "Session Rescheduled",
                    description: "The student has been notified of the change."
                  });
                }}>
                  Confirm Reschedule
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Cancel Confirmation Dialog */}
        <Dialog open={confirmCancelDialog} onOpenChange={setConfirmCancelDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Session</DialogTitle>
              <DialogDescription>Are you sure you want to cancel this session?</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p>This action cannot be undone and the student will be notified.</p>
              <div className="space-y-2">
                <Label htmlFor="cancel-reason">Reason for cancellation</Label>
                <Textarea 
                  id="cancel-reason"
                  className="min-h-[60px]"
                  placeholder="Please provide a reason for cancellation"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setConfirmCancelDialog(false)}>
                  Keep Session
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    setConfirmCancelDialog(false);
                    toast({
                      title: "Session Cancelled",
                      description: "The student has been notified of the cancellation."
                    });
                  }}
                >
                  Confirm Cancellation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
