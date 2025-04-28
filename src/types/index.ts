import { User, UserRole } from "@/context/AuthContext";

// Session Types
export interface SessionTypeResource {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'csv' | 'spreadsheet';
}

// Session Status
export type SessionStatus = 
  | "scheduled" 
  | "completed" 
  | "cancelled" 
  | "no-show";

// Session
export interface Session {
  id: string;
  sessionTypeId: string;
  sessionType?: SessionType;
  mentorId: string;
  mentor?: User;
  studentId: string;
  student?: User;
  startTime: Date;
  endTime: Date;
  status: SessionStatus;
  notes?: string;
  feedbackId?: string;
  meetingLink?: string;
}

// Available Time Slot
export interface TimeSlot {
  id: string;
  mentorId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
  sessionTypeIds: string[]; // Which session types are available for this slot
  meetingLink?: string;
  recurring?: "none" | "daily" | "weekly" | "biweekly";
}

// Feedback Form Template
export interface FeedbackTemplate {
  id: string;
  name: string;
  description: string;
  sessionTypeIds: string[]; // Which session types this template is for
  questions: FeedbackQuestion[];
}

// Feedback Question
export interface FeedbackQuestion {
  id: string;
  text: string;
  type: "text" | "rating" | "multiple-choice";
  options?: string[]; // For multiple-choice questions
  required: boolean;
}

// Feedback Response
export interface FeedbackResponse {
  id: string;
  sessionId: string;
  templateId: string;
  responses: {
    questionId: string;
    answer: string | number;
  }[];
  submittedBy: string; // User ID
  submittedAt: Date;
}

// Action Items from Mentor to Student
export interface ActionItem {
  id: string;
  sessionId: string;
  text: string;
  isCompleted: boolean;
  createdAt: Date;
  completedAt?: Date;
}

// MentorRate - New type for mentor-specific session rates
export interface MentorRate {
  mentorId: string;
  sessionTypeId: string;
  rate: number;
}

// Payout - Update the existing interface
export interface Payout {
  id: string;
  mentorId: string;
  amount: number;
  status: "pending" | "processed" | "failed";
  sessionIds: string[];
  createdAt: Date;
  processedAt?: Date;
  rates?: MentorRate[]; // Add rates field to track the rates used for this payout
  invoiceNumber?: string;
  invoiceDate?: Date;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
}

// Invoice - New type for mentor invoices
export interface Invoice {
  id: string;
  mentorId: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  amount: number;
  status: "draft" | "submitted" | "paid" | "overdue";
  sessionIds: string[];
  notes?: string;
  createdAt: Date;
  paidAt?: Date;
}

// Analytics
export interface AnalyticsData {
  totalSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  noShowSessions: number;
  totalMentors: number;
  totalStudents: number;
  sessionsPerType: {
    sessionTypeId: string;
    count: number;
  }[];
  sessionsPerDay: {
    date: string;
    count: number;
  }[];
}

// Student Feedback for Mentors
export interface MentorFeedback {
  id: string;
  mentorId: string;
  studentId: string;
  sessionId: string;
  sessionTypeId: string;
  rating: number;
  comment: string;
  submittedAt: Date;
}

// Mentor Feedback for Students
export interface StudentFeedback {
  id: string;
  mentorId: string;
  studentId: string;
  sessionId: string;
  sessionTypeId: string;
  rating: number;
  notes: string;
  actionItems: string[];
  submittedAt: Date;
}

// MentorProfile - Add this interface to align with the way it's being used
export interface MentorProfile {
  name: string;
  email: string;
  phone?: string;
  linkedIn?: string;
  profilePicture?: string;
  jobTitle?: string;
  role?: string;
  company?: string;
  bio?: string;
  whatsappNotifications?: boolean;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  pastSectors?: string[];
}
