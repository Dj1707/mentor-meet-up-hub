
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const StudentProfile = () => {
  const { user, updateStudentProfile } = useAuth();
  const { toast } = useToast();
  
  // If profile doesn't exist, create an empty one
  const profile = user?.studentProfile || {
    name: "",
    email: user?.email || "",
    phone: "",
    linkedIn: "",
    profilePicture: "",
    targetRole: "",
    targetDomain: "",
    targetCTC: "",
    targetSectors: []
  };
  
  const [formData, setFormData] = useState({
    name: profile.name || "",
    email: profile.email || "",
    phone: profile.phone || "",
    linkedIn: profile.linkedIn || "",
    profilePicture: profile.profilePicture || "",
    targetRole: profile.targetRole || "",
    targetDomain: profile.targetDomain || "",
    targetCTC: profile.targetCTC || "",
    targetSectors: profile.targetSectors?.join(", ") || ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const targetSectors = formData.targetSectors
        .split(",")
        .map(sector => sector.trim())
        .filter(Boolean);
      
      await updateStudentProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        linkedIn: formData.linkedIn,
        profilePicture: formData.profilePicture,
        targetRole: formData.targetRole,
        targetDomain: formData.targetDomain,
        targetCTC: formData.targetCTC,
        targetSectors
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
  
  return (
    <MainLayout title="My Profile">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Student Profile</CardTitle>
            <CardDescription>
              Update your profile information to help mentors understand your needs better
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  <label htmlFor="targetRole" className="text-sm font-medium">
                    Target Role
                  </label>
                  <Input
                    id="targetRole"
                    name="targetRole"
                    value={formData.targetRole}
                    onChange={handleChange}
                    placeholder="e.g. Software Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="targetDomain" className="text-sm font-medium">
                    Target Domain
                  </label>
                  <Input
                    id="targetDomain"
                    name="targetDomain"
                    value={formData.targetDomain}
                    onChange={handleChange}
                    placeholder="e.g. Web Development"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="targetCTC" className="text-sm font-medium">
                    Target CTC
                  </label>
                  <Input
                    id="targetCTC"
                    name="targetCTC"
                    value={formData.targetCTC}
                    onChange={handleChange}
                    placeholder="e.g. $90,000"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="targetSectors" className="text-sm font-medium">
                  Target Sectors
                </label>
                <Textarea
                  id="targetSectors"
                  name="targetSectors"
                  value={formData.targetSectors}
                  onChange={handleChange}
                  placeholder="e.g. Tech, Finance, Healthcare (comma-separated)"
                  className="h-24"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter multiple sectors separated by commas
                </p>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" className="bg-student hover:bg-student/90" disabled={isSubmitting}>
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

export default StudentProfile;
