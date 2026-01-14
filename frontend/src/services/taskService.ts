import axios from "axios";
import { auth } from "@/config/firebase";

const RAW_API_BASE = String(import.meta.env.VITE_API_BASE_URL ?? "").trim();

const normalizeBaseHost = (raw: string) => {
  const trimmed = String(raw).replace(/\/+$/, "");
  if (!trimmed) return "https://studysyncai-xc64.onrender.com/api";
  if (trimmed === "/api") return "/api";
  if (trimmed.endsWith("/api")) return trimmed;
  if (trimmed.includes("://")) return `${trimmed}/api`;
  return `${trimmed}/api`;
};

const API_URL = `${normalizeBaseHost(RAW_API_BASE)}/tasks`;

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
