import express from "express";
import {
generateSchedule,
  createScheduledClass,
  getTeacherClasses,
  getStudentClasses
} from "../controllers/scheduler.controller.js";
const router = express.Router();

router.post("/generate", generateSchedule);

router.post("/class", createScheduledClass);
router.get("/teacher/classes", getTeacherClasses);
router.get("/student/classes", getStudentClasses);

export default router;


