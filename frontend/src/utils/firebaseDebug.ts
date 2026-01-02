/**
 * Debug utility for Firebase/Firestore issues
 */

import { db, auth } from "@/config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export const debugFirebase = async () => {
  console.group("🔍 Firebase Debug Information");
  
  // Check auth state
  console.log("🔐 Auth State:", {
    currentUser: auth.currentUser?.uid,
    email: auth.currentUser?.email,
    isAuthenticated: !!auth.currentUser
  });

  // Check Firestore connection
  try {
    console.log("🔌 Testing Firestore connection...");
    const testQuery = collection(db, "_test_connection");
    await getDocs(testQuery);
    console.log("✅ Firestore is accessible");
  } catch (error: any) {
    console.error("❌ Firestore connection error:", error.message);
  }

  // Check tasks collection
  if (auth.currentUser) {
    try {
      console.log("📋 Checking tasks collection for user:", auth.currentUser.uid);
      const tasksRef = collection(db, "tasks");
      const q = query(tasksRef, where("userId", "==", auth.currentUser.uid));
      const snapshot = await getDocs(q);
      console.log(`✅ Found ${snapshot.docs.length} tasks for this user`);
      
      if (snapshot.docs.length > 0) {
        console.log("Sample task:", snapshot.docs[0].data());
      }
    } catch (error: any) {
      console.error("❌ Error loading tasks:", {
        code: error.code,
        message: error.message
      });
      
      if (error.code === "permission-denied") {
        console.warn("⚠️  Permission denied. Check Firestore rules!");
      }
      if (error.code === "failed-precondition") {
        console.warn("⚠️  Failed precondition. Might need to create a Firestore index.");
      }
    }
  } else {
    console.warn("⚠️  No authenticated user. Cannot check tasks.");
  }

  console.groupEnd();
};

// For quick testing in console
declare global {
  interface Window {
    debugFirebase: typeof debugFirebase;
  }
}

if (typeof window !== "undefined") {
  window.debugFirebase = debugFirebase;
}
