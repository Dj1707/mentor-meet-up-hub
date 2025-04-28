import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Filter, Plus, FileText, File, FileSpreadsheet, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SessionStatus, SessionType, SessionTypeResource } from "@/types";

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

interface SessionCardProps { 
  id: string;
  title: string; 
  date: string; 
  time: string; 
  student: string;
  type: string;
  status: SessionStatus;
  sessionTypeId: string;
  sessionResources?: SessionTypeResource[];
  onFeedbackSubmit?: (sessionId: string, feedback: SessionFeedback) => void;
}

interface SessionFeedback {
  rating: number;
  notes: string;
  actionItems: string[];
}

const SessionCard = ({ 
  id,
  title, 
  date, 
  time, 
  student,
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
  
  const [feedback, setFeedback] = useState<SessionFeedback>({
    rating: 5,
    notes: "",
    actionItems: [""]
  });

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

          {status === "completed" && (
            <Button variant="outline" size="sm">View Notes</Button>
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

const AddAvailabilityDialog = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedSessionTypes, setSelectedSessionTypes] = useState<string[]>([]);
  const [recurringSchedule, setRecurringSchedule] = useState("none");
  
  const sessionTypes = [
    { id: "1", name: "Career Guidance", duration: 45 },
    { id: "2", name: "Technical Interview Prep", duration: 60 },
    { id: "3", name: "Resume Review", duration: 30 },
    { id: "4", name: "Job Search Strategy", duration: 45 },
  ];
  
  const toggleSessionType = (id: string) => {
    setSelectedSessionTypes(prev => 
      prev.includes(id) 
        ? prev.filter(type => type !== id) 
        : [...prev, id]
    );
  };
  
  const handleSave = () => {
    if (!selectedDate || !startTime || !endTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Availability Added",
      description: `Your availability for ${selectedDate} has been added successfully.`
    });
    
    setSelectedDate("");
    setStartTime("");
    setEndTime("");
    setSelectedSessionTypes([]);
    setRecurringSchedule("none");
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
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input 
              id="date" 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time *</Label>
              <Input 
                id="start-time" 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time *</Label>
              <Input 
                id="end-time" 
                type="time" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Session Types *</Label>
            <div className="grid grid-cols-2 gap-2">
              {sessionTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <input 
                    id={`type-${type.id}`} 
                    type="checkbox" 
                    className="h-4 w-4"
                    checked={selectedSessionTypes.includes(type.id)}
                    onChange={() => toggleSessionType(type.id)}
                  />
                  <Label htmlFor={`type-${type.id}`} className="text-sm cursor-pointer">
                    {type.name} ({type.duration} min)
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Recurring Schedule</Label>
            <Select value={recurringSchedule} onValueChange={setRecurringSchedule}>
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
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const StudentFeedbackDisplay = () => {
  const feedbackData = [
    {
      id: "1",
      sessionType: "Career Guidance",
      studentName: "Alex Johnson",
      rating: 5,
      comment: "Really helpful session! The mentor provided excellent guidance for my career transition."
    },
    {
      id: "2",
      sessionType: "Technical Interview",
      studentName: "Jamie Rivera",
      rating: 4,
      comment: "Good technical advice, but would have liked more practical examples."
    },
    {
      id: "3",
      sessionType: "Resume Review",
      studentName: "Casey Kim",
      rating: 5,
      comment: "The mentor gave me excellent feedback on my resume. I've already gotten more interview invitations!"
    }
  ];

  const feedbackByType = {
    "Career Guidance": { count: 10, avg: 4.8 },
    "Technical Interview": { count: 15, avg: 4.5 },
    "Resume Review": { count: 8, avg: 4.9 }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Overall Feedback Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {Object.entries(feedbackByType).map(([type, data]) => (
            <Card key={type}>
              <CardContent className="pt-6">
                <h4 className="font-medium">{type}</h4>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-lg ${i < Math.round(data.avg) ? "text-yellow-500" : "text-gray-300"}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {data.avg.toFixed(1)} ({data.count} sessions)
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Recent Feedback</h3>
        <div className="space-y-4">
          {feedbackData.map(feedback => (
            <Card key={feedback.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{feedback.studentName}</h4>
                    <p className="text-sm text-muted-foreground">{feedback.sessionType} Session</p>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-lg ${i < feedback.rating ? "text-yellow-500" : "text-gray-300"}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm">{feedback.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const InvoiceTab = () => {
  const { toast } = useToast();
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);

  const pendingSessions = [
    { 
      id: "1", 
      sessionType: "Career Guidance", 
      date: "Apr 16, 2025", 
      student: "Alex Johnson", 
      amount: 1200 
    },
    { 
      id: "2", 
      sessionType: "Technical Interview", 
      date: "Apr 18, 2025", 
      student: "Jamie Rivera", 
      amount: 1500 
    },
    { 
      id: "3", 
      sessionType: "Resume Review", 
      date: "Apr 20, 2025", 
      student: "Casey Kim", 
      amount: 800 
    },
  ];

  const previousInvoices = [
    { 
      id: "inv-2025-03", 
      date: "Mar 25, 2025", 
      sessions: 8, 
      amount: 9600, 
      status: "paid" 
    },
    { 
      id: "inv-2025-02", 
      date: "Feb 25, 2025", 
      sessions: 6, 
      amount: 7200, 
      status: "paid" 
    },
  ];

  const handleCreateInvoice = () => {
    toast({
      title: "Invoice Generated",
      description: "Your invoice has been submitted for processing."
    });
    setInvoiceDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Invoicing</h3>
        <Button onClick={() => setInvoiceDialogOpen(true)}>
          Generate Invoice
        </Button>
      </div>

      <div>
        <h4 className="text-base font-medium mb-3">Pending Sessions</h4>
        <div className="border rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingSessions.map(session => (
                <tr key={session.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{session.sessionType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{session.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{session.student}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">₹{session.amount}</td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">Total Pending</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  ₹{pendingSessions.reduce((sum, session) => sum + session.amount, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h4 className="text-base font-medium mb-3">Previous Invoices</h4>
        <div className="border rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {previousInvoices.map(invoice => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{invoice.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{invoice.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{invoice.sessions}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">₹{invoice.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Badge variant={invoice.status === "paid" ? "success" : "secondary"}>
                      {invoice.status === "paid" ? "Paid" : "Processing"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Button variant="ghost" size="sm" className="text-xs">
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Invoice</DialogTitle>
            <DialogDescription>
              Create an invoice for all completed sessions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border rounded-md p-4 bg-gray-50">
              <div className="grid grid-cols-2 gap-2">
                <p className="text-sm text-gray-500">Sessions:</p>
                <p className="text-sm font-medium text-right">{pendingSessions.length}</p>
                <p className="text-sm text-gray-500">Total Amount:</p>
                <p className="text-sm font-medium text-right">
                  ₹{pendingSessions.reduce((sum, session) => sum + session.amount, 0)}
                </p>
                <p className="text-sm text-gray-500">Invoice Date:</p>
                <p className="text-sm font-medium text-right">Apr 28, 2025</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice-notes">Invoice Notes (Optional)</Label>
              <Textarea 
                id="invoice-notes" 
                placeholder="Add any notes to be included in the invoice"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setInvoiceDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateInvoice}>
                Generate Invoice
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const MentorSessions = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showFilters, setShowFilters] = useState(false);
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const [sessionsNeedingFeedback, setSessionsNeedingFeedback] = useState<string[]>([
    "3",
    "4"
  ]);

  const handleFeedbackSubmit = (sessionId: string, feedback: SessionFeedback) => {
    console.log("Submitting feedback for session", sessionId, feedback);
    
    setSessionsNeedingFeedback(prev => prev.filter(id => id !== sessionId));
    
    toast({
      title: "Feedback Submitted",
      description: "Thank you for submitting your feedback. The session is now marked as complete."
    });
  };

  const upcomingSessions = [
    {
      id: "1",
      title: "Career Guidance Session",
      date: "Apr 16, 2025",
      time: "3:00 PM - 3:45 PM",
      student: "Alex Johnson",
      type: "Career Guidance",
      status: "scheduled" as SessionStatus,
      sessionTypeId: "1",
      resources: [
        { id: "r1", name: "Career Path Guide", url: "https://example.com/career-path.pdf", type: "pdf" as const },
        { id: "r2", name: "Industry Trends", url: "https://example.com/trends.csv", type: "csv" as const }
      ]
    },
    {
      id: "2",
      title: "Technical Interview Prep",
      date: "Apr 18, 2025",
      time: "11:00 AM - 12:00 PM",
      student: "Jamie Rivera",
      type: "Interview Prep",
      status: "scheduled" as SessionStatus,
      sessionTypeId: "2",
      resources: [
        { id: "r3", name: "Interview Questions", url: "https://example.com/questions.pdf", type: "pdf" as const }
      ]
    }
  ];

  const pastSessions = [
    {
      id: "3",
      title: "Resume Review Session",
      date: "Apr 10, 2025",
      time: "2:00 PM - 2:30 PM",
      student: "Casey Kim",
      type: "Resume Review",
      status: "completed" as SessionStatus,
      sessionTypeId: "3"
    },
    {
      id: "4",
      title: "Job Search Strategy",
      date: "Apr 3, 2025",
      time: "10:00 AM - 10:45 AM",
      student: "Alex Johnson",
      type: "Career Guidance",
      status: "no-show" as SessionStatus,
      sessionTypeId: "1"
    },
    {
      id: "5",
      title: "Technical Interview Practice",
      date: "Mar 28, 2025",
      time: "1:00 PM - 2:00 PM",
      student: "Morgan Lee",
      type: "Interview Prep",
      status: "completed" as SessionStatus,
      sessionTypeId: "2"
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
        <Button onClick={() => setAvailabilityDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Availability
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
                <Label htmlFor="student">Student</Label>
                <Select>
                  <SelectTrigger id="student">
                    <SelectValue placeholder="All students" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All students</SelectItem>
                    <SelectItem value="alex">Alex Johnson</SelectItem>
                    <SelectItem value="jamie">Jamie Rivera</SelectItem>
                    <SelectItem value="casey">Casey Kim</SelectItem>
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
          <TabsTrigger value="availability">My Availability</TabsTrigger>
          <TabsTrigger value="feedback">Student Feedback</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingSessions.length > 0 ? (
            upcomingSessions.map(session => (
              <SessionCard 
                key={session.id}
                id={session.id}
                title={session.title}
                date={session.date}
                time={session.time}
                student={session.student}
                type={session.type}
                status={session.status}
                sessionTypeId={session.sessionTypeId}
                sessionResources={session.resources}
              />
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">You have no upcoming sessions</p>
                <Button onClick={() => setAvailabilityDialogOpen(true)}>Add Availability</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {pastSessions.length > 0 ? (
            pastSessions.map(session => (
              <SessionCard 
                key={session.id}
                id={session.id}
                title={session.title}
                date={session.date}
                time={session.time}
                student={session.student}
                type={session.type}
                status={session.status}
                sessionTypeId={session.sessionTypeId}
                onFeedbackSubmit={sessionsNeedingFeedback.includes(session.id) ? handleFeedbackSubmit : undefined}
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
        
        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>My Available Time Slots</CardTitle>
              <CardDescription>
                Manage your availability for student bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button onClick={() => setAvailabilityDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Availability
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">April 16, 2025</h3>
                      <p className="text-sm text-muted-foreground">2:00 PM - 6:00 PM</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-xs bg-mentor-muted text-mentor px-2 py-1 rounded-full">Career Guidance</span>
                        <span className="text-xs bg-mentor-muted text-mentor px-2 py-1 rounded-full">Resume Review</span>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">April 17, 2025</h3>
                      <p className="text-sm text-muted-foreground">10:00 AM - 12:00 PM</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-xs bg-mentor-muted text-mentor px-2 py-1 rounded-full">Technical Interview Prep</span>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <StudentFeedbackDisplay />
        </TabsContent>

        <TabsContent value="invoices">
          <InvoiceTab />
        </TabsContent>
      </Tabs>
      
      <AddAvailabilityDialog open={availabilityDialogOpen} setOpen={setAvailabilityDialogOpen} />
    </MainLayout>
  );
};

export default MentorSessions;
