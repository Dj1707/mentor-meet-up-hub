
import { MentorInvite } from "@/types";
import { toast } from "@/hooks/use-toast";
import { Session } from "@/types/session.types";
import { format } from "date-fns";

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

/**
 * Generate an ICS file content for calendar invitations
 */
const generateICSContent = (session: Session, meetingLink?: string): string => {
  const startDate = new Date(session.startTime);
  const endDate = new Date(session.endTime);
  
  // Format dates for ICS
  const formatICSDate = (date: Date) => {
    return format(date, "yyyyMMdd'T'HHmmss'Z'");
  };
  
  const now = new Date();
  const sessionTypeName = session.sessionType?.name || "Mentoring Session";
  
  // Build the ICS content
  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mentor Connect//Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `DTSTART:${formatICSDate(startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `DTSTAMP:${formatICSDate(now)}`,
    `UID:${session.id}@mentorconnect.app`,
    `SUMMARY:${sessionTypeName}`,
    'STATUS:CONFIRMED',
  ];
  
  if (meetingLink) {
    ics.push(`DESCRIPTION:Join the meeting: ${meetingLink}`);
    ics.push(`LOCATION:${meetingLink}`);
  }
  
  ics = [
    ...ics,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder',
    'TRIGGER:-PT15M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ];
  
  return ics.join('\r\n');
};

// In a production environment, this would use a proper email service API
// For demonstration purposes, we are logging to the console
export const sendMentorInviteEmail = async (mentorData: MentorInvite): Promise<boolean> => {
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

/**
 * Send session booking confirmation emails with calendar invites
 */
export const sendSessionBookingEmails = async (
  session: Session, 
  studentEmail: string, 
  mentorEmail: string,
  meetingLink?: string
): Promise<boolean> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const sessionDate = format(new Date(session.startTime), "MMM d, yyyy");
    const sessionTime = `${format(new Date(session.startTime), "h:mm a")} - ${format(new Date(session.endTime), "h:mm a")}`;
    const sessionType = session.sessionType?.name || "Mentoring Session";
    
    // Generate ICS content for calendar invite
    const icsContent = generateICSContent(session, meetingLink);
    
    // Email to student
    console.log('📧 Email sent to:', studentEmail);
    console.log('Subject: Your Session is Confirmed');
    console.log('Content:');
    console.log(`Dear Student,`);
    console.log(`Your ${sessionType} has been confirmed for ${sessionDate} at ${sessionTime}.`);
    
    if (meetingLink) {
      console.log(`Meeting Link: ${meetingLink}`);
    }
    
    console.log('Attachment: calendar-invite.ics');
    
    // Email to mentor
    console.log('📧 Email sent to:', mentorEmail);
    console.log('Subject: New Session Scheduled');
    console.log('Content:');
    console.log(`Dear Mentor,`);
    console.log(`A ${sessionType} has been scheduled for ${sessionDate} at ${sessionTime}.`);
    
    if (meetingLink) {
      console.log(`Meeting Link: ${meetingLink}`);
    }
    
    console.log('Attachment: calendar-invite.ics');
    
    toast({
      title: "Confirmation Emails Sent",
      description: "Session details and calendar invites have been sent to all participants.",
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send booking emails:', error);
    
    toast({
      title: "Email Sending Failed",
      description: "Could not send confirmation emails. The session is still booked.",
      variant: "destructive"
    });
    
    return false;
  }
};

/**
 * Send session updated emails
 */
export const sendSessionUpdatedEmails = async (
  session: Session, 
  studentEmail: string, 
  mentorEmail: string,
  meetingLink?: string
): Promise<boolean> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const sessionDate = format(new Date(session.startTime), "MMM d, yyyy");
    const sessionTime = `${format(new Date(session.startTime), "h:mm a")} - ${format(new Date(session.endTime), "h:mm a")}`;
    const sessionType = session.sessionType?.name || "Mentoring Session";
    
    // Generate updated ICS content
    const icsContent = generateICSContent(session, meetingLink);
    
    // Log emails for simulation
    console.log('📧 Email sent to:', studentEmail, mentorEmail);
    console.log('Subject: Session Details Updated');
    console.log('Content: Your session has been updated to', sessionDate, sessionTime);
    console.log('Attachment: updated-calendar-invite.ics');
    
    toast({
      title: "Update Emails Sent",
      description: "Updated session details have been sent to all participants.",
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send update emails:', error);
    return false;
  }
};

/**
 * Send session cancellation emails
 */
export const sendSessionCancellationEmails = async (
  session: Session,
  studentEmail: string,
  mentorEmail: string
): Promise<boolean> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const sessionDate = format(new Date(session.startTime), "MMM d, yyyy");
    const sessionTime = `${format(new Date(session.startTime), "h:mm a")}`;
    const sessionType = session.sessionType?.name || "Mentoring Session";
    
    // Log emails for simulation
    console.log('📧 Email sent to:', studentEmail, mentorEmail);
    console.log('Subject: Session Cancelled');
    console.log(`Content: The ${sessionType} scheduled for ${sessionDate} at ${sessionTime} has been cancelled.`);
    console.log('Attachment: cancel-calendar-event.ics');
    
    toast({
      title: "Cancellation Emails Sent",
      description: "Cancellation notifications have been sent to all participants.",
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send cancellation emails:', error);
    return false;
  }
};
