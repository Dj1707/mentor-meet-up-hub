
import React, { useEffect } from "react";
import { Session } from "@/types";
import { scheduleSessionReminder, cancelSessionReminders } from "@/services/whatsappService";

interface SessionReminderManagerProps {
  session: Session;
  status: "created" | "updated" | "cancelled";
}

/**
 * A component to manage session reminders
 * This can be included in session creation/update flows
 */
const SessionReminderManager: React.FC<SessionReminderManagerProps> = ({
  session,
  status
}) => {
  useEffect(() => {
    if (status === "created" || status === "updated") {
      console.log(`Scheduling WhatsApp reminder for session ${session.id}`);
      // If the session is updated, we cancel any existing reminders
      if (status === "updated") {
        cancelSessionReminders(session.id);
      }
      // Schedule the reminder
      scheduleSessionReminder(session);
    } else if (status === "cancelled") {
      console.log(`Cancelling WhatsApp reminders for session ${session.id}`);
      cancelSessionReminders(session.id);
    }
  }, [session, status]);

  // This component doesn't render anything
  return null;
};

export default SessionReminderManager;
