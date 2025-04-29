
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface WhatsappReminderToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const WhatsappReminderToggle: React.FC<WhatsappReminderToggleProps> = ({
  enabled,
  onChange
}) => {
  const { toast } = useToast();

  const handleToggle = (checked: boolean) => {
    onChange(checked);
    
    toast({
      title: checked ? "WhatsApp reminders enabled" : "WhatsApp reminders disabled",
      description: checked 
        ? "You will receive WhatsApp reminders 30 minutes before your sessions." 
        : "You will not receive WhatsApp reminders for your sessions."
    });
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="whatsapp-reminders" className="flex flex-col space-y-1">
          <span>WhatsApp Reminders</span>
          <span className="font-normal text-sm text-muted-foreground">
            Receive WhatsApp notifications 30 minutes before sessions
          </span>
        </Label>
        <Switch
          id="whatsapp-reminders"
          checked={enabled}
          onCheckedChange={handleToggle}
        />
      </div>
    </div>
  );
};

export default WhatsappReminderToggle;
