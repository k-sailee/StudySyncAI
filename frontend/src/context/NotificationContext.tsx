import { createContext, useContext, useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  createdAt: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  removeNotification: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!user) return;

    const loadNotifications = async () => {
      const snap = await getDocs(
        collection(db, "notifications", user.uid, "items")
      );

      const data = snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as any),
      }));

      setNotifications(data);
    };

    loadNotifications();
  }, [user]);

  const removeNotification = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "notifications", user.uid, "items", id));
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationProvider");
  return ctx;
};
