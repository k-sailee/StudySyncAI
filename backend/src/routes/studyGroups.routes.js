import express from "express";
import auth from "../middleware/auth.js";
import {
  createStudyGroup,
  listStudyGroups,
  getStudyGroup,
  joinStudyGroup,
  sendMessage,
  approveRequest,
  leaveStudyGroup,
  deleteStudyGroup,
} from "../controllers/studyGroups.controller.js";

const router = express.Router();

// Public list (also returns user's private memberships when authenticated)
// Allow unauthenticated access so public groups are visible without a token
// Public list (also returns user's private memberships when authenticated)
// Public endpoint: no auth required to view public groups
router.get("/", listStudyGroups);

// Create group (auth)
router.post("/", auth, createStudyGroup);

// Get details
router.get("/:id", auth, getStudyGroup);

// Join or request to join
router.post("/:id/join", auth, joinStudyGroup);

// Send message (auth required)
router.post("/:id/messages", auth, sendMessage);

// Approve request (organizer)
router.post("/:id/requests/:requestId/approve", auth, approveRequest);

// Leave group
router.post("/:id/leave", auth, leaveStudyGroup);

// Delete group (organizer only)
router.delete("/:id", auth, deleteStudyGroup);

export default router;
