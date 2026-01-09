import { Timestamp } from "firebase/firestore";

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  status: "pending" | "completed";
  assignedBy: string;
  assignedTo: string;
  createdAt: Timestamp;
  fileUrl?: string;
  totalMarks?: number;
}
