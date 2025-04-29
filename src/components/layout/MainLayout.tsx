
import React, { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { UserCircle, LogOut, LayoutDashboard, Calendar, Settings, Users, FileText, BarChart2, IndianRupee } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
  title: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [logoError, setLogoError] = useState(false);
  
  if (!user) {
    navigate("/login");
    return null;
  }
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  const handleLogoError = () => {
    console.error("Logo failed to load. Trying fallback...");
    setLogoError(true);
  };
  
  // Determine menu items based on user role
  const getMenuItems = () => {
    switch (user.role) {
      case "student":
        return [
          { title: "Dashboard", icon: LayoutDashboard, url: "/student" },
          { title: "My Sessions", icon: Calendar, url: "/student/sessions" },
          { title: "My Profile", icon: UserCircle, url: "/student/profile" },
        ];
      case "mentor":
        return [
          { title: "Dashboard", icon: LayoutDashboard, url: "/mentor" },
          { title: "My Sessions", icon: Calendar, url: "/mentor/sessions" },
          { title: "My Profile", icon: UserCircle, url: "/mentor/profile" },
        ];
      case "admin":
        return [
          { title: "Dashboard", icon: LayoutDashboard, url: "/admin" },
          { title: "Sessions", icon: Calendar, url: "/admin/sessions" },
          { title: "Mentors", icon: Users, url: "/admin/mentors" },
          { title: "Students", icon: Users, url: "/admin/students" },
          { title: "Session Types", icon: Settings, url: "/admin/session-types" },
          { title: "Feedback Forms", icon: FileText, url: "/admin/feedback" },
          { title: "Analytics", icon: BarChart2, url: "/admin/analytics" },
          { title: "Payouts", icon: IndianRupee, url: "/admin/payouts" },
        ];
      default:
        return [];
    }
  };

  // Get role color class
  const getRoleColorClass = () => {
    switch (user.role) {
      case "student": return "bg-student text-student-foreground";
      case "mentor": return "bg-mentor text-mentor-foreground";
      case "admin": return "bg-admin text-admin-foreground";
      default: return "bg-primary text-primary-foreground";
    }
  };

  const items = getMenuItems();
  const roleColorClass = getRoleColorClass();
  const displayName = user.studentProfile?.name || user.mentorProfile?.name || user.email;
  
  return (
    <div className="min-h-screen flex w-full">
      <Sidebar>
        <div className="p-4 border-b">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-32 h-16 flex justify-center items-center">
              {!logoError ? (
                <img 
                  src="/mesa-logo.png" 
                  alt="Mesa School of Business" 
                  className="max-h-16 w-auto object-contain"
                  onError={handleLogoError}
                  onLoad={() => console.log("Logo loaded successfully")}
                />
              ) : (
                <div className="text-lg font-semibold text-center">Mesa School</div>
              )}
            </div>
            <div className="text-sm font-medium">Welcome, {displayName}</div>
            <div className={`role-badge role-badge-${user.role}`}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </div>
          </div>
        </div>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <div className="mt-auto p-4 border-t">
          <Button variant="outline" className="w-full flex items-center" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </Sidebar>
      <main className="flex-1 p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">{title}</h1>
        </header>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
