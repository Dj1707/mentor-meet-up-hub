
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalInfoTab from "@/components/mentor/profile/PersonalInfoTab";
import ProfessionalDetailsTab from "@/components/mentor/profile/ProfessionalDetailsTab";
import PaymentInfoTab from "@/components/mentor/profile/PaymentInfoTab";

const MentorProfile = () => {
  const { user, updateMentorProfile } = useAuth();
  const { toast } = useToast();
  
  const profile = user?.mentorProfile || {
    name: "",
    email: user?.email || "",
    phone: "",
    linkedIn: "",
    profilePicture: "",
    jobTitle: "",
    role: "",
    company: "",
    bio: "",
    whatsappNotifications: false,
    bankDetails: {
      accountName: "",
      accountNumber: "",
      ifscCode: "",
      bankName: ""
    },
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India"
    },
    pastSectors: []
  };
  
  const [formData, setFormData] = useState(profile);
  const [activeTab, setActiveTab] = useState("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => {
        if (section === 'bankDetails') {
          return {
            ...prev,
            bankDetails: {
              ...prev.bankDetails,
              [field]: value
            }
          };
        } else if (section === 'address') {
          return {
            ...prev,
            address: {
              ...prev.address,
              [field]: value
            }
          };
        }
        return prev;
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const sectors = [
    "Technology", "Healthcare", "Finance", "Education", "Retail",
    "Manufacturing", "Marketing", "Sales", "HR", "Operations",
    "Consulting", "Legal", "Engineering", "Design", "Research"
  ];

  const toggleSector = (sector: string) => {
    setFormData(prev => {
      const updatedSectors = prev.pastSectors.includes(sector)
        ? prev.pastSectors.filter(s => s !== sector)
        : [...prev.pastSectors, sector];
      
      return { ...prev, pastSectors: updatedSectors };
    });
  };

  const handleWhatsAppToggle = (checked: boolean) => {
    setFormData(prev => ({ ...prev, whatsappNotifications: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updateMentorProfile(formData);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <MainLayout title="My Profile">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Mentor Profile</CardTitle>
            <CardDescription>
              Complete your profile to help students find and connect with you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="personal">Personal Information</TabsTrigger>
                  <TabsTrigger value="professional">Professional Details</TabsTrigger>
                  <TabsTrigger value="payment">Payment Information</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal">
                  <PersonalInfoTab
                    formData={formData}
                    handleChange={handleChange}
                    handleWhatsAppToggle={handleWhatsAppToggle}
                  />
                </TabsContent>
                
                <TabsContent value="professional">
                  <ProfessionalDetailsTab
                    formData={formData}
                    handleChange={handleChange}
                    toggleSector={toggleSector}
                    sectors={sectors}
                  />
                </TabsContent>
                
                <TabsContent value="payment">
                  <PaymentInfoTab
                    formData={formData}
                    handleChange={handleChange}
                  />
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end mt-6">
                <Button type="submit" className="bg-mentor hover:bg-mentor/90" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default MentorProfile;
