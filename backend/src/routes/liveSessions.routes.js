import express from "express";
import {
  createLiveSession,
  getTeacherSessions,
  getStudentSessions,
} from "../controllers/liveSessions.controller.js";

const router = express.Router();

router.post("/", createLiveSession);
router.get("/teacher", getTeacherSessions);
router.get("/student", getStudentSessions);

export default router;
