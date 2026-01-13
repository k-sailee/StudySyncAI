export type TaskStatus = "pending" | "in-progress" | "completed";
export type TaskPriority = "high" | "medium" | "low";

export interface Task {
  id: string;

  title: string;
  description?: string;
  subject?: string;

  // 🔥 allow both (Firestore + UI safe)
  deadline: string | Date;

  priority: TaskPriority;
  status: TaskStatus;

  progress?: number;

  // 🔥 Scheduler (optional)
  duration?: number;
  scheduledTime?: string;
  endTime?: string;

  // 🔥 Flags
  isAssignment?: boolean;
  isScheduled?: boolean;
}
