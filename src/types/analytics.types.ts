
export interface AnalyticsData {
  totalSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  noShowSessions: number;
  totalMentors: number;
  totalStudents: number;
  sessionsPerType: {
    sessionTypeId: string;
    count: number;
  }[];
  sessionsPerDay: {
    date: string;
    count: number;
  }[];
}
