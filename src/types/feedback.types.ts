
export interface SessionFeedback {
  rating: number;
  notes: string;
  actionItems: string[];
  timestamp?: number;
  mentorId?: string;
  sessionId?: string;
}
