
import React, { createContext, useContext, useState, useEffect } from "react";

// User roles
export type UserRole = "student" | "mentor" | "admin";

// User profile interfaces
export interface MentorProfile {
  name: string;
  email: string;
  phone?: string;
  linkedIn?: string;
  profilePicture?: string;
  jobTitle?: string;
  role?: string;
}

export interface StudentProfile {
  name: string;
  email: string;
  phone?: string;
  linkedIn?: string;
  profilePicture?: string;
  targetRole?: string;
  targetDomain?: string;
  targetCTC?: string;
  targetSectors?: string[];
}

// Combined user interface
export interface User {
  id: string;
  role: UserRole;
  email: string;
  mentorProfile?: MentorProfile;
  studentProfile?: StudentProfile;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: UserRole, name: string) => Promise<void>;
  logout: () => void;
  updateMentorProfile: (profile: Partial<MentorProfile>) => Promise<void>;
  updateStudentProfile: (profile: Partial<StudentProfile>) => Promise<void>;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for development
const mockUsers: User[] = [
  {
    id: "student1",
    role: "student",
    email: "student@example.com",
    studentProfile: {
      name: "Alex Johnson",
      email: "student@example.com",
      phone: "555-123-4567",
      linkedIn: "linkedin.com/in/alexjohnson",
      profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      targetRole: "Software Engineer",
      targetDomain: "Web Development",
      targetCTC: "$90,000",
      targetSectors: ["Tech", "Startups", "Education"]
    }
  },
  {
    id: "mentor1",
    role: "mentor",
    email: "mentor@example.com",
    mentorProfile: {
      name: "Taylor Smith",
      email: "mentor@example.com",
      phone: "555-987-6543",
      linkedIn: "linkedin.com/in/taylorsmith",
      profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      jobTitle: "Senior Software Engineer",
      role: "Technical Mentor"
    }
  },
  {
    id: "admin1",
    role: "admin",
    email: "admin@example.com"
  }
];

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email
      const foundUser = mockUsers.find(u => u.email === email);
      if (!foundUser) {
        throw new Error("Invalid credentials");
      }
      
      // Store user in state and localStorage
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, role: UserRole, name: string) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        throw new Error("User already exists");
      }
      
      // Create new user
      const newUser: User = {
        id: `user${Date.now()}`,
        role,
        email
      };
      
      // Add profile based on role
      if (role === "mentor") {
        newUser.mentorProfile = {
          name,
          email
        };
      } else if (role === "student") {
        newUser.studentProfile = {
          name,
          email
        };
      }
      
      // Store user
      mockUsers.push(newUser);
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Update mentor profile
  const updateMentorProfile = async (profile: Partial<MentorProfile>) => {
    if (!user || user.role !== "mentor") {
      throw new Error("No mentor profile to update");
    }
    
    const updatedUser = {
      ...user,
      mentorProfile: {
        ...user.mentorProfile,
        ...profile
      }
    };
    
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return Promise.resolve();
  };

  // Update student profile
  const updateStudentProfile = async (profile: Partial<StudentProfile>) => {
    if (!user || user.role !== "student") {
      throw new Error("No student profile to update");
    }
    
    const updatedUser = {
      ...user,
      studentProfile: {
        ...user.studentProfile,
        ...profile
      }
    };
    
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return Promise.resolve();
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateMentorProfile,
    updateStudentProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
