import express from "express";
import { askDoubt } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/ask", askDoubt);

export default router;
