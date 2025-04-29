
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart } from "@/components/ui/chart";
import { Users, CalendarDays, FileEdit, IndianRupee, UserPlus, Building, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { formatIndianRupee } from "@/lib/utils";

const AdminDashboard = () => {
  // Sample stats data
  const stats = [
    { label: "Total Students", value: 145, icon: Users, color: "text-student" },
    { label: "Total Mentors", value: 32, icon: Building, color: "text-mentor" },
    { label: "Active Sessions", value: 67, icon: CalendarDays, color: "text-primary" },
    { label: "Feedback Forms", value: 12, icon: FileEdit, color: "text-amber-500" },
    { label: "New Users (Week)", value: 28, icon: UserPlus, color: "text-lime-500" },
    { label: "Session Types", value: 8, icon: BookOpen, color: "text-cyan-500" },
    { label: "Pending Payouts", value: formatIndianRupee(2480), icon: IndianRupee, color: "text-admin" },
  ];
  
  // Sample session data by type
  const sessionsByTypeData = {
    labels: ["Career Guidance", "Resume Review", "Interview Prep", "Technical Mentoring", "Job Search"],
    datasets: [
      {
        label: "Sessions",
        data: [65, 42, 38, 30, 25],
        backgroundColor: "rgba(124, 58, 237, 0.5)",
        borderColor: "rgba(124, 58, 237, 1)",
      },
    ],
  };
  
  // Sample sessions over time data
  const sessionsOverTimeData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Total Sessions",
        data: [42, 56, 78, 84, 98, 120],
        borderColor: "rgba(124, 58, 237, 1)",
        tension: 0.3,
        fill: false
      },
      {
        label: "Completed Sessions",
        data: [38, 52, 70, 75, 90, 110],
        borderColor: "rgba(34, 211, 238, 1)",
        tension: 0.3,
        fill: false
      },
    ],
  };

  return (
    <MainLayout title="Admin Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.slice(0, 4).map((stat, index) => (
          <Card key={index}>
            <CardContent className="flex items-center p-6">
              <div className={`p-2 rounded-full mr-4 ${stat.color === "text-primary" ? "bg-primary/10" : stat.color === "text-mentor" ? "bg-mentor/10" : stat.color === "text-student" ? "bg-student/10" : stat.color === "text-admin" ? "bg-admin/10" : "bg-primary/10"}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Sessions Over Time</CardTitle>
              <CardDescription>Overview of session trends over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <LineChart
                  data={sessionsOverTimeData}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Session Types</CardTitle>
              <CardDescription>Distribution of sessions by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <BarChart
                  data={sessionsByTypeData}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.slice(4).map((stat, index) => (
          <Card key={index}>
            <CardContent className="flex items-center p-6">
              <div className={`p-2 rounded-full mr-4 ${stat.color === "text-primary" ? "bg-primary/10" : stat.color === "text-mentor" ? "bg-mentor/10" : stat.color === "text-student" ? "bg-student/10" : stat.color === "text-admin" ? "bg-admin/10" : "bg-primary/10"}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/admin/mentors">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Mentors
                </Button>
              </Link>
              <Link to="/admin/students">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Students
                </Button>
              </Link>
              <Link to="/admin/session-types">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Session Types
                </Button>
              </Link>
              <Link to="/admin/feedback">
                <Button variant="outline" className="w-full justify-start">
                  <FileEdit className="mr-2 h-4 w-4" />
                  Feedback Forms
                </Button>
              </Link>
              <Link to="/admin/sessions">
                <Button variant="outline" className="w-full justify-start">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  All Sessions
                </Button>
              </Link>
              <Link to="/admin/payouts">
                <Button variant="outline" className="w-full justify-start">
                  <IndianRupee className="mr-2 h-4 w-4" />
                  Process Payouts
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "2 hours ago", event: "New mentor registration: Jordan Lee" },
                { time: "4 hours ago", event: "New session booked: Career Guidance with Alex Johnson" },
                { time: "Yesterday", event: "Feedback submitted for Resume Review session" },
                { time: "Yesterday", event: "New student registration: Casey Kim" },
                { time: "2 days ago", event: "Payout processed: ₹180 to Taylor Smith" }
              ].map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary mr-3"></div>
                  <div>
                    <p className="text-sm">{activity.event}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
