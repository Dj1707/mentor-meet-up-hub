
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface FeedbackByType {
  [key: string]: {
    count: number;
    avg: number;
  };
}

export const SessionTypeBreakdown = ({ feedbackByType }: { feedbackByType: FeedbackByType }) => {
  return (
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
  );
};
