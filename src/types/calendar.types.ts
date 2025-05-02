
export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: GoogleCalendarAttendee[];
  conferenceData?: GoogleCalendarConferenceData;
  reminders?: GoogleCalendarReminders;
}

export interface GoogleCalendarAttendee {
  email: string;
  displayName?: string;
  responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  optional?: boolean;
}

export interface GoogleCalendarConferenceData {
  conferenceId?: string;
  createRequest?: {
    requestId: string;
    conferenceSolutionKey?: {
      type: string;
    };
  };
  conferenceSolution?: {
    key: {
      type: string;
    };
    name: string;
  };
  entryPoints?: GoogleCalendarEntryPoint[];
}

export interface GoogleCalendarEntryPoint {
  entryPointType: 'video' | 'phone' | 'sip' | 'more';
  uri: string;
  label?: string;
}

export interface GoogleCalendarReminders {
  useDefault: boolean;
  overrides?: {
    method: 'email' | 'popup';
    minutes: number;
  }[];
}

export interface CalendarSettings {
  provider: 'google' | 'none';
  syncEnabled: boolean;
  defaultAddToCalendar: boolean;
  defaultReminders: {
    method: 'email' | 'popup';
    minutes: number;
  }[];
  primaryCalendarId?: string;
}
