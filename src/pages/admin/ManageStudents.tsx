
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

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  targetRole: string;
  targetDomain: string;
  targetSectors: string[];
  status: "active" | "pending" | "inactive";
  sessions: number;
}

const ManageStudents = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([
    {
      id: "s1",
      name: "Alex Johnson",
      email: "alex@example.com",
      phone: "(555) 123-4567",
      targetRole: "Software Developer",
      targetDomain: "Web Development",
      targetSectors: ["Technology", "Healthcare"],
      status: "active",
      sessions: 8
    },
    {
      id: "s2",
      name: "Sarah Williams",
      email: "sarah@example.com",
      phone: "(555) 234-5678",
      targetRole: "Data Analyst",
      targetDomain: "Business Intelligence",
      targetSectors: ["Finance", "E-commerce"],
      status: "active",
      sessions: 4
    },
    {
      id: "s3",
      name: "James Miller",
      email: "james@example.com",
      phone: "(555) 345-6789",
      targetRole: "Product Manager",
      targetDomain: "SaaS Products",
      targetSectors: ["Technology", "Education"],
      status: "pending",
      sessions: 0
    },
    {
      id: "s4",
      name: "Emma Davis",
      email: "emma@example.com",
      phone: "(555) 456-7890",
      targetRole: "UX Designer",
      targetDomain: "Mobile Applications",
      targetSectors: ["Technology", "Media"],
      status: "inactive",
      sessions: 2
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [tab, setTab] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleStatusChange = (studentId: string, newStatus: "active" | "pending" | "inactive") => {
    setStudents(students.map(student => 
      student.id === studentId ? { ...student, status: newStatus } : student
    ));
    
    const student = students.find(s => s.id === studentId);
    
    toast({
      title: "Student Status Updated",
      description: `${student?.name}'s status is now ${newStatus}.`
    });
  };
  
  const handleDelete = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    setStudents(students.filter(student => student.id !== studentId));
    
    toast({
      title: "Student Removed",
      description: `${student?.name} has been removed from the platform.`
    });
  };
  
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.targetRole.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (tab === "all") {
      return matchesSearch;
    } else {
      return matchesSearch && student.status === tab;
    }
  });

  return (
    <MainLayout title="Manage Students">
      <Tabs defaultValue="all" value={tab} onValueChange={setTab}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <TabsList>
            <TabsTrigger value="all">All Students</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          <Button className="mt-4 md:mt-0" onClick={() => setDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>
              Manage students and their profiles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full md:w-96 mb-6">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <TabsContent value="all" className="m-0">
              <StudentTable 
                students={filteredStudents}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            </TabsContent>
            <TabsContent value="active" className="m-0">
              <StudentTable 
                students={filteredStudents}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            </TabsContent>
            <TabsContent value="pending" className="m-0">
              <StudentTable 
                students={filteredStudents}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            </TabsContent>
            <TabsContent value="inactive" className="m-0">
              <StudentTable 
                students={filteredStudents}
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
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Invite a new student to join the platform
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input id="email" placeholder="student@example.com" type="email" />
            </div>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <Input id="name" placeholder="Jane Doe" />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => {
                setDialogOpen(false);
                toast({
                  title: "Invitation Sent",
                  description: "The student will receive an email with instructions to complete their profile."
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

interface StudentTableProps {
  students: Student[];
  onStatusChange: (studentId: string, status: "active" | "pending" | "inactive") => void;
  onDelete: (studentId: string) => void;
}

const StudentTable = ({ students, onStatusChange, onDelete }: StudentTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Target Role</TableHead>
            <TableHead>Sessions</TableHead>
            <TableHead>Sectors</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length > 0 ? (
            students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="font-medium">{student.name}</div>
                  <div className="text-sm text-muted-foreground">{student.email}</div>
                </TableCell>
                <TableCell>
                  <div>{student.targetRole}</div>
                  <div className="text-sm text-muted-foreground">{student.targetDomain}</div>
                </TableCell>
                <TableCell>{student.sessions}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {student.targetSectors.map((sector, index) => (
                      <Badge key={index} variant="outline" className="bg-secondary/50">
                        {sector}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={student.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {student.status === "pending" && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onStatusChange(student.id, "active")}
                        title="Approve"
                      >
                        <UserCheck className="h-4 w-4 text-green-500" />
                      </Button>
                    )}
                    {student.status === "inactive" && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onStatusChange(student.id, "active")}
                        title="Reactivate"
                      >
                        <UserCheck className="h-4 w-4 text-green-500" />
                      </Button>
                    )}
                    {student.status === "active" && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onStatusChange(student.id, "inactive")}
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
                      onClick={() => onDelete(student.id)}
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
                No students found
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

export default ManageStudents;
