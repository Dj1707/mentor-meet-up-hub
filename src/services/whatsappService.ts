
import { toast } from "@/hooks/use-toast";
import { Session, SessionReminder } from "@/types";
import { format } from "date-fns";

/**
 * Schedule a session reminder via WhatsApp
 */
export const scheduleSessionReminder = async (session: Session): Promise<boolean> => {
  try {
    // This is a simulation - in a real app, this would call a backend API
    console.log('Scheduling WhatsApp reminder for session:', session.id);
    
    const startTime = new Date(session.startTime);
    const sessionType = session.sessionType?.name || "Mentoring Session";
    
    // Calculate reminder time (24 hours before session)
    const reminderTime = new Date(startTime);
    reminderTime.setDate(reminderTime.getDate() - 1);
    
    // Format times for display
    const sessionDate = format(startTime, "MMMM d, yyyy");
    const sessionTimeStr = format(startTime, "h:mm a");
    
    // Build reminder message
    let message = `Reminder: You have a ${sessionType} scheduled for ${sessionDate} at ${sessionTimeStr}.`;
    
    // Add meeting link if available
    if (session.meetingLink) {
      message += `\n\nJoin the session: ${session.meetingLink}`;
    }
    
    // Add Google Calendar link
    if (session.calendarEventId) {
      message += `\n\nView in Calendar: https://calendar.google.com/calendar/event?eid=${session.calendarEventId}`;
    }
    
    // Log the WhatsApp message that would be sent
    console.log('WhatsApp message to be sent at', format(reminderTime, "PPpp"));
    console.log('Message:', message);
    
    return true;
  } catch (error) {
    console.error('Failed to schedule WhatsApp reminder:', error);
    return false;
  }
};

/**
 * Cancel all scheduled reminders for a session
 */
export const cancelSessionReminders = (sessionId: string): boolean => {
  // This is a simulation - in a real app, this would call a backend API
  console.log('Cancelling all WhatsApp reminders for session:', sessionId);
  
  // Simulate success
  return true;
};

/**
 * Send an immediate WhatsApp message with session details
 */
export const sendSessionDetailsWhatsApp = async (
  session: Session,
  recipientPhone: string
): Promise<boolean> => {
  try {
    // This is a simulation - in a real app, this would call a backend API
    console.log('Sending immediate WhatsApp notification to:', recipientPhone);
    
    const startTime = new Date(session.startTime);
    const sessionType = session.sessionType?.name || "Mentoring Session";
    
    // Format times for display
    const sessionDate = format(startTime, "MMMM d, yyyy");
    const sessionTimeStr = format(startTime, "h:mm a");
    
    // Build message
    let message = `Your ${sessionType} is scheduled for ${sessionDate} at ${sessionTimeStr}.`;
    
    // Add meeting link if available
    if (session.meetingLink) {
      message += `\n\nJoin the session: ${session.meetingLink}`;
    }
    
    // Add Google Calendar link
    if (session.calendarEventId) {
      message += `\n\nAdd to Calendar: https://calendar.google.com/calendar/event?eid=${session.calendarEventId}`;
    }
    
    // Log the WhatsApp message that would be sent
    console.log('Immediate WhatsApp message:');
    console.log('Message:', message);
    
    return true;
  } catch (error) {
    console.error('Failed to send immediate WhatsApp notification:', error);
    return false;
  }
};
