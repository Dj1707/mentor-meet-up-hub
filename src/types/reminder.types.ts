
import { Session } from "./session.types";

export interface SessionReminder {
  sessionId: string;
  recipientType: "student" | "mentor";
  recipientId: string;
  scheduledTime: Date;
  status: "scheduled" | "sent" | "failed";
  errorMessage?: string;
}

export interface WhatsAppConfig {
  enabled: boolean;
  apiKey: string;
  lastUpdated: Date;
}
