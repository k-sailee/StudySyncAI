import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  createClass,
  getTeacherClasses,
  getStudentClasses,
} from "@/services/scheduleService";

export interface ScheduledClass {
  id: string;
  subject: string;
  topics: string;
  date: string;
  time: string;
  students: string[];
  teacherEmail: string;
  teacherId: string;
}

interface ScheduleContextType {
  classes: ScheduledClass[];
  todayClassesCount: number;
  addClass: (cls: ScheduledClass) => Promise<void>;
}

const ScheduleContext = createContext<ScheduleContextType | null>(null);

export const ScheduleProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ScheduledClass[]>([]);

const today = new Date().toISOString().split("T")[0];

const todayClassesCount = classes.filter(
  (cls) => cls.date === today
).length;

  // ✅ LOAD CLASSES FROM BACKEND
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        if (user.role === "teacher") {
            console.log("[FRONTEND] Loading teacher classes from Firestore...");
          const data = await getTeacherClasses(user.email!);
          console.log("[FRONTEND] Teacher classes loaded:", data);
          setClasses(data);
        } else {
            console.log("[FRONTEND] Loading student classes from Firestore...");
          const data = await getStudentClasses(user.uid);
          console.log("[FRONTEND] Student classes loaded:", data);
          setClasses(data);
        }
      } catch (err) {
        console.error("Failed to load classes", err);
      }
    };

    load();
  }, [user]);

  // ✅ SAVE CLASS TO BACKEND
const addClass = async (cls: ScheduledClass) => {
  try {
    console.log("[FRONTEND] Sending class to backend:", cls);
    const res = await createClass(cls);
    console.log("[FRONTEND] Backend response:", res);

    // ❗ TEMP: DO NOT optimistic update
    // setClasses((prev) => [...prev, cls]);

    // Reload from backend instead
    if (user?.role === "teacher") {
      const data = await getTeacherClasses(user.email!);
      setClasses(data);
    }
  } catch (err) {
    console.error("Failed to save class", err);
  }
};


  return (
    <ScheduleContext.Provider
  value={{
    classes,
    todayClassesCount,
    addClass,
  }}
>

      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const ctx = useContext(ScheduleContext);
  if (!ctx) throw new Error("useSchedule must be used inside ScheduleProvider");
  return ctx;
};
