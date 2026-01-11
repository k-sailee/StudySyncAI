import express from "express";
import auth from "../middleware/auth.js";
import { db } from "../config/firebase.js";
import {
  createStudyGroup,
  listStudyGroups,
  getStudyGroup,
  joinStudyGroup,
  approveRequest,
  leaveStudyGroup,
} from "../controllers/studyGroups.controller.js";

const router = express.Router();

// Create group
router.post("/", auth, createStudyGroup);

// Public groups - returns public groups (and user's groups if authenticated)
router.get("/public", auth, listStudyGroups);

// Join public
router.post("/:groupId/join", auth, joinStudyGroup);

// Request to join private (same as join endpoint for private)
router.post("/:groupId/request", auth, joinStudyGroup);

// Approve and reject
router.post("/:groupId/approve/:requestId", auth, approveRequest);
router.post("/:groupId/reject/:requestId", auth, async (req, res) => {
  try {
    const { groupId, requestId } = req.params;
    const userId = req.user?.id;
    const groupRef = db.collection("studyGroups").doc(groupId);
    const groupDoc = await groupRef.get();
    if (!groupDoc.exists) return res.status(404).json({ success: false, message: "Group not found" });
    const group = groupDoc.data();
    if (group.organizerId !== userId) return res.status(403).json({ success: false, message: "Only organizer can reject" });
    await groupRef.collection("requests").doc(requestId).delete();
    res.json({ success: true, message: "Request rejected" });
  } catch (err) {
    console.error("Reject request error:", err);
    res.status(500).json({ success: false, message: "Failed to reject request", error: err.message });
  }
});

export default router;
