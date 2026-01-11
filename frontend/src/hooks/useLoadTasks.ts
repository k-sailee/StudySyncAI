import { useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAuth } from "@/context/AuthContext";
import { useTasks } from "@/context/TaskContext";
import { getStudentAssignments } from "@/services/assignmentService";
import { Task, TaskPriority, TaskStatus } from "@/types/task";

export function useLoadTasks() {
  const { user } = useAuth();
  const { setAllTasks } = useTasks();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      /** 🔹 PERSONAL TASKS */
      const personalTasks: Task[] = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          title: data.title,
          subject: data.subject || "General",
          description: data.description || "",
          deadline: data.deadline,

          priority: (data.priority || "medium") as TaskPriority,
          status: (data.status || "pending") as TaskStatus,
          progress: data.progress ?? 0,

          createdAt: data.createdAt || null,

          scheduledTime: data.scheduledTime,
          endTime: data.endTime,
          duration: data.duration,
          category: data.category,
          isScheduled: data.isScheduled || false,

          isAssignment: false,
        };
      });

      /** 🔹 ASSIGNMENTS */
      const assignments = await getStudentAssignments(user.uid);

      const assignmentTasks: Task[] = assignments.map((a: any) => ({
        id: a.id,
        title: a.title,
        subject: a.subject || "General",
        description: a.description || "",
        deadline: a.dueDate,

        priority: "medium", // ✅ now literal-safe
        status: (a.status || "pending") as TaskStatus,
        progress: a.status === "completed" ? 100 : 0,

        createdAt: a.createdAt || null,

        isAssignment: true,
      }));

      /** 🔹 STORE EVERYTHING */
      setAllTasks([...personalTasks, ...assignmentTasks]);
    });

    return () => unsubscribe();
  }, [user, setAllTasks]);
}
