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
    panNumber: "",
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
              ...(prev.bankDetails || {
                accountName: "",
                accountNumber: "",
                ifscCode: "",
                bankName: ""
              }),
              [field]: value
            }
          };
        } else if (section === 'address') {
          return {
            ...prev,
            address: {
              ...(prev.address || {
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "India"
              }),
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
      const currentSectors = prev.pastSectors || [];
      const updatedSectors = currentSectors.includes(sector)
        ? currentSectors.filter(s => s !== sector)
        : [...currentSectors, sector];
      
      return { ...prev, pastSectors: updatedSectors };
    });
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
                    formData={{
                      name: formData.name,
                      email: formData.email,
                      phone: formData.phone || "",
                      linkedIn: formData.linkedIn || "",
                      profilePicture: formData.profilePicture || "",
                      panNumber: formData.panNumber || "",
                      address: formData.address || {
                        street: "",
                        city: "",
                        state: "",
                        zipCode: "",
                        country: "India"
                      }
                    }}
                    handleChange={handleChange}
                  />
                </TabsContent>
                
                <TabsContent value="professional">
                  <ProfessionalDetailsTab
                    formData={{
                      jobTitle: formData.jobTitle || "",
                      company: formData.company || "",
                      role: formData.role || "",
                      bio: formData.bio || "",
                      pastSectors: formData.pastSectors || []
                    }}
                    handleChange={handleChange}
                    toggleSector={toggleSector}
                    sectors={sectors}
                  />
                </TabsContent>
                
                <TabsContent value="payment">
                  <PaymentInfoTab
                    formData={{
                      bankDetails: formData.bankDetails || {
                        accountName: "",
                        accountNumber: "",
                        ifscCode: "",
                        bankName: ""
                      }
                    }}
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
