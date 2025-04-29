
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, Edit, Trash, UserCheck, UserX, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MentorSessionRatesDialog from "@/components/admin/mentors/MentorSessionRatesDialog";
import MentorAddDialog from "@/components/admin/mentors/MentorAddDialog";
import { sendMentorInviteEmail } from "@/services/emailService";
import { MentorInvite, MentorRate } from "@/types";

interface Mentor {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  company: string;
  status: "active" | "pending" | "inactive";
  sessions: number;
  rating: number;
}

const ManageMentors = () => {
  const { toast } = useToast();
  const [mentors, setMentors] = useState<Mentor[]>([
    {
      id: "m1",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "(555) 123-4567",
      jobTitle: "Senior Software Engineer",
      company: "Tech Solutions Inc.",
      status: "active",
      sessions: 24,
      rating: 4.8
    },
    {
      id: "m2",
      name: "David Wilson",
      email: "david@example.com",
      phone: "(555) 987-6543",
      jobTitle: "Product Manager",
      company: "Innovative Products Ltd.",
      status: "active",
      sessions: 18,
      rating: 4.6
    },
    {
      id: "m3",
      name: "Emily Johnson",
      email: "emily@example.com",
      phone: "(555) 234-5678",
      jobTitle: "UX Designer",
      company: "Creative Designs Co.",
      status: "pending",
      sessions: 0,
      rating: 0
    },
    {
      id: "m4",
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "(555) 876-5432",
      jobTitle: "Data Scientist",
      company: "Data Analytics Inc.",
      status: "inactive",
      sessions: 7,
      rating: 4.2
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [tab, setTab] = useState("all");
  const [mentorAddDialogOpen, setMentorAddDialogOpen] = useState(false);
  const [sessionRatesDialogOpen, setSessionRatesDialogOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [pendingMentor, setPendingMentor] = useState<{ id?: string; name: string; email: string } | null>(null);
  
  // Sample session types (in a real app, these would come from an API or store)
  const sessionTypes = [
    { id: "1", name: "Career Guidance", price: 1500, color: "#7c3aed" },
    { id: "2", name: "Technical Interview Prep", price: 2000, color: "#0ea5e9" },
    { id: "3", name: "Resume Review", price: 1000, color: "#f97316" },
    { id: "4", name: "Job Search Strategy", price: 1500, color: "#10b981" }
  ];
  
  // Sample mentor rates (in a real app, these would come from an API)
  const [mentorRates, setMentorRates] = useState<Record<string, MentorRate[]>>({
    m1: [
      { mentorId: "m1", sessionTypeId: "1", rate: 1500, isEligible: true },
      { mentorId: "m1", sessionTypeId: "2", rate: 2000, isEligible: true },
      { mentorId: "m1", sessionTypeId: "3", rate: 1000, isEligible: false },
      { mentorId: "m1", sessionTypeId: "4", rate: 1500, isEligible: true },
    ],
    m2: [
      { mentorId: "m2", sessionTypeId: "1", rate: 1700, isEligible: true },
      { mentorId: "m2", sessionTypeId: "2", rate: 2200, isEligible: true },
      { mentorId: "m2", sessionTypeId: "3", rate: 1200, isEligible: true },
      { mentorId: "m2", sessionTypeId: "4", rate: 1600, isEligible: false },
    ]
  });
  
  const handleStatusChange = (mentorId: string, newStatus: "active" | "pending" | "inactive") => {
    setMentors(mentors.map(mentor => 
      mentor.id === mentorId ? { ...mentor, status: newStatus } : mentor
    ));
    
    const mentor = mentors.find(m => m.id === mentorId);
    
    toast({
      title: "Mentor Status Updated",
      description: `${mentor?.name}'s status is now ${newStatus}.`
    });
  };
  
  const handleDelete = (mentorId: string) => {
    const mentor = mentors.find(m => m.id === mentorId);
    setMentors(mentors.filter(mentor => mentor.id !== mentorId));
    
    toast({
      title: "Mentor Removed",
      description: `${mentor?.name} has been removed from the platform.`
    });
  };
  
  const handleOpenSessionRatesDialog = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setSessionRatesDialogOpen(true);
  };
  
  const handleOpenPendingSessionRatesDialog = (mentorData: { id?: string; name: string; email: string }) => {
    setPendingMentor(mentorData);
    setSessionRatesDialogOpen(true);
  };
  
  const handleSaveSessionRates = (rates: MentorRate[]) => {
    // If we're adding a new mentor
    if (pendingMentor) {
      const newMentorId = `m${Date.now()}`;
      
      // Create the new mentor
      const newMentor: Mentor = {
        id: newMentorId,
        name: pendingMentor.name,
        email: pendingMentor.email,
        phone: "",
        jobTitle: "",
        company: "",
        status: "pending",
        sessions: 0,
        rating: 0
      };
      
      // Add the mentor to the list
      setMentors([...mentors, newMentor]);
      
      // Save the session rates
      const mentorRatesWithId = rates.map(rate => ({
        ...rate,
        mentorId: newMentorId
      }));
      
      setMentorRates({
        ...mentorRates,
        [newMentorId]: mentorRatesWithId
      });
      
      // Send invitation email
      sendMentorInviteEmail({
        email: pendingMentor.email,
        name: pendingMentor.name,
        sessionRates: mentorRatesWithId
      });
      
      setPendingMentor(null);
      
      toast({
        title: "Mentor Added",
        description: `${pendingMentor.name} has been added and will receive an invitation email.`
      });
    } 
    // If we're updating an existing mentor
    else if (selectedMentor) {
      setMentorRates(prev => ({
        ...prev,
        [selectedMentor.id]: rates
      }));
      
      toast({
        title: "Session rates updated",
        description: `Updated session rates for ${selectedMentor.name}`
      });
    }
    
    setSessionRatesDialogOpen(false);
    setSelectedMentor(null);
  };
  
  const handleMentorInvite = (mentorData: MentorInvite) => {
    const newMentorId = `m${Date.now()}`;
    
    // Create the new mentor
    const newMentor: Mentor = {
      id: newMentorId,
      name: mentorData.name,
      email: mentorData.email,
      phone: "",
      jobTitle: mentorData.jobTitle || "",
      company: mentorData.company || "",
      status: "pending",
      sessions: 0,
      rating: 0
    };
    
    // Add the mentor to the list
    setMentors([...mentors, newMentor]);
    
    // Send invitation email
    sendMentorInviteEmail(mentorData);
    
    toast({
      title: "Mentor Invited",
      description: `${mentorData.name} has been invited to join as a mentor.`
    });
  };
  
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = 
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (tab === "all") {
      return matchesSearch;
    } else {
      return matchesSearch && mentor.status === tab;
    }
  });

  return (
    <MainLayout title="Manage Mentors">
      <Tabs defaultValue="all" value={tab} onValueChange={setTab}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <TabsList>
            <TabsTrigger value="all">All Mentors</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          <Button className="mt-4 md:mt-0" onClick={() => setMentorAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Mentor
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Mentors</CardTitle>
            <CardDescription>
              Manage mentors and their profiles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full md:w-96 mb-6">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search mentors..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <TabsContent value="all" className="m-0">
              <MentorTable 
                mentors={filteredMentors}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onManageRates={handleOpenSessionRatesDialog}
              />
            </TabsContent>
            <TabsContent value="active" className="m-0">
              <MentorTable 
                mentors={filteredMentors}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onManageRates={handleOpenSessionRatesDialog}
              />
            </TabsContent>
            <TabsContent value="pending" className="m-0">
              <MentorTable 
                mentors={filteredMentors}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onManageRates={handleOpenSessionRatesDialog}
              />
            </TabsContent>
            <TabsContent value="inactive" className="m-0">
              <MentorTable 
                mentors={filteredMentors}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onManageRates={handleOpenSessionRatesDialog}
              />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
      
      <MentorAddDialog
        open={mentorAddDialogOpen}
        onOpenChange={setMentorAddDialogOpen}
        onMentorInvite={handleMentorInvite}
        sessionTypes={sessionTypes}
        onOpenSessionRates={handleOpenPendingSessionRatesDialog}
      />
      
      {(selectedMentor || pendingMentor) && (
        <MentorSessionRatesDialog
          open={sessionRatesDialogOpen}
          onOpenChange={setSessionRatesDialogOpen}
          mentorId={selectedMentor?.id || "new"}
          mentorName={selectedMentor?.name || pendingMentor?.name || ""}
          initialRates={selectedMentor ? mentorRates[selectedMentor.id] || [] : []}
          sessionTypes={sessionTypes}
          onSave={handleSaveSessionRates}
        />
      )}
    </MainLayout>
  );
};

interface MentorTableProps {
  mentors: Mentor[];
  onStatusChange: (mentorId: string, status: "active" | "pending" | "inactive") => void;
  onDelete: (mentorId: string) => void;
  onManageRates: (mentor: Mentor) => void;
}

const MentorTable = ({ mentors, onStatusChange, onDelete, onManageRates }: MentorTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Sessions</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mentors.length > 0 ? (
            mentors.map((mentor) => (
              <TableRow key={mentor.id}>
                <TableCell>
                  <div className="font-medium">{mentor.name}</div>
                  <div className="text-sm text-muted-foreground">{mentor.email}</div>
                </TableCell>
                <TableCell>
                  <div>{mentor.jobTitle}</div>
                  <div className="text-sm text-muted-foreground">{mentor.company}</div>
                </TableCell>
                <TableCell>{mentor.sessions}</TableCell>
                <TableCell>
                  {mentor.rating > 0 ? (
                    <div className="flex items-center">
                      {mentor.rating}
                      <span className="text-yellow-400 ml-1">★</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={mentor.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {mentor.status === "pending" && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onStatusChange(mentor.id, "active")}
                        title="Approve"
                      >
                        <UserCheck className="h-4 w-4 text-green-500" />
                      </Button>
                    )}
                    {mentor.status === "inactive" && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onStatusChange(mentor.id, "active")}
                        title="Reactivate"
                      >
                        <UserCheck className="h-4 w-4 text-green-500" />
                      </Button>
                    )}
                    {mentor.status === "active" && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onStatusChange(mentor.id, "inactive")}
                        title="Deactivate"
                      >
                        <UserX className="h-4 w-4 text-amber-500" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onManageRates(mentor)}
                      title="Manage Session Rates"
                    >
                      <Settings className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(mentor.id)}
                      title="Delete"
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No mentors found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const StatusBadge = ({ status }: { status: "active" | "pending" | "inactive" }) => {
  const variant = status === "active" 
    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    : status === "pending"
    ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  
  return (
    <Badge className={variant} variant="outline">
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default ManageMentors;
