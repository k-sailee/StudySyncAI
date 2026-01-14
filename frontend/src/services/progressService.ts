import { auth } from "@/config/firebase";
import axios from "axios";

const API_PREFIX = "/progress"; // will be combined with axios base (/api or host/api)

/* ---------------- METRICS ---------------- */
export const getProgressMetrics = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const token = await user.getIdToken();
  const { data } = await axios.get(`${API_PREFIX}/metrics`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

/* ---------------- BADGES ---------------- */
export const getProgressBadges = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const token = await user.getIdToken();
  const { data } = await axios.get(`${API_PREFIX}/badges`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

/* ---------------- FOCUS COMPLETE ---------------- */
export const completeFocusSession = async (minutes: number) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const token = await user.getIdToken();
  const { data } = await axios.post(
    `${API_PREFIX}/focus-complete`,
    { minutes },
    { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
  );
  return data;
};
