
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FeedbackItem {
  id: string;
  sessionType: string;
  studentName: string;
  rating: number;
  comment: string;
}

export const RecentFeedbackList = ({ feedbackData }: { feedbackData: FeedbackItem[] }) => {
  return (
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
  );
};
