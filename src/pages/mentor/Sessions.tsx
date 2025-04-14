
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const SessionCard = ({ 
  title, 
  date, 
  time, 
  student,
  type,
  status
}: { 
  title: string; 
  date: string; 
  time: string; 
  student: string;
  type: string;
  status: "scheduled" | "completed" | "cancelled";
}) => {
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
        <div className="flex space-x-2">
          {status === "scheduled" && (
            <>
              <Button variant="default" size="sm">Start Session</Button>
              <Button variant="outline" size="sm">Reschedule</Button>
              <Button variant="ghost" size="sm" className="text-destructive">Cancel</Button>
            </>
          )}
          {status === "completed" && (
            <Button variant="outline" size="sm">View Notes</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const AddAvailabilityDialog = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  // State for form fields would go here
  
  const handleSave = () => {
    // Handle save logic
    setOpen(false);
  };
  
  const sessionTypes = [
    { id: "1", name: "Career Guidance", duration: 45 },
    { id: "2", name: "Technical Interview Prep", duration: 60 },
    { id: "3", name: "Resume Review", duration: 30 },
    { id: "4", name: "Job Search Strategy", duration: 45 },
  ];
  
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
              {sessionTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <input id={`type-${type.id}`} type="checkbox" className="h-4 w-4" />
                  <Label htmlFor={`type-${type.id}`} className="text-sm cursor-pointer">
                    {type.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Recurring Schedule</Label>
            <Select>
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

const MentorSessions = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showFilters, setShowFilters] = useState(false);
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState(false);
  
  // Sample session data
  const upcomingSessions = [
    {
      id: "1",
      title: "Career Guidance Session",
      date: "Apr 16, 2025",
      time: "3:00 PM - 3:45 PM",
      student: "Alex Johnson",
      type: "Career Guidance",
      status: "scheduled" as const
    },
    {
      id: "2",
      title: "Technical Interview Prep",
      date: "Apr 18, 2025",
      time: "11:00 AM - 12:00 PM",
      student: "Jamie Rivera",
      type: "Interview Prep",
      status: "scheduled" as const
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
      status: "completed" as const
    },
    {
      id: "4",
      title: "Job Search Strategy",
      date: "Apr 3, 2025",
      time: "10:00 AM - 10:45 AM",
      student: "Alex Johnson",
      type: "Career Guidance",
      status: "cancelled" as const
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
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingSessions.length > 0 ? (
            upcomingSessions.map(session => (
              <SessionCard 
                key={session.id}
                title={session.title}
                date={session.date}
                time={session.time}
                student={session.student}
                type={session.type}
                status={session.status}
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
                title={session.title}
                date={session.date}
                time={session.time}
                student={session.student}
                type={session.type}
                status={session.status}
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
      </Tabs>
      
      <AddAvailabilityDialog open={availabilityDialogOpen} setOpen={setAvailabilityDialogOpen} />
    </MainLayout>
  );
};

export default MentorSessions;
