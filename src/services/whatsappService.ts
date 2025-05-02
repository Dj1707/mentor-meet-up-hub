
import { toast } from "@/hooks/use-toast";
import { Session, SessionReminder, WhatsAppConfig } from "@/types";
import { format } from "date-fns";
import { sendMessage } from "@/utils/whatsappApi";
import { formatTemplateMessage, getGupshupTemplateId } from "@/utils/whatsappTemplates";

// In-memory storage for WhatsApp configuration (in a real app, this would be in a database)
let whatsAppConfig: WhatsAppConfig = {
  enabled: true,
  apiKey: "M5XfeLmmEQSuCg3kWIHFoIKAZhOpHEn0nhH2h3spal4",
  lastUpdated: new Date()
};

// In-memory storage for session reminders (in a real app, this would be in a database)
const sessionReminders: SessionReminder[] = [
  {
    sessionId: "session-123",
    recipientType: "student",
    recipientId: "student-456",
    scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    status: "scheduled"
  },
  {
    sessionId: "session-456",
    recipientType: "mentor",
    recipientId: "mentor-789",
    scheduledTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: "sent"
  },
  {
    sessionId: "session-789",
    recipientType: "student",
    recipientId: "student-123",
    scheduledTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    status: "failed",
    errorMessage: "Invalid phone number format"
  }
];

/**
 * Get the current WhatsApp configuration
 */
export const getWhatsappConfig = (): WhatsAppConfig => {
  return whatsAppConfig;
};

/**
 * Update the WhatsApp configuration
 */
export const updateWhatsappConfig = (config: Partial<WhatsAppConfig>): WhatsAppConfig => {
  whatsAppConfig = {
    ...whatsAppConfig,
    ...config,
    lastUpdated: new Date()
  };
  return whatsAppConfig;
};

/**
 * Get all session reminders (for admin dashboard)
 */
export const getSessionReminders = (): SessionReminder[] => {
  return [...sessionReminders];
};

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

    // Add to our in-memory reminder storage
    sessionReminders.push({
      sessionId: session.id,
      recipientType: "student",
      recipientId: session.studentId,
      scheduledTime: reminderTime,
      status: "scheduled"
    });

    // If the mentor exists, also schedule a reminder for them
    if (session.mentorId) {
      sessionReminders.push({
        sessionId: session.id,
        recipientType: "mentor",
        recipientId: session.mentorId,
        scheduledTime: reminderTime,
        status: "scheduled"
      });
    }
    
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
  
  // Filter out reminders for this session from our in-memory storage
  const index = sessionReminders.findIndex(reminder => reminder.sessionId === sessionId);
  if (index !== -1) {
    sessionReminders.splice(index, 1);
  }
  
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

/**
 * Send a dummy WhatsApp message for testing purposes
 */
export const sendDummyWhatsAppMessage = async (
  phoneNumber: string,
  templateValues: Record<string, string>,
  recipientType: "STUDENT" | "MENTOR"
): Promise<boolean> => {
  try {
    if (!whatsAppConfig.enabled || !whatsAppConfig.apiKey) {
      throw new Error("WhatsApp service is not configured or disabled");
    }

    console.log(`Sending dummy WhatsApp message to ${phoneNumber}`);
    
    // Get the template ID for the session reminder
    const templateId = getGupshupTemplateId("SESSION_REMINDER", recipientType);
    
    // Format the phone number (remove leading + if present)
    const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber.substring(1) : phoneNumber;
    
    // Send the message through the API utility
    const response = await sendMessage({
      phone: formattedPhone,
      templateId: templateId,
      templateParams: Object.values(templateValues),
      apiKey: whatsAppConfig.apiKey
    });
    
    if (!response.success) {
      throw new Error(response.error || "Failed to send WhatsApp message");
    }
    
    // Add to our in-memory reminder log
    sessionReminders.push({
      sessionId: "test-session",
      recipientType: recipientType === "STUDENT" ? "student" : "mentor",
      recipientId: "test-user",
      scheduledTime: new Date(),
      status: "sent"
    });
    
    return true;
  } catch (error) {
    console.error("Failed to send dummy WhatsApp message:", error);
    
    // Add failed message to logs
    sessionReminders.push({
      sessionId: "test-session",
      recipientType: recipientType === "STUDENT" ? "student" : "mentor",
      recipientId: "test-user",
      scheduledTime: new Date(),
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "Unknown error"
    });
    
    return false;
  }
};
