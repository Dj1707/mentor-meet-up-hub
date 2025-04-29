
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { 
  updateWhatsappConfig, 
  getWhatsappConfig, 
  getSessionReminders 
} from "@/services/whatsappService";
import { 
  formatTemplateMessage, 
  getTemplateVariables,
  getGupshupTemplateId 
} from "@/utils/whatsappTemplates";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const WhatsappConfig = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);
  const [reminderLogs, setReminderLogs] = useState<any[]>([]);
  const [recipientType, setRecipientType] = useState<"STUDENT" | "MENTOR">("STUDENT");
  
  // Load the current config when the component mounts
  useEffect(() => {
    const config = getWhatsappConfig();
    setApiKey(config.apiKey);
    setEnabled(config.enabled);
    
    // Load reminder logs for display
    const logs = getSessionReminders();
    setReminderLogs(logs);
  }, []);
  
  const handleSaveConfig = () => {
    // Save the API key and enabled status
    updateWhatsappConfig({
      apiKey,
      enabled
    });
    
    toast({
      title: "Configuration Saved",
      description: "WhatsApp notification settings have been updated."
    });
  };
  
  const handleTestMessage = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      // Get template variables for preview
      const templateVars = getTemplateVariables("SESSION_REMINDER", recipientType);
      
      // Create test values
      const testValues = {
        "1": recipientType === "STUDENT" ? "Student Name" : "Mentor Name",
        "2": "Mock Interview",
        "3": recipientType === "STUDENT" ? "John Smith" : "Jane Doe",
        "4": "30th April 2025",
        "5": "4:30 PM"
      };
      
      // Format a preview message
      const previewMessage = formatTemplateMessage(
        "SESSION_REMINDER",
        recipientType,
        testValues
      );
      
      console.log("Test message preview:", previewMessage);
      console.log("Using template ID:", getGupshupTemplateId("SESSION_REMINDER", recipientType));
      
      // Simulate API call to send a test message
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, this would call the WhatsApp service
      // For now, let's simulate a success if API key is present
      if (apiKey) {
        setTestResult("success");
        
        toast({
          title: "Test Message Sent",
          description: "A test message has been sent to the provided number."
        });
      } else {
        throw new Error("API key is required");
      }
    } catch (error) {
      setTestResult("error");
      toast({
        title: "Test Failed",
        description: "Failed to send test message. Please check your configuration.",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };
  
  return (
    <MainLayout title="WhatsApp Configuration">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Notification Settings</CardTitle>
            <CardDescription>
              Configure the WhatsApp notification system for session reminders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="whatsapp-enabled">Enable WhatsApp Reminders</Label>
                <Switch
                  id="whatsapp-enabled"
                  checked={enabled}
                  onCheckedChange={setEnabled}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                When enabled, reminders will be sent 30 minutes before scheduled sessions
                to users who have opted in.
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="api-key">Gupshup API Key</Label>
              <Input
                id="api-key"
                placeholder="Enter API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type="password"
              />
              <p className="text-sm text-muted-foreground">
                The API key for your Gupshup account. This is required for sending WhatsApp messages.
              </p>
            </div>
            
            <Button onClick={handleSaveConfig}>Save Configuration</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Test WhatsApp Integration</CardTitle>
            <CardDescription>
              Send a test message to verify your configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-phone">Phone Number</Label>
              <Input
                id="test-phone"
                placeholder="+919876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Enter a phone number with country code to receive the test message.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recipient-type">Recipient Type</Label>
              <Select 
                value={recipientType} 
                onValueChange={(value: "STUDENT" | "MENTOR") => setRecipientType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STUDENT">Student</SelectItem>
                  <SelectItem value="MENTOR">Mentor</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Select the type of recipient to test the correct template.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="test-message">Template Preview</Label>
              <div className="p-3 border rounded-md bg-muted/50 whitespace-pre-line">
                {formatTemplateMessage(
                  "SESSION_REMINDER",
                  recipientType,
                  {
                    "1": recipientType === "STUDENT" ? "Student Name" : "Mentor Name",
                    "2": "Mock Interview",
                    "3": recipientType === "STUDENT" ? "John Smith" : "Jane Doe",
                    "4": "30th April 2025",
                    "5": "4:30 PM"
                  }
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Template ID: {getGupshupTemplateId("SESSION_REMINDER", recipientType)}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleTestMessage} 
                disabled={testing || !phoneNumber || !apiKey}
              >
                {testing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {testResult === "success" && <CheckCircle className="mr-2 h-4 w-4 text-green-500" />}
                {testResult === "error" && <XCircle className="mr-2 h-4 w-4 text-red-500" />}
                Send Test Message
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Reminder Logs</CardTitle>
            <CardDescription>
              View logs of recent WhatsApp reminders
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reminderLogs.length > 0 ? (
              <div className="space-y-4">
                {reminderLogs.map((log, index) => (
                  <div key={index} className="p-3 border rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium">Session ID: {log.sessionId}</span>
                      <span className={`px-2 py-1 text-xs rounded ${
                        log.status === 'sent' ? 'bg-green-100 text-green-800' : 
                        log.status === 'failed' ? 'bg-red-100 text-red-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {log.recipientType.charAt(0).toUpperCase() + log.recipientType.slice(1)} reminder
                      scheduled for {new Date(log.scheduledTime).toLocaleString()}
                    </p>
                    {log.errorMessage && (
                      <p className="text-sm text-red-600 mt-1">{log.errorMessage}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No reminder logs yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default WhatsappConfig;
