import { db } from "../config/firebase.js";

/**
 * Create a new connection request
 * POST /api/connections
 */
export const createConnection = async (req, res) => {
  try {
    const { studentId, teacherId, message, requestedBy } = req.body;

    if (!studentId || !teacherId) {
      return res.status(400).json({
        success: false,
        message: "Student ID and Teacher ID are required",
      });
    }

    // Check if connection already exists
    const existingConnection = await db
      .collection("connections")
      .where("studentId", "==", studentId)
      .where("teacherId", "==", teacherId)
      .get();

    if (!existingConnection.empty) {
      const existingDoc = existingConnection.docs[0];
      const existingData = existingDoc.data();
      
      if (existingData.status === "pending" || existingData.status === "accepted") {
        return res.status(400).json({
          success: false,
          message: "Connection request already exists",
          connectionId: existingDoc.id,
          status: existingData.status,
        });
      }
    }

    // Create new connection
    const connectionData = {
      studentId,
      teacherId,
      requestedBy: requestedBy || studentId,
      message: message || "",
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const connectionRef = await db.collection("connections").add(connectionData);

    res.status(201).json({
      success: true,
      message: "Connection request sent successfully",
      connectionId: connectionRef.id,
      connection: connectionData,
    });
  } catch (error) {
    console.error("Create connection error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create connection",
      error: error.message,
    });
  }
};

/**
 * Get all connections for a user
 * GET /api/connections?userId=xxx&role=student|teacher
 */
export const getConnections = async (req, res) => {
  try {
    const { userId, role, status } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Query based on role
    const fieldToQuery = role === "teacher" ? "teacherId" : "studentId";
    let query = db.collection("connections").where(fieldToQuery, "==", userId);

    if (status) {
      query = query.where("status", "==", status);
    }

    const snapshot = await query.orderBy("createdAt", "desc").get();

    const connections = [];
    const userIds = new Set();

    snapshot.forEach((doc) => {
      const data = doc.data();
      connections.push({
        id: doc.id,
        ...data,
      });
      
      // Collect user IDs to fetch their details
      userIds.add(data.studentId);
      userIds.add(data.teacherId);
    });

    // Fetch user details for all connections
    const usersMap = {};
    for (const uid of userIds) {
      const userDoc = await db.collection("users").doc(uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        usersMap[uid] = {
          uid,
          displayName: userData.displayName,
          email: userData.email,
          role: userData.role,
          profileImage: userData.profileImage,
        };
      }
    }

    // Enrich connections with user details
    const enrichedConnections = connections.map((conn) => ({
      ...conn,
      student: usersMap[conn.studentId] || { uid: conn.studentId },
      teacher: usersMap[conn.teacherId] || { uid: conn.teacherId },
    }));

    res.json({
      success: true,
      connections: enrichedConnections,
      total: enrichedConnections.length,
    });
  } catch (error) {
    console.error("Get connections error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get connections",
      error: error.message,
    });
  }
};

/**
 * Update connection status (accept/reject)
 * PUT /api/connections/:connectionId
 */
export const updateConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const { status } = req.body;

    if (!connectionId) {
      return res.status(400).json({
        success: false,
        message: "Connection ID is required",
      });
    }

    if (!status || !["accepted", "rejected", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Valid status is required (accepted, rejected, cancelled)",
      });
    }

    const connectionRef = db.collection("connections").doc(connectionId);
    const connectionDoc = await connectionRef.get();

    if (!connectionDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Connection not found",
      });
    }

    await connectionRef.update({
      status,
      updatedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: `Connection ${status} successfully`,
    });
  } catch (error) {
    console.error("Update connection error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update connection",
      error: error.message,
    });
  }
};

/**
 * Delete a connection
 * DELETE /api/connections/:connectionId
 */
export const deleteConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;

    if (!connectionId) {
      return res.status(400).json({
        success: false,
        message: "Connection ID is required",
      });
    }

    const connectionRef = db.collection("connections").doc(connectionId);
    const connectionDoc = await connectionRef.get();

    if (!connectionDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Connection not found",
      });
    }

    await connectionRef.delete();

    res.json({
      success: true,
      message: "Connection deleted successfully",
    });
  } catch (error) {
    console.error("Delete connection error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete connection",
      error: error.message,
    });
  }
};
