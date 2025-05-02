
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
      
      // Create the event payload with Google Meet conferencing data
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
        },
        // Add conferencing data to automatically create a Google Meet link
        conferenceData: {
          createRequest: {
            requestId: `mc-session-${Date.now()}-${Math.floor(Math.random() * 1000)}`
          }
        }
      };
      
      // Make an actual API call to create the event
      const response = await fetch(`${this.apiBase}/calendars/primary/events?conferenceDataVersion=1`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to create calendar event:', errorData);
        throw new Error(`Failed to create calendar event: ${errorData.error?.message || response.statusText}`);
      }
      
      const eventData = await response.json();
      console.log('Calendar event created:', eventData);
      
      // Extract the Google Meet link if available
      let meetLink = '';
      if (eventData.conferenceData?.entryPoints) {
        const videoEntry = eventData.conferenceData.entryPoints.find(
          (entry: any) => entry.entryPointType === 'video'
        );
        if (videoEntry) {
          meetLink = videoEntry.uri;
        }
      }
      
      toast({
        title: "Session Scheduled",
        description: "Calendar invitation has been sent to all participants."
      });
      
      return { 
        eventId: eventData.id, 
        meetLink: meetLink || eventData.hangoutLink || '' 
      };
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
        },
        attendees: [
          {
            email: mentorEmail,
            responseStatus: 'accepted'
          },
          {
            email: studentEmail,
            responseStatus: 'needsAction'
          }
        ]
      };
      
      // Make an actual API call to update the event
      const response = await fetch(`${this.apiBase}/calendars/primary/events/${eventId}?sendUpdates=all`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventUpdate)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to update calendar event:', errorData);
        throw new Error(`Failed to update calendar event: ${errorData.error?.message || response.statusText}`);
      }
      
      const eventData = await response.json();
      console.log('Calendar event updated:', eventData);
      
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
      
      // Make an actual API call to delete the event
      const response = await fetch(`${this.apiBase}/calendars/primary/events/${eventId}?sendUpdates=all`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok && response.status !== 204) {
        const errorData = await response.text();
        console.error('Failed to delete calendar event:', errorData);
        throw new Error(`Failed to delete calendar event: ${errorData || response.statusText}`);
      }
      
      console.log('Calendar event deleted:', eventId);
      
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
      
      // Make an actual API call to list calendars
      const response = await fetch(`${this.apiBase}/users/me/calendarList`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to list calendars:', errorData);
        throw new Error(`Failed to list calendars: ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      
      // Map the response to the expected format
      const calendars = data.items.map((item: any) => ({
        id: item.id,
        summary: item.summary
      }));
      
      return calendars;
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
      
      // Format the time range for the FreeBusy request
      const timeMin = startTime.toISOString();
      const timeMax = endTime.toISOString();
      
      // Make an actual API call to check availability
      const response = await fetch(`${this.apiBase}/freeBusy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timeMin,
          timeMax,
          items: [{ id: 'primary' }]
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to check availability:', errorData);
        throw new Error(`Failed to check availability: ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      
      // Check if there are any busy periods in the requested time range
      const busyPeriods = data.calendars.primary.busy || [];
      
      // If there are no busy periods, the time slot is available
      return busyPeriods.length === 0;
    } catch (error) {
      console.error('Failed to check availability:', error);
      return true; // Assume available if we can't check
    }
  }
}

export default new GoogleCalendarService();
