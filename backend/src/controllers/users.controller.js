import { db } from "../config/firebase.js";

/**
 * Search users (students or teachers) by name or email
 * GET /api/users/search?query=xxx&role=teacher|student
 */
export const searchUsers = async (req, res) => {
  try {
    const { query, role, currentUserId, limit = 10 } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters",
      });
    }

    const searchTerm = query.toLowerCase().trim();
    const usersRef = db.collection("users");
    
    // Build query - Firebase doesn't support full-text search natively
    // So we'll fetch users and filter client-side for now
    // In production, consider using Algolia or Elasticsearch
    let querySnapshot;
    
    if (role && (role === "teacher" || role === "student")) {
      querySnapshot = await usersRef.where("role", "==", role).get();
    } else {
      querySnapshot = await usersRef.get();
    }

    const users = [];
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      const displayName = (userData.displayName || "").toLowerCase();
      const email = (userData.email || "").toLowerCase();
      
      // Check if search term matches display name or email
      if (
        displayName.includes(searchTerm) ||
        email.includes(searchTerm)
      ) {
        // Exclude current user from results
        if (doc.id !== currentUserId) {
          users.push({
            uid: doc.id,
            displayName: userData.displayName,
            email: userData.email,
            role: userData.role,
            subject: userData.subject || [],
            bio: userData.bio || "",
            profileImage: userData.profileImage || null,
            createdAt: userData.createdAt,
          });
        }
      }
    });

    // Limit results
    const limitedUsers = users.slice(0, parseInt(limit));

    res.json({
      success: true,
      results: limitedUsers,
      total: users.length,
    });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search users",
      error: error.message,
    });
  }
};

/**
 * Get user profile by UID
 * GET /api/users/:uid
 */
export const getUserProfile = async (req, res) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userData = userDoc.data();

    res.json({
      success: true,
      user: {
        uid: userDoc.id,
        displayName: userData.displayName,
        email: userData.email,
        role: userData.role,
        subject: userData.subject || [],
        bio: userData.bio || "",
        profileImage: userData.profileImage || null,
        createdAt: userData.createdAt,
      },
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user profile",
      error: error.message,
    });
  }
};

/**
 * Update user profile
 * PUT /api/users/:uid
 */
export const updateUserProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const { displayName, bio, subject, profileImage } = req.body;

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const updateData = {
      updatedAt: new Date().toISOString(),
    };

    if (displayName !== undefined) updateData.displayName = displayName;
    if (bio !== undefined) updateData.bio = bio;
    if (subject !== undefined) updateData.subject = subject;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    await db.collection("users").doc(uid).update(updateData);

    res.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};
