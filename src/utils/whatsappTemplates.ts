
/**
 * WhatsApp templates for session reminders
 */

export const TEMPLATES = {
  SESSION_REMINDER: {
    id: "session_reminder",
    variables: {
      STUDENT: {
        "1": "Student Name",
        "2": "Session Name",
        "3": "Mentor Name",
        "4": "Date (format: 29th April 2025)",
        "5": "Time (format: 5:00 PM)"
      },
      MENTOR: {
        "1": "Mentor Name",
        "2": "Session Name",
        "3": "Student Name",
        "4": "Date (format: 29th April 2025)",
        "5": "Time (format: 5:00 PM)"
      }
    }
  }
};

/**
 * Get a template's variable information
 */
export const getTemplateVariables = (
  templateId: keyof typeof TEMPLATES, 
  recipientType: "STUDENT" | "MENTOR"
): Record<string, string> => {
  return TEMPLATES[templateId]?.variables[recipientType] || {};
};

/**
 * Format the template message for display (helpful for testing)
 */
export const formatTemplateMessage = (
  templateId: keyof typeof TEMPLATES,
  recipientType: "STUDENT" | "MENTOR",
  values: Record<string, string>
): string => {
  const template = `Hi {{1}},

This is a reminder that you have a {{2}} scheduled with {{3}} on {{4}} at {{5}}.
Please make sure to join the session on time via your dashboard.

Thank you,
Pathways Team
Mesa School of Business`;

  // Replace template variables with actual values
  let formattedMessage = template;
  Object.entries(values).forEach(([key, value]) => {
    formattedMessage = formattedMessage.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });

  return formattedMessage;
};
