import { db } from "@/config/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp
} from "firebase/firestore";

export async function getDashboardStats(userId: string) {
  /* ---------- Classes Today ---------- */
  const classesSnap = await getDocs(
    query(
      collection(db, "classes"),
      where("studentId", "==", userId)
    )
  );

  /* ---------- Tasks (PENDING) ---------- */
  const tasksSnap = await getDocs(
    query(
      collection(db, "tasks"),
      where("userId", "==", userId),
      where("status", "==", "pending")
    )
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tasksDue = tasksSnap.docs.filter((doc) => {
    const data = doc.data();

    if (!data.deadline) return false;

    // deadline is STRING: "2026-01-31"
    const dueDate = new Date(data.deadline);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate >= today;
  });

  const urgentTasks = tasksDue.filter(
    (doc) => doc.data().priority === "high"
  );

  /* ---------- Study Sessions ---------- */
  const sessionsSnap = await getDocs(
    query(
      collection(db, "studySessions"),
      where("userId", "==", userId)
    )
  );

  let totalMinutes = 0;
  const days = new Set<string>();

  sessionsSnap.forEach((doc) => {
    const data = doc.data();
    totalMinutes += data.minutes || 0;
    if (data.date) {
      days.add(new Date(data.date).toDateString());
    }
  });

  return {
    classesToday: classesSnap.size,
    tasksDue: tasksDue.length,
    urgentTasks: urgentTasks.length,
    studyStreak: days.size,
    progressPercent: Math.min(
      100,
      Math.floor((totalMinutes / 600) * 100)
    ),
  };
}
