
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronDown, Filter, MoreHorizontal, Search } from "lucide-react";
import { Session, SessionStatus } from "@/types";

// Define an extended user type with name for the sample data
interface ExtendedUser {
  id: string;
  email: string;
  role: string;
  name: string;
}

// Define extended session type with the extended user
interface ExtendedSession extends Omit<Session, 'mentor' | 'student'> {
  mentor?: ExtendedUser;
  student?: ExtendedUser;
}

const AdminSessions = () => {
  const [sessions, setSessions] = useState<ExtendedSession[]>([
    {
      id: "s1",
      sessionTypeId: "1",
      sessionType: { id: "1", name: "Career Guidance", description: "", duration: 45, price: 30, color: "#7c3aed" },
      mentorId: "m1",
      mentor: { id: "m1", name: "Jane Smith", email: "jane@example.com", role: "mentor" },
      studentId: "st1",
      student: { id: "st1", name: "Alex Johnson", email: "alex@example.com", role: "student" },
      startTime: new Date(2025, 3, 18, 10, 0),
      endTime: new Date(2025, 3, 18, 10, 45),
      status: "scheduled"
    },
    {
      id: "s2",
      sessionTypeId: "2",
      sessionType: { id: "2", name: "Technical Interview Prep", description: "", duration: 60, price: 40, color: "#0ea5e9" },
      mentorId: "m2",
      mentor: { id: "m2", name: "Dave Miller", email: "dave@example.com", role: "mentor" },
      studentId: "st2",
      student: { id: "st2", name: "Sarah Williams", email: "sarah@example.com", role: "student" },
      startTime: new Date(2025, 3, 17, 14, 0),
      endTime: new Date(2025, 3, 17, 15, 0),
      status: "completed"
    },
    {
      id: "s3",
      sessionTypeId: "3",
      sessionType: { id: "3", name: "Resume Review", description: "", duration: 30, price: 25, color: "#f97316" },
      mentorId: "m1",
      mentor: { id: "m1", name: "Jane Smith", email: "jane@example.com", role: "mentor" },
      studentId: "st3",
      student: { id: "st3", name: "Michael Brown", email: "michael@example.com", role: "student" },
      startTime: new Date(2025, 3, 16, 11, 0),
      endTime: new Date(2025, 3, 16, 11, 30),
      status: "cancelled"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  
  const getStatusBadgeClass = (status: SessionStatus) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "no-show":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  const filteredSessions = sessions.filter(session => {
    const searchLower = searchTerm.toLowerCase();
    return (
      session.mentor?.name.toLowerCase().includes(searchLower) ||
      session.student?.name.toLowerCase().includes(searchLower) ||
      session.sessionType?.name.toLowerCase().includes(searchLower)
    );
  });

  return (
    <MainLayout title="All Sessions">
      <Card>
        <CardHeader>
          <CardTitle>Sessions Management</CardTitle>
          <CardDescription>
            View and manage all mentoring sessions across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sessions..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Calendar className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>All Sessions</DropdownMenuItem>
                  <DropdownMenuItem>Scheduled</DropdownMenuItem>
                  <DropdownMenuItem>Completed</DropdownMenuItem>
                  <DropdownMenuItem>Cancelled</DropdownMenuItem>
                  <DropdownMenuItem>No-shows</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Session Type</TableHead>
                  <TableHead>Mentor</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div className="font-medium">{formatDate(session.startTime)}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatTime(session.startTime)} - {formatTime(session.endTime)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {session.sessionType && (
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: session.sessionType.color }}
                          ></div>
                          {session.sessionType.name}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{session.mentor?.name}</TableCell>
                    <TableCell>{session.student?.name}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeClass(session.status)} variant="outline">
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Session</DropdownMenuItem>
                          <DropdownMenuItem>Cancel Session</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredSessions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No sessions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default AdminSessions;
