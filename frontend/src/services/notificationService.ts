import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

export const getStudentNotifications = async (studentId: string) => {
  const res = await axios.get(
    `${API_BASE}/api/notifications?studentId=${studentId}`
  );
  return res.data;
};

export const deleteNotification = async (
  studentId: string,
  notificationId: string
) => {
  await axios.delete(
    `${API_BASE}/api/notifications/${studentId}/${notificationId}`
  );
};
