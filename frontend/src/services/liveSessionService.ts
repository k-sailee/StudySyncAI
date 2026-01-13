import axios from "axios";

// Use same-origin proxy in dev/preview (Vite config proxies /api → backend)
// For production builds, set VITE_API_BASE_URL to your backend base.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/live-sessions`,
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
