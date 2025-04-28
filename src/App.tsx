
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Dashboard pages
import StudentDashboard from "./pages/student/Dashboard";
import MentorDashboard from "./pages/mentor/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";

// Profile pages
import StudentProfile from "./pages/student/Profile";
import MentorProfile from "./pages/mentor/Profile";

// Session pages
import StudentSessions from "./pages/student/Sessions";
import MentorSessions from "./pages/mentor/Sessions";
import AdminSessions from "./pages/admin/Sessions";

// Student pages
import StudentMentors from "./pages/student/Mentors";

// Admin management pages
import ManageMentors from "./pages/admin/ManageMentors";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageSessionTypes from "./pages/admin/ManageSessionTypes";
import ManageFeedback from "./pages/admin/ManageFeedback";
import Analytics from "./pages/admin/Analytics";
import Payouts from "./pages/admin/Payouts";

const queryClient = new QueryClient();

const App = () => {
  // Check if user is logged in (simple check for demo)
  const isLoggedIn = localStorage.getItem("user") !== null;
  const getUserRole = () => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      return parsed.role;
    }
    return null;
  };
  
  const userRole = getUserRole();
  
  // Get the appropriate home route based on user role
  const getHomeRoute = () => {
    switch (userRole) {
      case "student":
        return "/student";
      case "mentor":
        return "/mentor";
      case "admin":
        return "/admin";
      default:
        return "/login";
    }
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SidebarProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Student Routes */}
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/student/profile" element={<StudentProfile />} />
                <Route path="/student/sessions" element={<StudentSessions />} />
                <Route path="/student/mentors" element={<StudentMentors />} />
                
                {/* Mentor Routes */}
                <Route path="/mentor" element={<MentorDashboard />} />
                <Route path="/mentor/profile" element={<MentorProfile />} />
                <Route path="/mentor/sessions" element={<MentorSessions />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/sessions" element={<AdminSessions />} />
                <Route path="/admin/mentors" element={<ManageMentors />} />
                <Route path="/admin/students" element={<ManageStudents />} />
                <Route path="/admin/session-types" element={<ManageSessionTypes />} />
                <Route path="/admin/feedback" element={<ManageFeedback />} />
                <Route path="/admin/analytics" element={<Analytics />} />
                <Route path="/admin/payouts" element={<Payouts />} />
                
                {/* Default route redirects to appropriate dashboard based on role */}
                <Route path="/" element={<Navigate replace to={getHomeRoute()} />} />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SidebarProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
