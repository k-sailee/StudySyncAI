import express from "express";
import { sendSupportEmail } from "../controllers/support.controller.js";

const router = express.Router();

// POST /api/support/send
router.post("/send", sendSupportEmail);

export default router;
