import express from "express";
import {
  createConnection,
  getConnections,
  updateConnection,
  deleteConnection,
} from "../controllers/connections.controller.js";

const router = express.Router();

// Create a new connection request
router.post("/", createConnection);

// Get all connections for a user
router.get("/", getConnections);

// Update connection status (accept/reject)
router.put("/:connectionId", updateConnection);

// Delete a connection
router.delete("/:connectionId", deleteConnection);

export default router;
