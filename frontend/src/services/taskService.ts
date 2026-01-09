import axios from "axios";
import { auth } from "@/config/firebase";

const API_URL = "http://localhost:8080/api/tasks";

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
