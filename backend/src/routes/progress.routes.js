import express from "express";
import auth from "../middleware/auth.js";

import {
  getProgressMetrics,
  getProgressBadges,
  completeFocusSession
} from "../controllers/progress.controller.js";

const router = express.Router();

router.get("/metrics", auth, getProgressMetrics);
router.get("/badges", auth, getProgressBadges);
router.post("/focus-complete", auth, completeFocusSession);

export default router;
