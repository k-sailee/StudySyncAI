import express from "express";
import {
  getStudentNotifications,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

// GET all notifications for student
router.get("/", getStudentNotifications);

// DELETE notification after read
router.delete("/:studentId/:notificationId", deleteNotification);

export default router;
