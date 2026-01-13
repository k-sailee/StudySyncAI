import axios from "axios";
import { auth } from "@/config/firebase";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/tasks`;

export const getMyTasks = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const token = await user.getIdToken();

  const res = await axios.get(`${API_URL}/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
