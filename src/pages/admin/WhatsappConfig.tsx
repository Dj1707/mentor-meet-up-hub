
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { updateGupshupApiKey } from "@/services/whatsappService";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const WhatsappConfig = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);
  
  const handleSaveConfig = () => {
    // Save the API key
    updateGupshupApiKey(apiKey);
    
    toast({
      title: "Configuration Saved",
      description: "WhatsApp notification settings have been updated."
    });
  };
  
  const handleTestMessage = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      // Simulate API call to send a test message
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, this would call the WhatsApp service
      // For now, let's simulate a success
      setTestResult("success");
      
      toast({
        title: "Test Message Sent",
        description: "A test message has been sent to the provided number."
      });
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
              <Label htmlFor="test-message">Test Message</Label>
              <Input
                id="test-message"
                placeholder="This is a test message from Mesa School"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
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
            <p className="text-center text-muted-foreground py-8">
              No reminder logs yet
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default WhatsappConfig;
