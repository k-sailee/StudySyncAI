import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export type UserRole = "student" | "teacher";

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
  signIn: (email: string, password: string, expectedRole?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user data from Firestore
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || userData.displayName,
            role: userData.role || "student",
          });
        } else {
          // Create default user profile
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role: "student",
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName: string, role: UserRole) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Store user data in Firestore
      await setDoc(doc(db, "users", uid), {
        email,
        displayName,
        role,
        createdAt: new Date().toISOString(),
      });

      setUser({
        uid,
        email,
        displayName,
        role,
      });
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string, expectedRole?: UserRole) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Fetch user role from Firestore
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const actualRole: UserRole = (userData.role || "student") as UserRole;

        // If an expectedRole is provided, enforce it
        if (expectedRole && actualRole !== expectedRole) {
          // Immediately sign out the firebase session and throw an error
          try {
            await signOut(auth);
          } catch (e) {
            console.warn("Failed to sign out after role mismatch:", e);
          }
          const err = new Error("Invalid credentials for this account type.");
          // Keep consistent error shape
          throw err;
        }

        setUser({
          uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName || userData.displayName,
          role: actualRole,
        });
      }
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
