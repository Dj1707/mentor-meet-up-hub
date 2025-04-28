
import { User } from "@/context/AuthContext";

export interface SessionType {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  color: string;
  resources?: SessionTypeResource[];
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
}
