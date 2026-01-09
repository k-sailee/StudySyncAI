import express from "express";
import authenticate from "../middleware/auth.js";
import {
  createTask,
  getMyTasks,
} from "../controllers/taskController.js";

const router = express.Router();

router.post("/", authenticate, createTask);
router.get("/my", authenticate, getMyTasks);

export default router;
