import { db } from "../config/firebase.js";

// Teacher → Create Assignment
export const createAssignment = async (req, res) => {
  try {
    const { title, description, subject, dueDate, studentIds } = req.body;

    if (!studentIds || studentIds.length === 0) {
      return res.status(400).json({ message: "No students selected" });
    }

    const batch = db.batch();

    studentIds.forEach(studentId => {
      const docRef = db.collection("assignments").doc();
      batch.set(docRef, {
        title,
        description,
        subject,
        dueDate,
        assignedBy: req.user.id, // teacher UID
        assignedTo: studentId,   // student UID
        status: "pending",
        createdAt: new Date().toISOString(),
      });
    });

    await batch.commit();

    res.status(201).json({ message: "Assignments created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create assignment" });
  }
};

// Student → Get My Assignments
export const getMyAssignments = async (req, res) => {
  try {
    const snapshot = await db
      .collection("assignments")
      .where("assignedTo", "==", req.user.id)
      .orderBy("dueDate", "asc")
      .get();

    const assignments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch assignments" });
  }
};
