import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionStatsSummary } from "./SessionStatsSummary";
import { SessionTypeBreakdown } from "./SessionTypeBreakdown";
import { RecentFeedbackList } from "./RecentFeedbackList";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SessionFeedbackSummary } from "@/types/feedback.types";

// Sample data type for feedback items
export interface FeedbackItemProps {
  id: string;
  sessionType: string;
  studentName: string;
  rating: number;
  comment: string;
}

interface SessionSummarySectionProps {
  sessionStats: {
    totalSessions: number;
    avgRating: number;
    sessionsThisMonth: number;
  };
  feedbackByType: {
    [key: string]: { count: number; avg: number };
  };
  recentFeedback: FeedbackItemProps[];
}

export const SessionSummarySection = ({
  sessionStats,
  feedbackByType,
  recentFeedback,
}: SessionSummarySectionProps) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Session Summary</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center"
          >
            {expanded ? (
              <>
                Hide Details
                <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                Show Details
                <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {expanded && (
          <div className="space-y-6">
            <SessionStatsSummary 
              totalSessions={sessionStats.totalSessions} 
              avgRating={sessionStats.avgRating} 
              sessionsThisMonth={sessionStats.sessionsThisMonth} 
            />
            
            {Object.keys(feedbackByType).length > 0 ? (
              <SessionTypeBreakdown feedbackByType={feedbackByType} />
            ) : (
              <div className="text-center p-4 border rounded-md bg-gray-50">
                <p className="text-muted-foreground">No session type data available</p>
              </div>
            )}
            
            {recentFeedback.length > 0 ? (
              <RecentFeedbackList feedbackData={recentFeedback} />
            ) : (
              <div className="text-center p-4 border rounded-md bg-gray-50">
                <p className="text-muted-foreground">No recent feedback available</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
