import { api } from "@/lib/api";

// Use shared axios base (setupAxios.ts) so baseURL already points to /api when configured
export const getStudentNotifications = async (studentId: string) => {
  const res = await api.get(`/notifications`, { params: { studentId } });
  return res.data;
};

export const deleteNotification = async (
  studentId: string,
  notificationId: string
) => {
  await api.delete(`/notifications/${studentId}/${notificationId}`);
};
