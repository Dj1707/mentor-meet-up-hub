
import React, { createContext, useContext, useState, useEffect } from "react";
import { MentorProfile, StudentProfile } from "@/types"; // Import types from central location
import userService from "@/services/userService"; // Import the user service

// User roles
export type UserRole = "student" | "mentor" | "admin";

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
      
      // Find user by email using userService instead of local mockUsers array
      const foundUser = userService.getUserByEmail(email);
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
      const existingUser = userService.getUserByEmail(email);
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
          email,
          // Default values for admin display
          rating: 0,
          sessionCount: 0,
          onboardingStatus: "pending"
        };
      } else if (role === "student") {
        newUser.studentProfile = {
          name,
          email,
          whatsappReminders: false,
          // We'll add this property for admin display
          targetSectors: []
        };
      }
      
      // Add user to userService
      userService.addUser(newUser);
      
      // Store user in local state and localStorage
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
    
    // Update in userService
    userService.updateUser(user.id, updatedUser);
    
    // Update local state and localStorage
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
    
    // Update in userService
    userService.updateUser(user.id, updatedUser);
    
    // Update local state and localStorage
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
