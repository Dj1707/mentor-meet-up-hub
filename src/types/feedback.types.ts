
export interface SessionFeedback {
  rating: number;
  notes: string;
  actionItems: string[];
  timestamp?: number;
  mentorId?: string;
  sessionId?: string;
}

export interface SessionFeedbackSummary {
  totalSessions: number;
  avgRating: number;
  sessionsThisMonth?: number;
  sessionTypeStats: {
    [key: string]: {
      count: number;
      avgRating: number;
    }
  }
}

export interface FeedbackTemplate {
  id: string;
  name: string;
  description: string;
  sessionTypeIds: string[];
  questions: FeedbackQuestion[];
}

export interface FeedbackQuestion {
  id: string;
  text: string;
  type: "text" | "rating" | "multiple-choice";
  required: boolean;
  options?: string[];
}
