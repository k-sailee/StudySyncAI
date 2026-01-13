import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/config/firebase";

export function useProgress(userId?: string) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", userId)
    );

    return onSnapshot(q, snap => {
      const total = snap.size;
      const completed = snap.docs.filter(
        d => d.data().status === "completed"
      ).length;

      setProgress(total === 0 ? 0 : Math.round((completed / total) * 100));
    });
  }, [userId]);

  return progress;
}
