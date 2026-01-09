// backend/src/middleware/auth.js
import admin from "../config/firebase.js";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = { 
      id: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || 'student' // Optional: add role from Firebase custom claims
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default auth;
