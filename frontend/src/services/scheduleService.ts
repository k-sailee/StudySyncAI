import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api/scheduler",
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
