
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
  options?: string[];
  required: boolean;
}

export interface FeedbackResponse {
  id: string;
  sessionId: string;
  templateId: string;
  responses: {
    questionId: string;
    answer: string | number;
  }[];
  submittedBy: string;
  submittedAt: Date;
}

export interface SessionFeedback {
  rating: number;
  notes: string;
  actionItems: string[];
}

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
