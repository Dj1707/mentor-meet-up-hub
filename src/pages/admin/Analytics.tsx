
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon, 
  Calendar, 
  Users, 
  Star, 
  TrendingUp 
} from "lucide-react";
import { AnalyticsData } from "@/types";
import { Recharts, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, Bar, Pie, Cell, ResponsiveContainer } from "recharts";

const Analytics = () => {
  // Sample analytics data
  const analyticsData: AnalyticsData = {
    totalSessions: 420,
    completedSessions: 320,
    cancelledSessions: 80,
    noShowSessions: 20,
    totalMentors: 32,
    totalStudents: 145,
    sessionsPerType: [
      { sessionTypeId: "Career Guidance", count: 140 },
      { sessionTypeId: "Resume Review", count: 120 },
      { sessionTypeId: "Technical Interview", count: 90 },
      { sessionTypeId: "Job Search", count: 70 }
    ],
    sessionsPerDay: [
      { date: "Jan", count: 42 },
      { date: "Feb", count: 56 },
      { date: "Mar", count: 78 },
      { date: "Apr", count: 84 },
      { date: "May", count: 98 },
      { date: "Jun", count: 120 }
    ]
  };
  
  // Colors for charts
  const COLORS = ["#7C3AED", "#0EA5E9", "#F97316", "#10B981", "#EF4444", "#F59E0B"];
  
  // Data for pie chart
  const sessionStatusData = [
    { name: "Completed", value: analyticsData.completedSessions, color: "#10B981" },
    { name: "Cancelled", value: analyticsData.cancelledSessions, color: "#F97316" },
    { name: "No-Show", value: analyticsData.noShowSessions, color: "#EF4444" }
  ];
  
  return (
    <MainLayout title="Analytics">
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">
            <TrendingUp className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <Calendar className="mr-2 h-4 w-4" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="feedback">
            <Star className="mr-2 h-4 w-4" />
            Feedback
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnalyticCard 
              title="Total Sessions" 
              value={analyticsData.totalSessions.toString()} 
              description="All-time sessions booked"
              icon={Calendar}
              trend="+24% from last month"
              trendUp={true}
            />
            <AnalyticCard 
              title="Completion Rate" 
              value={`${Math.round((analyticsData.completedSessions / analyticsData.totalSessions) * 100)}%`} 
              description="Sessions successfully completed"
              icon={BarChartIcon}
              trend="+5% from last month"
              trendUp={true}
            />
            <AnalyticCard 
              title="Total Mentors" 
              value={analyticsData.totalMentors.toString()} 
              description="Active mentors on platform"
              icon={Users}
              trend="+3 new this month"
              trendUp={true}
            />
            <AnalyticCard 
              title="Total Students" 
              value={analyticsData.totalStudents.toString()} 
              description="Registered students"
              icon={Users}
              trend="+18 new this month"
              trendUp={true}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sessions Over Time</CardTitle>
                <CardDescription>Monthly sessions over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <Recharts.LineChart
                      data={analyticsData.sessionsPerDay}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" name="Sessions" stroke="#7C3AED" activeDot={{ r: 8 }} />
                    </Recharts.LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sessions by Type</CardTitle>
                <CardDescription>Distribution of sessions by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <Recharts.BarChart
                      data={analyticsData.sessionsPerType}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="sessionTypeId" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Sessions" fill="#7C3AED" />
                    </Recharts.BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Session Status</CardTitle>
                <CardDescription>Breakdown of session outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <Recharts.PieChart>
                      <Pie
                        data={sessionStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={(entry) => `${entry.name}: ${entry.value}`}
                      >
                        {sessionStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </Recharts.PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Mentor Performance</CardTitle>
                <CardDescription>Top performing mentors by session count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <Recharts.BarChart
                      layout="vertical"
                      data={[
                        { name: "Jane Smith", sessions: 42, rating: 4.9 },
                        { name: "David Wilson", sessions: 38, rating: 4.8 },
                        { name: "Sarah Parker", sessions: 31, rating: 4.7 },
                        { name: "Michael Lee", sessions: 28, rating: 4.9 },
                        { name: "Emily Chen", sessions: 24, rating: 4.6 }
                      ]}
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sessions" name="Sessions" fill="#7C3AED" />
                      <Bar dataKey="rating" name="Rating" fill="#0EA5E9" />
                    </Recharts.BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Session Analytics</CardTitle>
              <CardDescription>
                Detailed analytics for sessions will be displayed here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <div className="text-center">
                  <LineChartIcon className="mx-auto h-12 w-12 opacity-30 mb-2" />
                  <p>Session analytics will be available soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Analytics</CardTitle>
              <CardDescription>
                User-related metrics and analytics will be displayed here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <div className="text-center">
                  <Users className="mx-auto h-12 w-12 opacity-30 mb-2" />
                  <p>User analytics will be available soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Analytics</CardTitle>
              <CardDescription>
                Analysis of feedback and ratings will be displayed here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <div className="text-center">
                  <Star className="mx-auto h-12 w-12 opacity-30 mb-2" />
                  <p>Feedback analytics will be available soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

interface AnalyticCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trend: string;
  trendUp: boolean;
}

const AnalyticCard = ({ title, value, description, icon: Icon, trend, trendUp }: AnalyticCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <div className="p-2 bg-primary/10 rounded-full">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className={`text-xs mt-3 ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
        </div>
      </CardContent>
    </Card>
  );
};

export default Analytics;
