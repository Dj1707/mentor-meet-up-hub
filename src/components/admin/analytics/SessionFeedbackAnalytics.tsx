
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { SessionFeedbackSummary } from "@/types/feedback.types";

interface SessionFeedbackAnalyticsProps {
  data: SessionFeedbackSummary;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export const SessionFeedbackAnalytics = ({ data }: SessionFeedbackAnalyticsProps) => {
  // Transform data for charts
  const barChartData = Object.entries(data.sessionTypeStats).map(([type, stats]) => ({
    name: type,
    sessions: stats.count,
    rating: stats.avgRating,
  }));

  const pieChartData = Object.entries(data.sessionTypeStats).map(([type, stats]) => ({
    name: type,
    value: stats.count,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Feedback Ratings by Session Type</CardTitle>
          <CardDescription>
            Average ratings across different session types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#82ca9d"
                  domain={[0, 5]}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="sessions"
                  name="Number of Sessions"
                  fill="#8884d8"
                />
                <Bar
                  yAxisId="right"
                  dataKey="rating"
                  name="Average Rating"
                  fill="#82ca9d"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Session Distribution</CardTitle>
            <CardDescription>
              Percentage breakdown of session types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feedback Summary</CardTitle>
            <CardDescription>
              Overall statistics for feedback received
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">Total Sessions</span>
                <span className="text-xl font-bold">{data.totalSessions}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">Average Rating</span>
                <span className="text-xl font-bold flex items-center">
                  {data.avgRating.toFixed(1)}
                  <span className="text-yellow-500 ml-1">★</span>
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">Session Types</span>
                <span className="text-xl font-bold">
                  {Object.keys(data.sessionTypeStats).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
