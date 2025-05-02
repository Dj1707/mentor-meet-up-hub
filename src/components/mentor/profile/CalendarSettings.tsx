import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CalendarSyncSettingsDialog } from "@/components/shared/CalendarSyncSettingsDialog";
import googleAuthService from "@/services/googleAuthService";
import googleCalendarService from "@/services/googleCalendarService";
import { CalendarSettings as CalendarSettingsType } from "@/types/calendar.types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const CalendarSettings = () => {
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [syncAvailability, setSyncAvailability] = useState(true);
  const [calendarSettings, setCalendarSettings] = useState<CalendarSettingsType>({
    provider: 'none',
    syncEnabled: false,
    defaultAddToCalendar: true,
    defaultReminders: [
      { method: 'email', minutes: 60 },
      { method: 'popup', minutes: 15 }
    ]
  });
  
  useEffect(() => {
    // Check if user is authenticated with Google
    const checkAuth = async () => {
      const authenticated = googleAuthService.isAuthenticated();
      setIsGoogleConnected(authenticated);
      
      if (authenticated) {
        setCalendarSettings(prev => ({
          ...prev,
          provider: 'google',
          syncEnabled: true
        }));
      }
    };
    
    checkAuth();
  }, []);

  const handleSaveSettings = (settings: CalendarSettingsType) => {
    setCalendarSettings(settings);
    
    // In a real app, this would save to backend
    console.log("Calendar settings saved:", settings);
    
    // Update authentication status
    setIsGoogleConnected(settings.provider === 'google');
  };

  const handleConnectGoogle = async () => {
    if (isGoogleConnected) {
      // Show settings dialog if already connected
      setSettingsDialogOpen(true);
    } else {
      // Connect to Google using the updated credentials
      const success = await googleAuthService.signIn();
      if (success) {
        setIsGoogleConnected(true);
        setCalendarSettings(prev => ({
          ...prev,
          provider: 'google',
          syncEnabled: true
        }));
      }
    }
  };

  const handleSyncToggle = (checked: boolean) => {
    setSyncAvailability(checked);
    // In a real app, this would update user preferences in backend
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Calendar Integration</CardTitle>
        <CardDescription>
          Connect your calendar to manage your availability and sessions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <div>
                <h4 className="text-sm font-medium">Google Calendar</h4>
                <p className="text-sm text-muted-foreground">
                  {isGoogleConnected ? 'Connected' : 'Not connected'}
                </p>
              </div>
              {isGoogleConnected && calendarSettings.syncEnabled && (
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-600 hover:bg-green-50">
                  Active
                </Badge>
              )}
            </div>
            <Button onClick={handleConnectGoogle}>
              {isGoogleConnected ? 'Manage Settings' : 'Connect'}
            </Button>
          </div>
          
          {isGoogleConnected && calendarSettings.syncEnabled && (
            <>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="sync-availability" 
                  checked={syncAvailability}
                  onCheckedChange={handleSyncToggle}
                />
                <Label htmlFor="sync-availability">
                  Automatically check my calendar for conflicts when adding availability
                </Label>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  <div>
                    <h4 className="text-sm font-medium">Google Meet</h4>
                    <p className="text-sm text-muted-foreground">
                      Enabled for sessions
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground mt-2 p-3 bg-muted rounded border">
                <h4 className="font-medium mb-2">Calendar Sync Features</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>New sessions automatically added to your calendar</li>
                  <li>Your availability is blocked in your calendar</li>
                  <li>Google Meet links automatically generated for sessions</li>
                  <li>Calendar events updated when sessions are rescheduled or cancelled</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </CardContent>
      
      <CalendarSyncSettingsDialog
        open={settingsDialogOpen}
        setOpen={setSettingsDialogOpen}
        settings={calendarSettings}
        onSave={handleSaveSettings}
      />
    </Card>
  );
};
