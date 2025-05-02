
export interface MentorProfile {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  linkedIn?: string;
  profilePicture?: string;
  jobTitle?: string;
  role?: string;
  company?: string;
  bio?: string;
  rating?: number; 
  sessionCount?: number;
  expertise?: string[];
  panNumber?: string;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  pastSectors?: string[];
  onboardingStatus?: "invited" | "active" | "inactive" | "pending";
  availability?: {
    date: string;
    slots: string[];
  }[];
}

export interface MentorRate {
  mentorId: string;
  sessionTypeId: string;
  rate: number;
  isEligible: boolean;
}

export interface MentorSessionEligibility {
  mentorId: string;
  eligibleSessionTypes: {
    sessionTypeId: string;
    rate: number;
    isEligible?: boolean;
  }[];
}

export interface MentorInvite {
  email: string;
  name: string;
  jobTitle?: string;
  company?: string;
  sessionRates?: MentorRate[];
}
