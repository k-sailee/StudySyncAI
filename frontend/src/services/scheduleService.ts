import axios from "axios";
import { auth } from "@/config/firebase";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const API = axios.create({
  baseURL: `${API_BASE_URL}/scheduler`,
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
