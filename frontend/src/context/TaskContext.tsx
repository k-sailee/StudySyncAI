import { createContext, useContext, useState } from "react";
import { Task } from "@/types/task";

type TaskContextType = {
  tasks: Task[];
  setAllTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
};

const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const setAllTasks = (tasksFromDb: Task[]) => {
    setTasks(tasksFromDb);
  };

  const addTask = (task: Task) => {
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

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used inside TaskProvider");
  return ctx;
};
