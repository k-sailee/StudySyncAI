// Lightweight task ONLY for calendar
export interface CalendarTask {
  id: string;
  title: string;
  dueDate: string; // yyyy-mm-dd
  isAssignment?: boolean;
}