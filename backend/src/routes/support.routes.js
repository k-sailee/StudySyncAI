import express from "express";
import { sendSupportEmail, sendSupportEmailTest } from "../controllers/support.controller.js";

const router = express.Router();

// POST /api/support/send -> temporarily use test handler to verify route without email side-effects
router.post("/send", sendSupportEmailTest);

// Optional test-only route (kept for debugging)
router.post("/send-test", sendSupportEmailTest);

export default router;
