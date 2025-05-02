
import { toast } from "@/hooks/use-toast";
import googleAuthService from "./googleAuthService";
import { GoogleCalendarEvent, GoogleCalendarAttendee } from "@/types/calendar.types";
import { Session } from "@/types/session.types";
import { format } from "date-fns";

/**
 * Service to handle Google Calendar operations
 */
class GoogleCalendarService {
  private apiBase = 'https://www.googleapis.com/calendar/v3';
  
  /**
   * Create a calendar event from session data
   */
  async createEventFromSession(session: Session, mentorEmail: string, studentEmail: string): Promise<{ eventId: string, meetLink: string } | null> {
    try {
      const token = await googleAuthService.getToken();
      
      if (!token) {
        console.error('No auth token available');
        return null;
      }
      
      const startTime = new Date(session.startTime);
      const endTime = new Date(session.endTime);
      
      // Format event title
      const sessionType = session.sessionType?.name || "Mentoring Session";
      const eventTitle = `${sessionType} with ${mentorEmail.split('@')[0]}`;
      
      // Prepare attendees
      const attendees: GoogleCalendarAttendee[] = [
        {
          email: mentorEmail,
          responseStatus: 'accepted'
        },
        {
          email: studentEmail,
          responseStatus: 'needsAction'
        }
      ];
      
      // Create the event payload
      const event: GoogleCalendarEvent = {
        summary: eventTitle,
        description: `${sessionType}\n\nThis is an automatically scheduled session through Mentor Connect.`,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        attendees: attendees,
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 60 },
            { method: 'popup', minutes: 15 }
          ]
        }
      };
      
      // In a real implementation, this would make an API call to create the event
      console.log('Creating Google Calendar event:', event);
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful event creation
      const eventId = 'event-' + Math.random().toString(36).substring(2, 15);
      const meetLink = 'https://meet.google.com/' + Math.random().toString(36).substring(2, 9);
      
      toast({
        title: "Session Scheduled",
        description: "Calendar invitation has been sent to all participants."
      });
      
      return { eventId, meetLink };
    } catch (error) {
      console.error('Failed to create calendar event:', error);
      toast({
        title: "Calendar Error",
        description: "Failed to create calendar event. The session is still booked.",
        variant: "destructive"
      });
      return null;
    }
  }
  
  /**
   * Update an existing calendar event
   */
  async updateEvent(eventId: string, session: Session, mentorEmail: string, studentEmail: string): Promise<boolean> {
    try {
      const token = await googleAuthService.getToken();
      
      if (!token || !eventId) {
        console.error('No auth token or event ID available');
        return false;
      }
      
      const startTime = new Date(session.startTime);
      const endTime = new Date(session.endTime);
      
      // Create the event update payload
      const eventUpdate: Partial<GoogleCalendarEvent> = {
        start: {
          dateTime: startTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };
      
      // In a real implementation, this would make an API call to update the event
      console.log('Updating Google Calendar event:', eventId, eventUpdate);
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Session Updated",
        description: "Calendar event has been updated."
      });
      
      return true;
    } catch (error) {
      console.error('Failed to update calendar event:', error);
      toast({
        title: "Calendar Error",
        description: "Failed to update calendar event.",
        variant: "destructive"
      });
      return false;
    }
  }
  
  /**
   * Delete a calendar event
   */
  async deleteEvent(eventId: string): Promise<boolean> {
    try {
      const token = await googleAuthService.getToken();
      
      if (!token || !eventId) {
        console.error('No auth token or event ID available');
        return false;
      }
      
      // In a real implementation, this would make an API call to delete the event
      console.log('Deleting Google Calendar event:', eventId);
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Session Cancelled",
        description: "Calendar event has been removed."
      });
      
      return true;
    } catch (error) {
      console.error('Failed to delete calendar event:', error);
      toast({
        title: "Calendar Error",
        description: "Failed to remove calendar event.",
        variant: "destructive"
      });
      return false;
    }
  }
  
  /**
   * Get a list of the user's calendars
   */
  async listCalendars(): Promise<{ id: string, summary: string }[]> {
    try {
      const token = await googleAuthService.getToken();
      
      if (!token) {
        console.error('No auth token available');
        return [];
      }
      
      // In a real implementation, this would make an API call to list calendars
      console.log('Listing Google Calendars');
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data
      return [
        { id: 'primary', summary: 'Primary Calendar' },
        { id: 'work', summary: 'Work Calendar' },
        { id: 'personal', summary: 'Personal Calendar' }
      ];
    } catch (error) {
      console.error('Failed to list calendars:', error);
      return [];
    }
  }
  
  /**
   * Check if a time slot is available in the user's calendar
   */
  async checkAvailability(startTime: Date, endTime: Date): Promise<boolean> {
    try {
      const token = await googleAuthService.getToken();
      
      if (!token) {
        console.error('No auth token available');
        return true; // Assume available if we can't check
      }
      
      // In a real implementation, this would make an API call to check availability
      console.log('Checking availability:', startTime, endTime);
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Simulate random availability (90% chance of being available)
      return Math.random() < 0.9;
    } catch (error) {
      console.error('Failed to check availability:', error);
      return true; // Assume available if we can't check
    }
  }
}

export default new GoogleCalendarService();
