
export interface ActionItem {
  id: string;
  sessionId: string;
  text: string;
  isCompleted: boolean;
  createdAt: Date;
  completedAt?: Date;
}
