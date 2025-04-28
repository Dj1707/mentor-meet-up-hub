
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormItem } from "@/components/ui/form";
import { Upload, Phone, Linkedin } from "lucide-react";

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
    targetSectors: [],
    pastJobRole: "",
    pastIndustry: "",
    resumeUrl: "",
    whatsappReminders: false
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
    targetSectors: profile.targetSectors?.join(", ") || "",
    resumeUrl: profile.resumeUrl || "",
    pastJobRole: profile.pastJobRole || "",
    pastIndustry: profile.pastIndustry || "",
    whatsappReminders: profile.whatsappReminders || false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, whatsappReminders: checked }));
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      // For this example, we'll just show the filename as the URL
      // In a real app, you would upload this file to storage and get a URL
      setFormData(prev => ({ 
        ...prev, 
        resumeUrl: e.target.files ? e.target.files[0].name : ""
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const targetSectors = formData.targetSectors
        .split(",")
        .map(sector => sector.trim())
        .filter(Boolean);
      
      // In a real app, you would upload the resume to storage here
      // and get back a URL to store in the profile
      
      await updateStudentProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        linkedIn: formData.linkedIn,
        profilePicture: formData.profilePicture,
        targetRole: formData.targetRole,
        targetDomain: formData.targetDomain,
        targetCTC: formData.targetCTC,
        targetSectors,
        pastJobRole: formData.pastJobRole,
        pastIndustry: formData.pastIndustry,
        resumeUrl: formData.resumeUrl,
        whatsappReminders: formData.whatsappReminders
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
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
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
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedIn">LinkedIn Profile</Label>
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="linkedIn"
                        name="linkedIn"
                        value={formData.linkedIn}
                        onChange={handleChange}
                        placeholder="linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profilePicture">Profile Picture URL</Label>
                    <Input
                      id="profilePicture"
                      name="profilePicture"
                      value={formData.profilePicture}
                      onChange={handleChange}
                      placeholder="https://example.com/your-image.jpg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resume">Resume</Label>
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => document.getElementById('resume')?.click()}>
                        <Upload className="mr-2 h-4 w-4" /> Upload Resume
                      </Button>
                      <Input
                        id="resume"
                        name="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeChange}
                        className="hidden"
                      />
                    </div>
                    {formData.resumeUrl && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Current resume: {formData.resumeUrl}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Career Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="targetRole">Target Role</Label>
                    <Input
                      id="targetRole"
                      name="targetRole"
                      value={formData.targetRole}
                      onChange={handleChange}
                      placeholder="e.g. Software Engineer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetDomain">Target Domain</Label>
                    <Input
                      id="targetDomain"
                      name="targetDomain"
                      value={formData.targetDomain}
                      onChange={handleChange}
                      placeholder="e.g. Web Development"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetCTC">Expected Compensation</Label>
                    <Input
                      id="targetCTC"
                      name="targetCTC"
                      value={formData.targetCTC}
                      onChange={handleChange}
                      placeholder="e.g. ₹12,00,000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pastJobRole">Past Job Role</Label>
                    <Input
                      id="pastJobRole"
                      name="pastJobRole"
                      value={formData.pastJobRole}
                      onChange={handleChange}
                      placeholder="e.g. Junior Developer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pastIndustry">Past Industry</Label>
                    <Input
                      id="pastIndustry"
                      name="pastIndustry"
                      value={formData.pastIndustry}
                      onChange={handleChange}
                      placeholder="e.g. E-commerce"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="targetSectors">Target Sectors</Label>
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
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Preferences</h3>
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">WhatsApp Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive meeting reminders via WhatsApp
                    </p>
                  </div>
                  <Switch
                    checked={formData.whatsappReminders}
                    onCheckedChange={handleSwitchChange}
                  />
                </FormItem>
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
