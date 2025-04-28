
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      <div>
        <h3 className="text-lg font-medium mb-4">Session Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-2xl font-bold">{sessionStats.totalSessions}</p>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-2xl font-bold">{sessionStats.avgRating.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-2xl font-bold">{sessionStats.sessionsThisMonth}</p>
              <p className="text-sm text-muted-foreground">Sessions This Month</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Session Type Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {Object.entries(feedbackByType).map(([type, data]) => (
            <Card key={type}>
              <CardContent className="pt-6">
                <h4 className="font-medium">{type}</h4>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-lg ${i < Math.round(data.avg) ? "text-yellow-500" : "text-gray-300"}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {data.avg.toFixed(1)} ({data.count} sessions)
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Recent Feedback</h3>
        <div className="space-y-4">
          {feedbackData.map(feedback => (
            <Card key={feedback.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {feedback.sessionType}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{feedback.studentName}</p>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-lg ${i < feedback.rating ? "text-yellow-500" : "text-gray-300"}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm">{feedback.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

