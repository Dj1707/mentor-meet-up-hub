
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface PersonalInfoTabProps {
  formData: {
    name: string;
    email: string;
    phone?: string;
    linkedIn?: string;
    profilePicture?: string;
    whatsappNotifications: boolean;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleWhatsAppToggle: (checked: boolean) => void;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  formData,
  handleChange,
  handleWhatsAppToggle,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Full Name *
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email *
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="linkedIn" className="text-sm font-medium">
            LinkedIn Profile
          </label>
          <Input
            id="linkedIn"
            name="linkedIn"
            value={formData.linkedIn}
            onChange={handleChange}
            placeholder="linkedin.com/in/yourprofile"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="profilePicture" className="text-sm font-medium">
            Profile Picture URL
          </label>
          <Input
            id="profilePicture"
            name="profilePicture"
            value={formData.profilePicture}
            onChange={handleChange}
            placeholder="https://example.com/your-image.jpg"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="whatsapp-notifications" className="text-sm font-medium">
              Enable WhatsApp Notifications
            </Label>
            <Switch
              id="whatsapp-notifications"
              checked={formData.whatsappNotifications}
              onCheckedChange={handleWhatsAppToggle}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Receive session reminders via WhatsApp
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-base font-medium mb-2">Address Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="address.street" className="text-sm font-medium">
              Street Address
            </label>
            <Input
              id="address.street"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="address.city" className="text-sm font-medium">
              City
            </label>
            <Input
              id="address.city"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="address.state" className="text-sm font-medium">
              State
            </label>
            <Input
              id="address.state"
              name="address.state"
              value={formData.address.state}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="address.zipCode" className="text-sm font-medium">
              ZIP Code
            </label>
            <Input
              id="address.zipCode"
              name="address.zipCode"
              value={formData.address.zipCode}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="address.country" className="text-sm font-medium">
              Country
            </label>
            <Input
              id="address.country"
              name="address.country"
              value={formData.address.country}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoTab;
