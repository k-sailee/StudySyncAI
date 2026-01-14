import axios from "axios";
import { auth } from "@/config/firebase";

const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const buildSchedulerBase = (raw: string) => {
  const trimmed = String(raw).replace(/\/+$/, "");
  if (!trimmed) return "/api/scheduler";
  if (trimmed === "/api") return "/api/scheduler";
  if (trimmed.endsWith("/api")) return `${trimmed}/scheduler`;
  return `${trimmed}/api/scheduler`;
};

const API = axios.create({
  baseURL: buildSchedulerBase(RAW_API_BASE),
});

// Add auth token to requests
API.interceptors.request.use(async (config) => {
  const token = await auth.currentUser?.getIdToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createClass = async (data: any) => {
  const res = await API.post("/class", data);
  return res.data;
};

export const getTeacherClasses = async (teacherEmail: string) => {
  const res = await API.get("/teacher/classes", {
    params: { teacherEmail },
  });
  return res.data;
};

export const getStudentClasses = async (studentId: string) => {
  const res = await API.get("/student/classes", {
    params: { studentId },
  });
  return res.data;
};

