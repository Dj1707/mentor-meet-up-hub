
import { SessionType, SubmissionType } from "@/types";

// Centralized session types data
export const sessionTypes: SessionType[] = [
  {
    id: "1",
    name: "Weekly Mock Interview",
    description: "Practice interview scenarios with feedback on your performance and approach.",
    duration: 60,
    price: 40,
    color: "#7c3aed",
    submissionType: "none"
  },
  {
    id: "2",
    name: "Behavioural 1:1",
    description: "Work on behavioral interview skills and practice answering common questions.",
    duration: 45,
    price: 35,
    color: "#0ea5e9",
    submissionType: "none"
  },
  {
    id: "3",
    name: "Data 1:1",
    description: "Review data analysis techniques, SQL queries, and data visualization approaches.",
    duration: 45,
    price: 35,
    color: "#f97316",
    submissionType: "link"
  },
  {
    id: "4",
    name: "Problem Solving 1:1",
    description: "Tackle technical problems with guidance and learn strategies for problem-solving.",
    duration: 60,
    price: 40,
    color: "#10b981",
    submissionType: "none"
  },
  {
    id: "5",
    name: "Portfolio Review 1:1",
    description: "Get detailed feedback on your portfolio with suggestions for improvement.",
    duration: 45,
    price: 35,
    color: "#6366f1",
    submissionType: "portfolio"
  },
  {
    id: "6",
    name: "Resume Review 1:1",
    description: "Have your resume professionally reviewed with actionable feedback.",
    duration: 30,
    price: 25,
    color: "#ec4899",
    submissionType: "resume",
    resources: [
      {
        id: "r1",
        name: "Resume Template",
        url: "https://example.com/resume-template.pdf",
        type: "pdf"
      }
    ]
  },
  {
    id: "7",
    name: "Collateral Review 1:1",
    description: "Get feedback on your business documents, presentations, or other materials.",
    duration: 45,
    price: 30,
    color: "#f43f5e",
    submissionType: "collateral"
  },
  {
    id: "8",
    name: "Office Hour",
    description: "Open discussion for any questions or guidance on your learning journey.",
    duration: 30,
    price: 25,
    color: "#8b5cf6",
    submissionType: "none"
  },
  {
    id: "9",
    name: "Figma 1:1",
    description: "Learn Figma best practices and get help with your design projects.",
    duration: 45,
    price: 35,
    color: "#06b6d4",
    submissionType: "link"
  },
  {
    id: "10",
    name: "Mixpanel 1:1",
    description: "Get guidance on analytics implementation and data interpretation with Mixpanel.",
    duration: 45,
    price: 35,
    color: "#14b8a6",
    submissionType: "link"
  },
  {
    id: "11",
    name: "Notion 1:1",
    description: "Learn how to use Notion effectively for personal or team productivity.",
    duration: 30,
    price: 25,
    color: "#a855f7",
    submissionType: "link"
  },
  {
    id: "12",
    name: "Product Overview 1:1",
    description: "General product consultation and strategy discussions.",
    duration: 60,
    price: 45,
    color: "#d946ef",
    submissionType: "none"
  },
  {
    id: "13",
    name: "SQL 1:1",
    description: "Learn SQL queries, database design, and optimization techniques.",
    duration: 45,
    price: 35,
    color: "#6b7280",
    submissionType: "link"
  }
];

// Helper functions
export const getSessionTypeById = (id: string): SessionType | undefined => {
  return sessionTypes.find(type => type.id === id);
};

export const getSessionTypesBySubmissionType = (submissionType: SubmissionType): SessionType[] => {
  return sessionTypes.filter(type => type.submissionType === submissionType);
};

export const getSessionTypesRequiringSubmission = (): SessionType[] => {
  return sessionTypes.filter(type => type.submissionType && type.submissionType !== "none");
};
