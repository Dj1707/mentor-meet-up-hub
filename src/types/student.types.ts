
export interface StudentProfile {
  name: string;
  email: string;
  phone?: string;
  linkedIn?: string;
  profilePicture?: string;
  targetRole?: string;
  targetDomain?: string;
  targetCTC?: string;
  targetSectors?: string[];
  pastJobRole?: string;
  pastIndustry?: string;
  resumeUrl?: string;
  whatsappReminders?: boolean;
}
