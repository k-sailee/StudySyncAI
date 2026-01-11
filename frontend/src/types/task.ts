import { Timestamp } from "firebase/firestore";

export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "pending" | "in-progress" | "completed";

export interface Task {
  id: string;
  title: string;
  subject: string;
  description: string;
  deadline: string; // yyyy-mm-dd

  priority: TaskPriority;
  status: TaskStatus;
  progress: number;

  createdAt: Timestamp | null;

  scheduledTime?: string;
  endTime?: string;
  duration?: number;
  category?: string;
  isScheduled?: boolean;

  isAssignment?: boolean;
  fileUrl?: string;
}
