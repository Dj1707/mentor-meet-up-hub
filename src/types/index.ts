
import { User, UserRole } from "@/context/AuthContext";

// Session Types
export interface SessionType {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  color: string;
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

// Payout
export interface Payout {
  id: string;
  mentorId: string;
  amount: number;
  status: "pending" | "processed" | "failed";
  sessionIds: string[];
  createdAt: Date;
  processedAt?: Date;
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
