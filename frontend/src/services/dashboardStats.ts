import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";

/* ---------- Study Streak ---------- */
export async function getStudyStreak(userId: string) {
  const sessionsRef = collection(db, "studySessions");

  const q = query(sessionsRef, where("userId", "==", userId));
  const snap = await getDocs(q);

  const dates = snap.docs.map(doc =>
    doc.data().createdAt.toDate().toDateString()
  );

  const uniqueDays = Array.from(new Set(dates))
    .map(d => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  let current = new Date();
  current.setHours(0, 0, 0, 0);

  for (const day of uniqueDays) {
    if (day.getTime() === current.getTime()) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/* ---------- Progress ---------- */
export async function getProgress(userId: string) {
  const tasksRef = collection(db, "tasks");

  const q = query(tasksRef, where("userId", "==", userId));
  const snap = await getDocs(q);

  const total = snap.size;
  const completed = snap.docs.filter(
    d => d.data().status === "completed"
  ).length;

  return total === 0 ? 0 : Math.round((completed / total) * 100);
}
