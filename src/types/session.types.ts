
import { User } from "@/context/AuthContext";

export interface SessionType {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  color: string;
  submissionType?: SubmissionType;
  resources?: SessionTypeResource[];
}

export type SubmissionType = 'resume' | 'portfolio' | 'collateral' | 'link' | 'none';

export interface SessionSubmission {
  id: string;
  sessionId: string;
  studentId: string;
  submissionType: SubmissionType;
  fileUrl?: string;
  linkUrl?: string;
  notes?: string;
  timestamp: Date;
}

export interface SessionTypeResource {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'csv' | 'spreadsheet';
}

export type SessionStatus = 
  | "scheduled" 
  | "completed" 
  | "cancelled" 
  | "no-show";

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
  submission?: SessionSubmission;
  // New fields for Google Calendar integration
  calendarEventId?: string;
  meetProvider?: 'google' | 'other';
  conferenceData?: {
    conferenceId: string;
    meetingLink: string;
    accessCode?: string;
  }
}

export interface TimeSlot {
  id: string;
  mentorId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
  sessionTypeIds: string[];
  meetingLink?: string;
  recurring?: "none" | "daily" | "weekly" | "biweekly";
  // New fields for Google Calendar integration
  calendarEventId?: string;
}

export interface SessionFeedback {
  rating: number;
  notes: string;
  actionItems: string[];
  timestamp: number | Date;
}
