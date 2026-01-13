export type UITask = {
  id: string;
  title: string;
  subject?: string;
  deadline: Date;              // 🔥 Date for UI
  priority: "low" | "medium" | "high";
  status: string;
  isAssignment: boolean;

  // optional fields (tasks only)
  description?: string;
  progress?: number;
  createdAt?: string;
};
