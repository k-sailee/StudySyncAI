import axios from "axios";

// Use same-origin proxy in dev/preview (Vite config proxies /api → backend)
// For production builds, set VITE_API_BASE_URL to your backend base.
const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const buildLiveSessionsBase = (raw: string) => {
  const trimmed = raw.replace(/\/+$/, "");
  // No explicit base provided → use dev proxy path
  if (!trimmed) return "/api/live-sessions";
  // If the provided base is exactly "/api" → use dev proxy path
  if (trimmed === "/api") return "/api/live-sessions";
  // If provided base already ends with /api (eg. https://host/api)
  if (trimmed.endsWith("/api")) return `${trimmed}/live-sessions`;
  // Otherwise assume base is host root and append /api
  return `${trimmed}/api/live-sessions`;
};

const api = axios.create({
  baseURL: buildLiveSessionsBase(String(RAW_API_BASE)),
  headers: { "Content-Type": "application/json" },
});

export interface LiveSession {
  id: string;
  sessionName: string;
  sessionUrl: string;
  teacherId: string;
  teacherName?: string;
  teacherEmail?: string;
  createdAt: string;
}

export const createLiveSession = async (payload: {
  sessionName: string;
  sessionUrl: string;
  teacherId: string;
  teacherName?: string;
  teacherEmail?: string;
}): Promise<LiveSession> => {
  const { data } = await api.post("/", payload);
  return data.session;
};

export const getTeacherSessions = async (teacherId: string): Promise<LiveSession[]> => {
  const { data } = await api.get("/teacher", { params: { teacherId } });
  return data.sessions || [];
};

export const getStudentSessions = async (studentId: string): Promise<LiveSession[]> => {
  const { data } = await api.get("/student", { params: { studentId } });
  return data.sessions || [];
};
