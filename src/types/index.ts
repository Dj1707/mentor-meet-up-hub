
// Re-export all types from their respective files
export * from './mentor.types';
export * from './student.types';
export * from './session.types';
// Explicitly re-export feedback types to resolve the SessionFeedback ambiguity
export { 
  type FeedbackTemplate, 
  type FeedbackQuestion,
  type SessionFeedbackSummary,
  // Rename the SessionFeedback from feedback.types to avoid conflict
  type SessionFeedback as FeedbackSessionFeedback 
} from './feedback.types';
export * from './analytics.types';
export * from './action.types';
export * from './payment.types';
export * from './reminder.types';
export * from './calendar.types';

// Export a SessionStatus type to fix the BookSessionDialog type error
export type SessionStatus = 
  | 'scheduled' 
  | 'completed' 
  | 'cancelled' 
  | 'no-show' 
  | 'in-progress';
