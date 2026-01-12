export interface ProgressMetrics {
  totalStudyMinutes: number;
  dailyStudyMinutes: Record<string, number>;
  currentStreak: number;
  longestStreak: number;
  totalTasksCompleted: number;
  totalTasksAssigned: number;
  completionRate: number;
  totalFocusSessions: number;
  weeklyGoalMinutes: number;
  subjectProgress: {
    subjectId: string;
    name: string;
    completedLessons: number;
    totalLessons: number;
    percentComplete: number;
    studyMinutes: number;
  }[];
}

export interface BadgeData {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  unlocked: boolean;
  progress: number;
  unlockedAt?: number;
}
