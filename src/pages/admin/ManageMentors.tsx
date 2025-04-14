
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, Edit, Trash, UserCheck, UserX } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  
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
          <Button className="mt-4 md:mt-0" onClick={() => setDialogOpen(true)}>
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
              />
            </TabsContent>
            <TabsContent value="active" className="m-0">
              <MentorTable 
                mentors={filteredMentors}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            </TabsContent>
            <TabsContent value="pending" className="m-0">
              <MentorTable 
                mentors={filteredMentors}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            </TabsContent>
            <TabsContent value="inactive" className="m-0">
              <MentorTable 
                mentors={filteredMentors}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Mentor</DialogTitle>
            <DialogDescription>
              Invite a new mentor to join the platform
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input id="email" placeholder="mentor@example.com" type="email" />
            </div>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <Input id="name" placeholder="John Doe" />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => {
                setDialogOpen(false);
                toast({
                  title: "Invitation Sent",
                  description: "The mentor will receive an email with instructions to complete their profile."
                });
              }}>
                Send Invitation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

interface MentorTableProps {
  mentors: Mentor[];
  onStatusChange: (mentorId: string, status: "active" | "pending" | "inactive") => void;
  onDelete: (mentorId: string) => void;
}

const MentorTable = ({ mentors, onStatusChange, onDelete }: MentorTableProps) => {
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
