
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface SessionStatsProps {
  totalSessions: number;
  avgRating: number;
  sessionsThisMonth: number;
}

export const SessionStatsSummary = ({ totalSessions, avgRating, sessionsThisMonth }: SessionStatsProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Session Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{totalSessions}</p>
            <p className="text-sm text-muted-foreground">Total Sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{avgRating.toFixed(1)}</p>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{sessionsThisMonth}</p>
            <p className="text-sm text-muted-foreground">Sessions This Month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
