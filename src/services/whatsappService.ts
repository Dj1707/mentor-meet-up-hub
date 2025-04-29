
import { Session, WhatsAppConfig, SessionReminder } from "@/types";
import { formatDate, formatTime } from "@/lib/dateUtils";
import { getGupshupTemplateId } from "@/utils/whatsappTemplates";

// Storage keys for WhatsApp configuration
const WHATSAPP_CONFIG_KEY = "mesa_whatsapp_config";

// Get WhatsApp configuration from storage
export const getWhatsappConfig = (): WhatsAppConfig => {
  const storedConfig = localStorage.getItem(WHATSAPP_CONFIG_KEY);
  if (storedConfig) {
    try {
      return JSON.parse(storedConfig) as WhatsAppConfig;
    } catch (error) {
      console.error("Error parsing WhatsApp config:", error);
    }
  }
  
  // Return default config if none exists
  return {
    enabled: true,
    apiKey: "",
    lastUpdated: new Date()
  };
};

// Update Gupshup API key and settings
export const updateWhatsappConfig = (config: Partial<WhatsAppConfig>): void => {
  // Get current config and merge with updates
  const currentConfig = getWhatsappConfig();
  const updatedConfig: WhatsAppConfig = {
    ...currentConfig,
    ...config,
    lastUpdated: new Date()
  };
  
  // Store the updated config
  localStorage.setItem(WHATSAPP_CONFIG_KEY, JSON.stringify(updatedConfig));
  console.log("Updated WhatsApp configuration:", updatedConfig);
};

// Update just the API key (maintaining previous behavior)
export const updateGupshupApiKey = (apiKey: string): void => {
  updateWhatsappConfig({ apiKey });
};

// Check if WhatsApp reminders are enabled
export const isWhatsappEnabled = (): boolean => {
  const config = getWhatsappConfig();
  return config.enabled && !!config.apiKey;
};

// Store for tracking reminders
const sessionReminders: SessionReminder[] = [];

/**
 * Format a session for WhatsApp reminders
 */
export const formatSessionForReminder = (
  session: Session,
  recipientType: "student" | "mentor"
): {
  recipientName: string;
  recipientPhone?: string;
  sessionName: string;
  otherPartyName: string;
  formattedDate: string;
  formattedTime: string;
} => {
  const student = session.student;
  const mentor = session.mentor;
  const sessionType = session.sessionType;
  
  if (!student || !mentor || !sessionType) {
    throw new Error("Session data is incomplete");
  }
  
  // Format the date and time
  const formattedDate = formatDate(session.startTime);
  const formattedTime = formatTime(session.startTime);
  
  // Get recipient information based on type
  const recipientName = recipientType === "student" 
    ? student.studentProfile?.name || student.email 
    : mentor.mentorProfile?.name || mentor.email;
  
  // Get recipient phone number
  const recipientPhone = recipientType === "student" 
    ? student.studentProfile?.phone 
    : mentor.mentorProfile?.phone;
  
  // Get other party name
  const otherPartyName = recipientType === "student" 
    ? mentor.mentorProfile?.name || mentor.email 
    : student.studentProfile?.name || student.email;
  
  return {
    recipientName,
    recipientPhone,
    sessionName: sessionType.name,
    otherPartyName,
    formattedDate,
    formattedTime
  };
};

/**
 * Send a WhatsApp message using the Gupshup API
 */
const sendWhatsAppMessage = async (
  phoneNumber: string,
  templateData: { [key: string]: string },
  recipientType: "STUDENT" | "MENTOR"
): Promise<boolean> => {
  try {
    // Check if WhatsApp reminders are enabled
    if (!isWhatsappEnabled()) {
      console.log("WhatsApp reminders are disabled");
      return false;
    }
    
    // Get the API key from storage
    const config = getWhatsappConfig();
    const GUPSHUP_API_KEY = config.apiKey;
    const GUPSHUP_API_URL = "https://api.gupshup.io/sm/api/v1/msg";
    
    // Ensure phone number is in proper format (includes country code)
    const formattedPhone = phoneNumber.startsWith("+") 
      ? phoneNumber.substring(1) 
      : phoneNumber;
    
    // Get the correct template ID based on recipient type
    const templateId = getGupshupTemplateId("SESSION_REMINDER", recipientType);
    
    // Construct the payload for Gupshup API
    const payload = {
      channel: "whatsapp",
      source: "917834811114", // Replace with your WhatsApp business number
      destination: formattedPhone,
      "src.name": "Mesa School",
      message: {
        type: "template",
        template: {
          id: templateId,
          params: Object.values(templateData) // This should be an array of values in correct order
        }
      }
    };

    console.log("Sending WhatsApp message:", payload);
    
    // Send the request to Gupshup API
    const response = await fetch(GUPSHUP_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": GUPSHUP_API_KEY
      },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("Failed to send WhatsApp message:", data);
      return false;
    }
    
    console.log("WhatsApp message sent successfully:", data);
    return true;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return false;
  }
};

/**
 * Send a session reminder to a student
 */
export const sendStudentReminder = async (session: Session): Promise<boolean> => {
  try {
    // Check if student has opted-in for WhatsApp reminders
    if (!session.student?.studentProfile?.whatsappReminders) {
      console.log(`Student ${session.studentId} has not opted-in for WhatsApp reminders`);
      return false;
    }

    // Get the student's phone number
    const studentPhone = session.student?.studentProfile?.phone;
    if (!studentPhone) {
      console.error(`Student ${session.studentId} does not have a phone number`);
      return false;
    }

    // Format session data for reminder
    const {
      recipientName,
      sessionName,
      otherPartyName,
      formattedDate,
      formattedTime
    } = formatSessionForReminder(session, "student");

    // Prepare template data in the exact order expected by Gupshup
    const templateData = {
      "1": recipientName, // Student Name
      "2": sessionName,   // Session Name
      "3": otherPartyName, // Mentor Name
      "4": formattedDate, // Date (format: 29th April 2025)
      "5": formattedTime  // Time (format: 5:00 PM)
    };

    // Send the WhatsApp message with STUDENT recipient type
    return await sendWhatsAppMessage(studentPhone, templateData, "STUDENT");
  } catch (error) {
    console.error("Error sending student reminder:", error);
    return false;
  }
};

/**
 * Send a session reminder to a mentor
 */
export const sendMentorReminder = async (session: Session): Promise<boolean> => {
  try {
    // Check if mentor has opted-in for WhatsApp reminders (if applicable)
    const mentorPhone = session.mentor?.mentorProfile?.phone;
    if (!mentorPhone) {
      console.error(`Mentor ${session.mentorId} does not have a phone number`);
      return false;
    }

    // Format session data for reminder
    const {
      recipientName,
      sessionName,
      otherPartyName,
      formattedDate,
      formattedTime
    } = formatSessionForReminder(session, "mentor");

    // Prepare template data in the exact order expected by Gupshup
    const templateData = {
      "1": recipientName, // Mentor Name
      "2": sessionName,   // Session Name
      "3": otherPartyName, // Student Name
      "4": formattedDate, // Date (format: 29th April 2025)
      "5": formattedTime  // Time (format: 5:00 PM)
    };

    // Send the WhatsApp message with MENTOR recipient type
    return await sendWhatsAppMessage(mentorPhone, templateData, "MENTOR");
  } catch (error) {
    console.error("Error sending mentor reminder:", error);
    return false;
  }
};

/**
 * Schedule a reminder for a session
 */
export const scheduleSessionReminder = (session: Session): void => {
  try {
    // Check if WhatsApp reminders are enabled
    if (!isWhatsappEnabled()) {
      console.log("WhatsApp reminders are disabled, not scheduling reminder");
      return;
    }
    
    // Calculate the reminder time (30 minutes before session start)
    const reminderTime = new Date(session.startTime.getTime() - 30 * 60 * 1000);
    const now = new Date();
    
    // Check if the reminder time is in the future
    if (reminderTime <= now) {
      console.log(`Session ${session.id} start time is too soon to schedule a reminder`);
      return;
    }
    
    console.log(`Scheduling reminder for session ${session.id} at ${reminderTime.toISOString()}`);
    
    // Schedule reminders for both student and mentor
    if (session.student?.studentProfile?.whatsappReminders) {
      scheduleReminder(session, "student", reminderTime);
    }
    
    // For mentors, we always send reminders if they have a phone number
    scheduleReminder(session, "mentor", reminderTime);
  } catch (error) {
    console.error("Error scheduling session reminder:", error);
  }
};

/**
 * Schedule a reminder for a specific recipient
 */
const scheduleReminder = (
  session: Session,
  recipientType: "student" | "mentor",
  reminderTime: Date
): void => {
  const recipientId = recipientType === "student" ? session.studentId : session.mentorId;
  
  // Add the reminder to our tracking store
  sessionReminders.push({
    sessionId: session.id,
    recipientType,
    recipientId,
    scheduledTime: reminderTime,
    status: "scheduled"
  });
  
  // Calculate the delay in milliseconds
  const delay = reminderTime.getTime() - new Date().getTime();
  
  // Schedule the reminder
  setTimeout(async () => {
    try {
      // Find the reminder in our store
      const reminderIndex = sessionReminders.findIndex(
        r => r.sessionId === session.id && r.recipientType === recipientType && r.recipientId === recipientId
      );
      
      if (reminderIndex === -1) {
        console.error(`Reminder not found for session ${session.id} and ${recipientType} ${recipientId}`);
        return;
      }
      
      console.log(`Sending ${recipientType} reminder for session ${session.id}`);
      
      // Send the reminder
      const success = recipientType === "student"
        ? await sendStudentReminder(session)
        : await sendMentorReminder(session);
      
      // Update the reminder status
      if (success) {
        sessionReminders[reminderIndex].status = "sent";
      } else {
        sessionReminders[reminderIndex].status = "failed";
        sessionReminders[reminderIndex].errorMessage = "Failed to send WhatsApp message";
      }
    } catch (error) {
      console.error(`Error sending ${recipientType} reminder:`, error);
      
      // Find the reminder in our store
      const reminderIndex = sessionReminders.findIndex(
        r => r.sessionId === session.id && r.recipientType === recipientType && r.recipientId === recipientId
      );
      
      if (reminderIndex !== -1) {
        sessionReminders[reminderIndex].status = "failed";
        sessionReminders[reminderIndex].errorMessage = `Error: ${error}`;
      }
    }
  }, delay);
};

/**
 * Cancel scheduled reminders for a session
 */
export const cancelSessionReminders = (sessionId: string): void => {
  // We can't cancel the setTimeout directly, but we can mark the reminders as cancelled
  // so they won't be sent when they're processed
  const remindersToCancel = sessionReminders.filter(r => r.sessionId === sessionId && r.status === "scheduled");
  
  if (remindersToCancel.length === 0) {
    console.log(`No scheduled reminders found for session ${sessionId}`);
    return;
  }
  
  console.log(`Cancelling ${remindersToCancel.length} reminders for session ${sessionId}`);
  
  // Remove the reminders from our store
  for (const reminder of remindersToCancel) {
    const index = sessionReminders.findIndex(r => 
      r.sessionId === reminder.sessionId && 
      r.recipientType === reminder.recipientType && 
      r.recipientId === reminder.recipientId
    );
    
    if (index !== -1) {
      sessionReminders.splice(index, 1);
    }
  }
};

/**
 * Get all scheduled reminders
 */
export const getSessionReminders = (): SessionReminder[] => {
  return [...sessionReminders];
};
