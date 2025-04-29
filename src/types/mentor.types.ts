
export interface MentorProfile {
  name: string;
  email: string;
  phone?: string;
  linkedIn?: string;
  profilePicture?: string;
  jobTitle?: string;
  role?: string;
  company?: string;
  bio?: string;
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
  }[];
}
