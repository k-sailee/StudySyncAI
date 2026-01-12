import { db } from "../config/firebase.js";
import admin from "../config/firebase.js";

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

    // Also store lightweight references under each user's subcollection
    // so UI or other endpoints can easily fetch per-user connection lists.
    try {
      const userConnDataForStudent = {
        connectionId: connectionRef.id,
        studentId,
        teacherId,
        role: "student",
        status: "pending",
        requestedBy: connectionData.requestedBy,
        createdAt: connectionData.createdAt,
        updatedAt: connectionData.updatedAt,
      };

      const userConnDataForTeacher = {
        connectionId: connectionRef.id,
        studentId,
        teacherId,
        role: "teacher",
        status: "pending",
        requestedBy: connectionData.requestedBy,
        createdAt: connectionData.createdAt,
        updatedAt: connectionData.updatedAt,
      };

      await Promise.all([
        db.collection("users").doc(studentId).collection("connections").doc(connectionRef.id).set(userConnDataForStudent),
        db.collection("users").doc(teacherId).collection("connections").doc(connectionRef.id).set(userConnDataForTeacher),
      ]);
    } catch (err) {
      console.error("Failed to write user subcollection connection refs:", err);
      // Not fatal for primary operation — fallthrough and return created response
    }

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

    // Query based on role (teacherId or studentId)
    const fieldToQuery = role === "teacher" ? "teacherId" : "studentId";

    // We prefer reading per-user refs from users/{userId}/connections which avoids
    // composite-index requirements on the top-level `connections` collection.
    const connections = [];
    const userIds = new Set();

    let usedUserSubcollection = false;
    try {
      const userConnRef = db.collection("users").doc(userId).collection("connections");
      let userConnQuery = userConnRef;
      if (status) userConnQuery = userConnQuery.where("status", "==", status);

      const userConnSnap = await userConnQuery.orderBy("createdAt", "desc").get();
      if (!userConnSnap.empty) {
        usedUserSubcollection = true;

        // Fetch the main connection docs for each reference (if present)
        // Avoid N+1 `.get()` calls by batching `in` queries (10 ids per chunk)
        const connectionIds = userConnSnap.docs.map((d) => d.data().connectionId).filter(Boolean);
        const connDocMap = {};
        if (connectionIds.length) {
          for (let i = 0; i < connectionIds.length; i += 10) {
            const chunk = connectionIds.slice(i, i + 10);
            const snap = await db.collection("connections").where(admin.firestore.FieldPath.documentId(), "in", chunk).get();
            snap.forEach((doc) => {
              connDocMap[doc.id] = doc;
            });
          }
        }

        userConnSnap.docs.forEach((d) => {
          const refData = d.data();
          const mainDoc = connDocMap[refData.connectionId];
          if (mainDoc && mainDoc.exists) {
            const data = mainDoc.data();
            connections.push({ id: mainDoc.id, ...data });
            userIds.add(data.studentId);
            userIds.add(data.teacherId);
          } else {
            // Fallback to lightweight ref if main doc missing
            connections.push({
              id: refData.connectionId,
              studentId: refData.studentId,
              teacherId: refData.teacherId,
              requestedBy: refData.requestedBy,
              message: refData.message || "",
              status: refData.status || "pending",
              createdAt: refData.createdAt,
              updatedAt: refData.updatedAt,
            });
            userIds.add(refData.studentId);
            userIds.add(refData.teacherId);
          }
        });
      }
    } catch (err) {
      // Ignore — we'll fallback to main collection query below
      console.warn("User subcollection query failed, will fallback to main collection:", err.message || err);
    }

    // If no per-user refs found, fallback to main `connections` query.
    if (!usedUserSubcollection) {
      try {
        let query = db.collection("connections").where(fieldToQuery, "==", userId);
        if (status) query = query.where("status", "==", status);
        const snapshot = await query.orderBy("createdAt", "desc").get();

        snapshot.forEach((doc) => {
          const data = doc.data();
          connections.push({ id: doc.id, ...data });
          userIds.add(data.studentId);
          userIds.add(data.teacherId);
        });
      } catch (err) {
        // Likely a composite index is required; as a last resort read per-user refs without orderBy
        console.warn("Main connections query failed (index?), falling back to unordered per-user refs:", err.message || err);
        try {
          const userConnSnap = await db.collection("users").doc(userId).collection("connections").get();
          userConnSnap.forEach((d) => {
            const data = d.data();
            connections.push({
              id: data.connectionId,
              studentId: data.studentId,
              teacherId: data.teacherId,
              requestedBy: data.requestedBy,
              message: data.message || "",
              status: data.status || "pending",
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
            });
            userIds.add(data.studentId);
            userIds.add(data.teacherId);
          });
        } catch (e) {
          console.error("Failed fallback per-user refs read:", e.message || e);
        }
      }
    }

    // Fetch user details for all connections (batched to avoid N+1 reads)
    const usersMap = {};
    const uids = Array.from(userIds).filter(Boolean);
    if (uids.length) {
      for (let i = 0; i < uids.length; i += 10) {
        const chunk = uids.slice(i, i + 10);
        const snap = await db.collection("users").where(admin.firestore.FieldPath.documentId(), "in", chunk).get();
        snap.forEach((doc) => {
          const userData = doc.data();
          usersMap[doc.id] = {
            uid: doc.id,
            displayName: userData.displayName,
            email: userData.email,
            role: userData.role,
            profileImage: userData.profileImage,
          };
        });
      }
    }

    // Enrich connections with user details
    const enrichedConnections = connections.map((conn) => ({
      ...conn,
      student: usersMap[conn.studentId] || { uid: conn.studentId },
      teacher: usersMap[conn.teacherId] || { uid: conn.teacherId },
    }));

    // Also include any per-user connection refs stored under users/{userId}/connections
    // (this helps surface requests created in other ways or when main query misses)
    try {
      const userConnSnapshot = await db.collection("users").doc(userId).collection("connections").orderBy("createdAt", "desc").get();
      userConnSnapshot.forEach((doc) => {
        const data = doc.data();
        // Avoid duplicates
        if (!enrichedConnections.find((c) => c.id === data.connectionId)) {
          // build a lightweight connection object
          enrichedConnections.push({
            id: data.connectionId,
            studentId: data.studentId,
            teacherId: data.teacherId,
            requestedBy: data.requestedBy,
            message: data.message || "",
            status: data.status || "pending",
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            student: usersMap[data.studentId] || { uid: data.studentId },
            teacher: usersMap[data.teacherId] || { uid: data.teacherId },
          });
        }
      });
    } catch (err) {
      // ignore if per-user refs missing
      // console.warn("Could not read per-user connection refs:", err.message || err);
    }

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

    // Propagate status update to per-user subcollections if they exist
    try {
      const updatedAt = new Date().toISOString();
      const connDoc = connectionDoc.data();
      const { studentId, teacherId } = connDoc || {};
      if (studentId && teacherId) {
        await Promise.all([
          db.collection("users").doc(studentId).collection("connections").doc(connectionId).update({ status, updatedAt }),
          db.collection("users").doc(teacherId).collection("connections").doc(connectionId).update({ status, updatedAt }),
        ]);
      }
    } catch (err) {
      // ignore if per-user refs are missing
      console.warn("Could not update per-user connection refs:", err.message || err);
    }
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

    // Also delete per-user subcollection refs if they exist
    try {
      const data = connectionDoc.data();
      const { studentId, teacherId } = data || {};
      if (studentId && teacherId) {
        await Promise.all([
          db.collection("users").doc(studentId).collection("connections").doc(connectionId).delete(),
          db.collection("users").doc(teacherId).collection("connections").doc(connectionId).delete(),
        ]);
      }
    } catch (err) {
      console.warn("Could not delete per-user connection refs:", err.message || err);
    }

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
