import express from "express";
import authenticate from "../middleware/auth.js";
import {
  createAssignment,
  getMyAssignments,
} from "../controllers/assignmentController.js";

const router = express.Router();

// Teacher
router.post("/", authenticate, createAssignment);

// Student
router.get("/my", authenticate, getMyAssignments);

export default router;
