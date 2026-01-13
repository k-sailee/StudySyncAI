import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebase";
import { UITask } from "@/types/ui-task";


/* ---------- Context Types ---------- */
type TaskContextType = {
  tasks: UITask[];
  setAllTasks: (tasks: UITask[]) => void;
  addTask: (task: UITask) => void;
};


const TaskContext = createContext<TaskContextType | null>(null);


function normalizeAssignment(doc: any): UITask {
  let deadline: Date | null = null;

  // Case 1: Firestore Timestamp (new data)
  if (doc.dueDate instanceof Timestamp) {
    deadline = doc.dueDate.toDate();
  }
  // Case 2: string date (old data)
  else if (typeof doc.dueDate === "string") {
    deadline = new Date(doc.dueDate);
  }

  if (!deadline || isNaN(deadline.getTime())) {
    throw new Error(`Invalid dueDate for assignment ${doc.id}`);
  }

  return {
    id: doc.id,
    title: doc.title,
    subject: doc.subject,
    deadline,
    priority: "medium",
    status: doc.status ?? "pending",
    isAssignment: true,
  };
}

function normalizeTask(doc: any): UITask {
  return {
    id: doc.id,
    title: doc.title,
    description: doc.description,
    subject: doc.subject,
    deadline: new Date(doc.deadline), // Date ✅
    priority: doc.priority ?? "low",
    status: doc.status ?? "pending",
    progress: doc.progress ?? 0,
    createdAt: doc.createdAt,
    isAssignment: false,
  };
}


/* ---------- Provider ---------- */
export function TaskProvider({ children }: { children: React.ReactNode }) {
const [tasks, setTasks] = useState<UITask[]>([]);

  useEffect(() => {
    const loadAllTasks = async () => {
      // 🔹 Load normal tasks
      const tasksSnap = await getDocs(collection(db, "tasks"));
      const normalTasks = tasksSnap.docs.map((d) =>
        normalizeTask({ id: d.id, ...d.data() })
      );

      // 🔹 Load assignments
      const assignmentsSnap = await getDocs(collection(db, "assignments"));
      const assignments = assignmentsSnap.docs.map((d) =>
        normalizeAssignment({ id: d.id, ...d.data() })
      );

      // 🔥 Merge both
      setTasks([...normalTasks, ...assignments]);
    };

    loadAllTasks();
  }, []);

 const setAllTasks = (tasksFromDb: UITask[]) => {
  setTasks(tasksFromDb);
};

const addTask = (task: UITask) => {
  setTasks((prev) =>
    prev.some((t) => t.id === task.id) ? prev : [...prev, task]
  );
};


  return (
    <TaskContext.Provider value={{ tasks, setAllTasks, addTask }}>
      {children}
    </TaskContext.Provider>
  );
}

/* ---------- Hook ---------- */
export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used inside TaskProvider");
  return ctx;
};
