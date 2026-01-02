import express from "express";
import {
  searchUsers,
  getUserProfile,
  updateUserProfile,
} from "../controllers/users.controller.js";

const router = express.Router();

// Search users (students or teachers)
router.get("/search", searchUsers);

// Get user profile by UID
router.get("/:uid", getUserProfile);

// Update user profile
router.put("/:uid", updateUserProfile);

export default router;
