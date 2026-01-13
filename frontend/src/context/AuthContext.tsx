
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile as updateFirebaseProfile,
} from "firebase/auth";
import { auth, db } from "@/config/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

/* ================= TYPES ================= */

export type UserRole = "student" | "teacher";

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  role: UserRole;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  isAuthenticated: boolean;

  signUp: (
    email: string,
    password: string,
    displayName: string,
    role: UserRole
  ) => Promise<void>;

  signIn: (
    email: string,
    password: string,
    expectedRole?: UserRole
  ) => Promise<UserData>;

  logout: () => Promise<void>;

  updateUserProfile: (data: {
    displayName?: string;
    photoURL?: string;
  }) => Promise<void>;
}

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------- AUTH STATE LISTENER ---------- */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userDocRef);
      const userData = userSnap.data();

      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName:
          firebaseUser.displayName || userData?.displayName || null,
        photoURL: firebaseUser.photoURL || userData?.photoURL || null,
        role: (userData?.role as UserRole) || "student",
      });

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  /* ---------- SIGN UP ---------- */
  const signUp = async (
    email: string,
    password: string,
    displayName: string,
    role: UserRole
  ) => {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateFirebaseProfile(cred.user, { displayName });

    await setDoc(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid,
      email,
      displayName,
      role,
      createdAt: new Date().toISOString(),
    });
  };

  /* ---------- SIGN IN (ROLE AWARE) ---------- */
  const signIn = async (
    email: string,
    password: string,
    expectedRole?: UserRole
  ): Promise<UserData> => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid = userCredential.user.uid;
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    let resolvedRole: UserRole = "student";
    let displayName = userCredential.user.displayName || null;

    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      resolvedRole = (data.role as UserRole) || "student";
      displayName = displayName || data.displayName || null;
    }

    // 🔐 Enforce role-based login
    if (expectedRole && expectedRole !== resolvedRole) {
      await signOut(auth);
      throw new Error("Invalid credentials for this account type.");
    }

    const newUser: UserData = {
      uid,
      email: userCredential.user.email,
      displayName,
      role: resolvedRole,
      photoURL: userCredential.user.photoURL,
    };

    setUser(newUser);
    return newUser;
  };

  /* ---------- UPDATE PROFILE ---------- */
  const updateUserProfile = async (data: {
    displayName?: string;
    photoURL?: string;
  }) => {
    if (!auth.currentUser || !user) return;

    await updateFirebaseProfile(auth.currentUser, data);
    await updateDoc(doc(db, "users", user.uid), {
      ...data,
      updatedAt: new Date().toISOString(),
    });

    setUser((prev) => (prev ? { ...prev, ...data } : prev));
  };

  /* ---------- LOGOUT ---------- */
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        signUp,
        signIn,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
