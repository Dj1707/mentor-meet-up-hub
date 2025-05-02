
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarSettings } from "@/types/calendar.types";
import googleAuthService from "@/services/googleAuthService";
import googleCalendarService from "@/services/googleCalendarService";
import { useToast } from "@/hooks/use-toast";

interface CalendarSyncSettingsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  settings: CalendarSettings;
  onSave: (settings: CalendarSettings) => void;
}

export const CalendarSyncSettingsDialog = ({ 
  open, 
  setOpen, 
  settings, 
  onSave 
}: CalendarSyncSettingsDialogProps) => {
  const [calendarSettings, setCalendarSettings] = useState<CalendarSettings>(settings);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [calendars, setCalendars] = useState<{ id: string, summary: string }[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated with Google
    const checkAuth = async () => {
      const authenticated = googleAuthService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        // Get list of user's calendars
        const userCalendars = await googleCalendarService.listCalendars();
        setCalendars(userCalendars);
      }
    };
    
    if (open) {
      checkAuth();
    }
  }, [open]);

  const handleGoogleConnect = async () => {
    if (isAuthenticated) {
      // Sign out
      googleAuthService.signOut();
      setIsAuthenticated(false);
      setCalendarSettings({
        ...calendarSettings,
        provider: 'none',
        syncEnabled: false,
      });
    } else {
      // Sign in
      const success = await googleAuthService.signIn();
      if (success) {
        setIsAuthenticated(true);
        
        // Get list of user's calendars
        const userCalendars = await googleCalendarService.listCalendars();
        setCalendars(userCalendars);
        
        setCalendarSettings({
          ...calendarSettings,
          provider: 'google',
          syncEnabled: true,
          primaryCalendarId: 'primary'
        });
      }
    }
  };

  const handleSave = () => {
    onSave(calendarSettings);
    setOpen(false);
    
    toast({
      title: "Settings Saved",
      description: "Your calendar settings have been updated.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Calendar Settings</DialogTitle>
          <DialogDescription>
            Connect your calendar to manage your sessions
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Google Calendar</div>
              <div className="text-sm text-muted-foreground">
                {isAuthenticated ? 'Connected' : 'Not connected'}
              </div>
            </div>
            <Button
              variant={isAuthenticated ? "destructive" : "default"}
              onClick={handleGoogleConnect}
            >
              {isAuthenticated ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
          
          {isAuthenticated && (
            <>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="sync-enabled"
                    checked={calendarSettings.syncEnabled}
                    onCheckedChange={(checked) => 
                      setCalendarSettings({...calendarSettings, syncEnabled: checked})
                    }
                  />
                  <Label htmlFor="sync-enabled">Enable calendar sync</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="primary-calendar">Primary Calendar</Label>
                  <Select 
                    value={calendarSettings.primaryCalendarId || 'primary'}
                    onValueChange={(value) => 
                      setCalendarSettings({...calendarSettings, primaryCalendarId: value})
                    }
                    disabled={!calendarSettings.syncEnabled}
                  >
                    <SelectTrigger id="primary-calendar">
                      <SelectValue placeholder="Select a calendar" />
                    </SelectTrigger>
                    <SelectContent>
                      {calendars.map((calendar) => (
                        <SelectItem key={calendar.id} value={calendar.id}>
                          {calendar.summary}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="auto-add"
                    checked={calendarSettings.defaultAddToCalendar}
                    onCheckedChange={(checked) => 
                      setCalendarSettings({...calendarSettings, defaultAddToCalendar: checked})
                    }
                    disabled={!calendarSettings.syncEnabled}
                  />
                  <Label htmlFor="auto-add">Automatically add sessions to calendar</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Default Reminders</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 border rounded">
                    <div className="text-xs">Email reminder</div>
                    <div className="text-sm font-medium">60 minutes before</div>
                  </div>
                  <div className="p-2 border rounded">
                    <div className="text-xs">Popup reminder</div>
                    <div className="text-sm font-medium">15 minutes before</div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Settings</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
