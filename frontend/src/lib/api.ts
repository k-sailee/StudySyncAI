import axios from "axios";

const raw = String(import.meta.env.VITE_API_BASE_URL ?? "").trim();
const normalize = (r: string) => {
  if (!r) return "/api";
  const t = r.replace(/\/+$/, "");
  if (t.endsWith("/api")) return t;
  if (t.includes("://") || t.startsWith("/")) return `${t}/api`;
  return t;
};

export const api = axios.create({
  baseURL: normalize(raw),
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Optional: keep axios defaults in sync for other imports
axios.defaults.baseURL = normalize(raw);
axios.defaults.withCredentials = true;

export default api;
