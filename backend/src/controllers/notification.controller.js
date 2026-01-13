import { db } from "../config/firebase.js";

/**
 * Get notifications for a student
 */
export const getStudentNotifications = async (req, res) => {
  try {
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ message: "studentId is required" });
    }

    const snapshot = await db
      .collection("notifications")
      .doc(studentId)
      .collection("items")
      .orderBy("createdAt", "desc")
      .get();

    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(notifications);
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

/**
 * Delete a notification (after seen)
 */
export const deleteNotification = async (req, res) => {
  try {
    const { studentId, notificationId } = req.params;

    if (!studentId || !notificationId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    await db
      .collection("notifications")
      .doc(studentId)
      .collection("items")
      .doc(notificationId)
      .delete();

    res.json({ success: true });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ message: "Failed to delete notification" });
  }
};
