
import React from "react";
import { SessionStatsSummary } from "@/components/student/sessions/SessionStatsSummary";
import { SessionTypeBreakdown } from "@/components/student/sessions/SessionTypeBreakdown";
import { RecentFeedbackList } from "@/components/student/sessions/RecentFeedbackList";

export const StudentFeedbackDisplay = () => {
  // Sample data - replace with actual API call in production
  const sessionStats = {
    totalSessions: 33,
    avgRating: 4.7,
    sessionsThisMonth: 5
  };

  const feedbackByType = {
    "Career Guidance": { count: 10, avg: 4.8 },
    "Technical Interview": { count: 15, avg: 4.5 },
    "Resume Review": { count: 8, avg: 4.9 }
  };

  const feedbackData = [
    {
      id: "1",
      sessionType: "Career Guidance",
      studentName: "Alex Johnson",
      rating: 5,
      comment: "Really helpful session! The mentor provided excellent guidance for my career transition."
    },
    {
      id: "2",
      sessionType: "Technical Interview",
      studentName: "Jamie Rivera",
      rating: 4,
      comment: "Good technical advice, but would have liked more practical examples."
    },
    {
      id: "3",
      sessionType: "Resume Review",
      studentName: "Casey Kim",
      rating: 5,
      comment: "The mentor gave me excellent feedback on my resume. I've already gotten more interview invitations!"
    }
  ];

  return (
    <div className="space-y-6">
      <SessionStatsSummary {...sessionStats} />
      <SessionTypeBreakdown feedbackByType={feedbackByType} />
      <RecentFeedbackList feedbackData={feedbackData} />
    </div>
  );
};
