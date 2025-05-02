
import { toast } from "@/hooks/use-toast";
import googleAuthService from "./googleAuthService";

/**
 * Service to handle Google Meet operations
 */
class GoogleMeetService {
  /**
   * Create a new Google Meet conference
   * 
   * Note: This functionality is typically handled within the Calendar API
   * by setting conferenceData in the event creation. This method is a fallback
   * for direct Meet creation if needed.
   */
  async createMeeting(title: string, startTime: Date, endTime: Date): Promise<{ meetLink: string, conferenceId: string } | null> {
    try {
      const token = await googleAuthService.getToken();
      
      if (!token) {
        console.error('No auth token available');
        toast({
          title: "Not Connected",
          description: "Please connect your Google Calendar first.",
          variant: "destructive"
        });
        return null;
      }
      
      // Creating Meet conferences via Calendar API is the recommended approach
      // For standalone Meet conferences, we need to use the Google Calendar API to create a minimal event
      const event = {
        summary: title,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}-${Math.floor(Math.random() * 1000)}`
          }
        }
      };
      
      console.log("Creating Meet conference:", event);
      
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to create Google Meet conference:', errorData);
        throw new Error(`Failed to create Google Meet conference: ${errorData.error?.message || response.statusText}`);
      }
      
      const eventData = await response.json();
      console.log('Google Meet conference created via calendar event:', eventData);
      
      // Extract Google Meet link
      let meetLink = '';
      let conferenceId = '';
      
      if (eventData.conferenceData) {
        conferenceId = eventData.conferenceData.conferenceId || '';
        
        // Find the video entry point
        if (eventData.conferenceData.entryPoints) {
          const videoEntry = eventData.conferenceData.entryPoints.find(
            (entry: any) => entry.entryPointType === 'video'
          );
          if (videoEntry) {
            meetLink = videoEntry.uri;
          }
        }
        
        // Fallback to hangoutLink
        if (!meetLink && eventData.hangoutLink) {
          meetLink = eventData.hangoutLink;
        }
      }
      
      if (!meetLink) {
        throw new Error('Failed to extract Google Meet link from the created event');
      }
      
      return {
        meetLink,
        conferenceId
      };
    } catch (error) {
      console.error('Failed to create Google Meet conference:', error);
      toast({
        title: "Meet Creation Failed",
        description: "Could not create a Google Meet link. A generic meeting link will be used instead.",
        variant: "destructive"
      });
      return null;
    }
  }
  
  /**
   * Get details about an existing Google Meet conference
   */
  async getMeetingDetails(conferenceId: string): Promise<{ meetLink: string } | null> {
    try {
      const token = await googleAuthService.getToken();
      
      if (!token) {
        console.error('No auth token available');
        return null;
      }
      
      // Unfortunately, there's no direct API to get Meet conference details.
      // The conferenceId is typically associated with a calendar event.
      // In a production app, we'd query the calendar for events with this conference ID.
      
      // For now, construct the Meet link directly
      const meetLink = `https://meet.google.com/${conferenceId}`;
      
      return { meetLink };
    } catch (error) {
      console.error('Failed to get Google Meet details:', error);
      return null;
    }
  }
}

export default new GoogleMeetService();
