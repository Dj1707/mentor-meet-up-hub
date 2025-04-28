
import { MentorRate } from './mentor.types';

export interface Payout {
  id: string;
  mentorId: string;
  amount: number;
  status: "pending" | "processed" | "failed";
  sessionIds: string[];
  createdAt: Date;
  processedAt?: Date;
  rates?: MentorRate[];
  invoiceNumber?: string;
  invoiceDate?: Date;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
}

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
