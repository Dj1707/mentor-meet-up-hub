
import { MentorInvite } from "@/types";
import { toast } from "@/hooks/use-toast";

// In a real application, this would connect to a backend service
// For now, we'll simulate the email sending with console logs and toasts

const generateTemporaryPassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const sendMentorInviteEmail = async (mentorData: MentorInvite): Promise<boolean> => {
  // In a real app, this would make an API call to your email service
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const tempPassword = generateTemporaryPassword();
    
    // Log the email content to console for demo purposes
    console.log('📧 Email sent to:', mentorData.email);
    console.log('Subject: Welcome to Mentor Connect - Your Login Details');
    console.log('Content:');
    console.log(`Dear ${mentorData.name},`);
    console.log(`You have been invited to join Mentor Connect as a mentor.`);
    console.log(`Please use the following credentials to log in:`);
    console.log(`Email: ${mentorData.email}`);
    console.log(`Temporary Password: ${tempPassword}`);
    console.log(`URL: https://mentor-connect.app`);
    console.log(`After logging in, please complete your profile with your professional details and payment information.`);
    
    toast({
      title: "Invitation Email Sent",
      description: `Email with login credentials sent to ${mentorData.email}`,
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send invitation email:', error);
    
    toast({
      title: "Email Sending Failed",
      description: "Could not send invitation email. Please try again later.",
      variant: "destructive"
    });
    
    return false;
  }
};
