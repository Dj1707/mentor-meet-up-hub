
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Linkedin } from "lucide-react";

const MentorProfile = () => {
  const { user, updateMentorProfile } = useAuth();
  const { toast } = useToast();
  
  // If profile doesn't exist, create an empty one
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
      country: ""
    },
    pastSectors: []
  };
  
  const [formData, setFormData] = useState({
    name: profile.name || "",
    email: profile.email || "",
    phone: profile.phone || "",
    linkedIn: profile.linkedIn || "",
    profilePicture: profile.profilePicture || "",
    jobTitle: profile.jobTitle || "",
    role: profile.role || "",
    company: profile.company || "",
    bio: profile.bio || "",
    bankDetails: {
      accountName: profile.bankDetails?.accountName || "",
      accountNumber: profile.bankDetails?.accountNumber || "",
      ifscCode: profile.bankDetails?.ifscCode || "",
      bankName: profile.bankDetails?.bankName || ""
    },
    address: {
      street: profile.address?.street || "",
      city: profile.address?.city || "",
      zipCode: profile.address?.zipCode || "",
      state: profile.address?.state || "",
      country: profile.address?.country || "India"
    },
    pastSectors: profile.pastSectors || []
  });
  
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
  
  const handleSelectChange = (value: string, field: string) => {
    if (field.includes('.')) {
      const [section, subfield] = field.split('.');
      setFormData(prev => {
        if (section === 'bankDetails') {
          return {
            ...prev,
            bankDetails: {
              ...prev.bankDetails,
              [subfield]: value
            }
          };
        } else if (section === 'address') {
          return {
            ...prev,
            address: {
              ...prev.address,
              [subfield]: value
            }
          };
        }
        return prev;
      });
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updateMentorProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        linkedIn: formData.linkedIn,
        profilePicture: formData.profilePicture,
        jobTitle: formData.jobTitle,
        role: formData.role,
        company: formData.company,
        bio: formData.bio,
        bankDetails: formData.bankDetails,
        address: formData.address,
        pastSectors: formData.pastSectors
      });
      
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
                
                <TabsContent value="personal" className="space-y-6">
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
                </TabsContent>
                
                <TabsContent value="professional" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="jobTitle" className="text-sm font-medium">
                        Current Job Title *
                      </label>
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Senior Software Engineer"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="company" className="text-sm font-medium">
                        Current Company *
                      </label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Google"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="role" className="text-sm font-medium">
                        Mentoring Role
                      </label>
                      <Input
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        placeholder="e.g. Technical Mentor, Career Coach"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="bio" className="text-sm font-medium">
                      Professional Bio *
                    </label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      required
                      placeholder="Tell students about your experience, expertise, and mentoring style"
                      className="h-32"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium block mb-2">
                      Past Industry Sectors
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {sectors.map((sector) => (
                        <button
                          key={sector}
                          type="button"
                          onClick={() => toggleSector(sector)}
                          className={`px-3 py-1 text-sm rounded-full transition-colors ${
                            formData.pastSectors.includes(sector)
                              ? "bg-mentor text-white"
                              : "bg-secondary text-primary hover:bg-secondary/80"
                          }`}
                        >
                          {sector}
                        </button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="payment" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-base font-medium">Bank Account Details</h3>
                    <p className="text-sm text-muted-foreground">
                      This information is used for processing your monthly payments
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="bankDetails.accountName" className="text-sm font-medium">
                          Account Holder Name
                        </label>
                        <Input
                          id="bankDetails.accountName"
                          name="bankDetails.accountName"
                          value={formData.bankDetails.accountName}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="bankDetails.accountNumber" className="text-sm font-medium">
                          Account Number
                        </label>
                        <Input
                          id="bankDetails.accountNumber"
                          name="bankDetails.accountNumber"
                          value={formData.bankDetails.accountNumber}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="bankDetails.ifscCode" className="text-sm font-medium">
                          IFSC Code
                        </label>
                        <Input
                          id="bankDetails.ifscCode"
                          name="bankDetails.ifscCode"
                          value={formData.bankDetails.ifscCode}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="bankDetails.bankName" className="text-sm font-medium">
                          Bank Name
                        </label>
                        <Input
                          id="bankDetails.bankName"
                          name="bankDetails.bankName"
                          value={formData.bankDetails.bankName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
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
