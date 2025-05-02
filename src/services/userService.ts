
import { User, UserRole } from "@/context/AuthContext";
import { MentorProfile } from "@/types";
import { StudentProfile } from "@/types";

// Define the structure for admin-displayed users
export interface AdminDisplayStudent {
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

export interface AdminDisplayMentor {
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

// Key for storing users in localStorage
const USERS_STORAGE_KEY = "mentorMeetUsers";

class UserService {
  // Initialize with mock data if no stored data exists
  private users: User[];

  constructor() {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    } else {
      // Initialize with default mock users
      this.users = [
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
            targetCTC: "₹12,00,000",
            targetSectors: ["Tech", "Startups", "Education"],
            pastJobRole: "Junior Developer",
            pastIndustry: "E-commerce",
            whatsappReminders: true
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
            company: "Google",
            role: "Technical Mentor",
            bio: "Experienced software engineer with 10+ years in the industry. Passionate about helping new developers grow their skills and career.",
            panNumber: "ABCPK1234Z",
            bankDetails: {
              accountName: "Taylor Smith",
              accountNumber: "1234567890",
              ifscCode: "BANK0001234",
              bankName: "State Bank"
            },
            address: {
              street: "123 Tech Park",
              city: "Bangalore",
              state: "Karnataka",
              zipCode: "560001",
              country: "India"
            },
            pastSectors: ["Technology", "Education", "Finance"],
            sessionCount: 24,
            rating: 4.8,
            onboardingStatus: "active",
            expertise: ["Career Guidance", "Technical Interviews", "Resume Review"],
            sessionTypeIds: ["1", "2", "6"],
            availability: [
              {
                date: "2025-05-10",
                slots: ["10:00 AM", "2:00 PM", "4:00 PM"]
              },
              {
                date: "2025-05-11", 
                slots: ["11:00 AM", "3:00 PM"]
              }
            ]
          }
        },
        {
          id: "mentor2",
          role: "mentor",
          email: "alex@example.com",
          mentorProfile: {
            name: "Alex Johnson",
            email: "alex@example.com",
            phone: "555-456-7890",
            linkedIn: "linkedin.com/in/alexjohnson",
            profilePicture: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
            jobTitle: "Product Manager",
            company: "Amazon",
            role: "Product Mentor",
            bio: "Experienced PM with background in both startups and large tech companies. Specialized in product strategy and user research.",
            pastSectors: ["Technology", "Retail", "Healthcare"],
            sessionCount: 87,
            rating: 4.7,
            onboardingStatus: "active",
            expertise: ["Product Management", "Career Transition", "Interview Prep"],
            sessionTypeIds: ["2", "4", "8"],
            availability: [
              {
                date: "2025-05-15",
                slots: ["9:00 AM", "1:00 PM", "5:00 PM"]
              },
              {
                date: "2025-05-16", 
                slots: ["10:00 AM", "2:00 PM"]
              }
            ]
          }
        },
        {
          id: "mentor3",
          role: "mentor",
          email: "priya@example.com",
          mentorProfile: {
            name: "Priya Singh",
            email: "priya@example.com",
            phone: "555-789-0123",
            linkedIn: "linkedin.com/in/priyasingh",
            profilePicture: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
            jobTitle: "Engineering Director",
            company: "Microsoft",
            role: "Leadership Mentor",
            bio: "15+ years in tech leadership. Specialized in helping engineers advance their careers and develop leadership skills.",
            pastSectors: ["Technology", "Manufacturing", "Consulting"],
            sessionCount: 156,
            rating: 4.8,
            onboardingStatus: "active",
            expertise: ["Leadership Development", "Career Growth", "Technical Management"],
            sessionTypeIds: ["4", "5", "12"],
            availability: [
              {
                date: "2025-05-12",
                slots: ["11:00 AM", "3:00 PM", "5:00 PM"]
              },
              {
                date: "2025-05-13", 
                slots: ["9:00 AM", "1:00 PM"]
              }
            ]
          }
        },
        {
          id: "admin1",
          role: "admin",
          email: "admin@example.com"
        }
      ];
      
      this.saveToStorage();
    }
  }

  // Save current users array to localStorage
  private saveToStorage(): void {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
  }

  // Get all users
  getAllUsers(): User[] {
    return [...this.users];
  }

  // Get user by ID
  getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  // Get user by email
  getUserByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }

  // Add a new user
  addUser(user: User): User {
    this.users.push(user);
    this.saveToStorage();
    return user;
  }

  // Update an existing user
  updateUser(id: string, userData: Partial<User>): User | undefined {
    const userIndex = this.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) return undefined;
    
    this.users[userIndex] = { ...this.users[userIndex], ...userData };
    this.saveToStorage();
    
    return this.users[userIndex];
  }

  // Delete a user
  deleteUser(id: string): boolean {
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user.id !== id);
    
    if (this.users.length !== initialLength) {
      this.saveToStorage();
      return true;
    }
    
    return false;
  }

  // Get all students formatted for admin display
  getStudentsForAdmin(): AdminDisplayStudent[] {
    return this.users
      .filter(user => user.role === "student" && user.studentProfile)
      .map(user => ({
        id: user.id,
        name: user.studentProfile?.name || "",
        email: user.studentProfile?.email || "",
        phone: user.studentProfile?.phone || "",
        targetRole: user.studentProfile?.targetRole || "",
        targetDomain: user.studentProfile?.targetDomain || "",
        targetSectors: user.studentProfile?.targetSectors || [],
        // Default to pending for new registrations
        status: (user.studentProfile as any)?.status || "pending",
        // Start with 0 sessions for new users
        sessions: (user.studentProfile as any)?.sessions || 0
      }));
  }

  // Get all mentors formatted for admin display
  getMentorsForAdmin(): AdminDisplayMentor[] {
    return this.users
      .filter(user => user.role === "mentor" && user.mentorProfile)
      .map(user => ({
        id: user.id,
        name: user.mentorProfile?.name || "",
        email: user.mentorProfile?.email || "",
        phone: user.mentorProfile?.phone || "",
        jobTitle: user.mentorProfile?.jobTitle || "",
        company: user.mentorProfile?.company || "",
        // Map onboardingStatus to status, defaulting to "pending"
        status: (user.mentorProfile?.onboardingStatus as any) || "pending",
        // Default to 0 for new users
        sessions: user.mentorProfile?.sessionCount || 0,
        // Default to 0 for new users
        rating: user.mentorProfile?.rating || 0
      }));
  }

  // Update student status
  updateStudentStatus(studentId: string, status: "active" | "pending" | "inactive"): boolean {
    const userIndex = this.users.findIndex(user => user.id === studentId && user.role === "student");
    
    if (userIndex === -1) return false;
    
    // Update the status in the studentProfile
    const updatedProfile = {
      ...this.users[userIndex].studentProfile,
      status
    };
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      studentProfile: updatedProfile as StudentProfile
    };
    
    this.saveToStorage();
    return true;
  }

  // Update mentor status
  updateMentorStatus(mentorId: string, status: "active" | "pending" | "inactive"): boolean {
    const userIndex = this.users.findIndex(user => user.id === mentorId && user.role === "mentor");
    
    if (userIndex === -1) return false;
    
    // Update the onboardingStatus in the mentorProfile
    const updatedProfile = {
      ...this.users[userIndex].mentorProfile,
      onboardingStatus: status
    };
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      mentorProfile: updatedProfile as MentorProfile
    };
    
    this.saveToStorage();
    return true;
  }
}

// Create and export a singleton instance
export const userService = new UserService();

export default userService;
