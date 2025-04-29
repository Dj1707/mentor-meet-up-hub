
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { MentorInvite, MentorRate } from "@/types";
import { Send } from "lucide-react";

interface MentorAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMentorInvite: (mentor: MentorInvite) => void;
  sessionTypes: { id: string; name: string; price: number }[];
  onOpenSessionRates: (mentorData: { id?: string; name: string; email: string }) => void;
}

const MentorAddDialog = ({ 
  open, 
  onOpenChange, 
  onMentorInvite,
  sessionTypes,
  onOpenSessionRates 
}: MentorAddDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<MentorInvite>({
    defaultValues: {
      email: "",
      name: "",
      jobTitle: "",
      company: ""
    }
  });

  const handleSubmit = async (data: MentorInvite) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      // Open the session rates dialog with the mentor data
      onOpenSessionRates({
        name: data.name,
        email: data.email
      });
      
      // Close this dialog as we'll proceed to the session rates dialog
      onOpenChange(false);
      
      toast({
        title: "Mentor details saved",
        description: "Please configure session eligibility and rates"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save mentor details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const proceedWithoutSettings = () => {
    const data = form.getValues();
    if (!data.name || !data.email) {
      toast({
        title: "Required fields missing",
        description: "Please fill in at least name and email",
        variant: "destructive"
      });
      return;
    }

    onMentorInvite(data);
    onOpenChange(false);
    
    toast({
      title: "Invitation Sent",
      description: "The mentor will receive an email with login credentials"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Mentor</DialogTitle>
          <DialogDescription>
            Enter mentor details to send them an invitation
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address*</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="mentor@example.com" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Senior Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Tech Company Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="flex justify-between sm:justify-between pt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={proceedWithoutSettings}
              >
                Skip Session Setup
              </Button>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="gap-1"
              >
                Configure Sessions
                {!isSubmitting && <Send className="ml-1 h-4 w-4" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MentorAddDialog;
