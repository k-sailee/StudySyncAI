// import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
// import {
//   User,
//   onAuthStateChanged,
//   signOut,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
// } from "firebase/auth";
// import { auth, db } from "@/config/firebase";
// import { doc, setDoc, getDoc } from "firebase/firestore";

// export type UserRole = "student" | "teacher";

// interface UserData {
//   uid: string;
//   email: string | null;
//   displayName: string | null;
//   role: UserRole;
// }

// // interface AuthContextType {
// //   user: UserData | null;
// //   loading: boolean;
// //   signUp: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
// //   signIn: (email: string, password: string, expectedRole?: UserRole) => Promise<void>;
// //   logout: () => Promise<void>;
// //   isAuthenticated: boolean;
// // }
// interface AuthContextType {
//   user: UserData | null;
//   loading: boolean;
//   signUp: (
//     email: string,
//     password: string,
//     displayName: string,
//     role: UserRole
//   ) => Promise<void>;
//   signIn: (
//     email: string,
//     password: string,
//     expectedRole?: UserRole
//   ) => Promise<void>;
//   logout: () => Promise<void>;
//   updateProfile: (data: Partial<UserData>) => void; // ✅ REQUIRED
//   isAuthenticated: boolean;
// }


// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState(true);
// const updateProfile = (data: Partial<UserData>) => {
//   setUser((prev) => prev ? { ...prev, ...data } : prev);
// };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       if (firebaseUser) {
//         // Fetch user data from Firestore
//         const userDocRef = doc(db, "users", firebaseUser.uid);
//         const userDocSnap = await getDoc(userDocRef);

//         if (userDocSnap.exists()) {
//           const userData = userDocSnap.data();
//           setUser({
//             uid: firebaseUser.uid,
//             email: firebaseUser.email,
//             displayName: firebaseUser.displayName || userData.displayName,
//             role: userData.role || "student",
//           });
//         } else {
//           // Create default user profile
//           setUser({
//             uid: firebaseUser.uid,
//             email: firebaseUser.email,
//             displayName: firebaseUser.displayName,
//             role: "student",
//           });
//         }
//       } else {
//         setUser(null);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const signUp = async (email: string, password: string, displayName: string, role: UserRole) => {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const uid = userCredential.user.uid;

//       // Store user data in Firestore
//       await setDoc(doc(db, "users", uid), {
//         email,
//         displayName,
//         role,
//         createdAt: new Date().toISOString(),
//       });

//       setUser({
//         uid,
//         email,
//         displayName,
//         role,
//       });
//     } catch (error) {
//       console.error("Sign up error:", error);
//       throw error;
//     }
//   };

//   const signIn = async (email: string, password: string, expectedRole?: UserRole) => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const uid = userCredential.user.uid;

//       // Fetch user role from Firestore
//       const userDocRef = doc(db, "users", uid);
//       const userDocSnap = await getDoc(userDocRef);

//       if (userDocSnap.exists()) {
//         const userData = userDocSnap.data();
//         const actualRole: UserRole = (userData.role || "student") as UserRole;

//         // If an expectedRole is provided, enforce it
//         if (expectedRole && actualRole !== expectedRole) {
//           // Immediately sign out the firebase session and throw an error
//           try {
//             await signOut(auth);
//           } catch (e) {
//             console.warn("Failed to sign out after role mismatch:", e);
//           }
//           const err = new Error("Invalid credentials for this account type.");
//           // Keep consistent error shape
//           throw err;
//         }

//         setUser({
//           uid,
//           email: userCredential.user.email,
//           displayName: userCredential.user.displayName || userData.displayName,
//           role: actualRole,
//         });
//       }
//     } catch (error) {
//       console.error("Sign in error:", error);
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       await signOut(auth);
//       setUser(null);
//     } catch (error) {
//       console.error("Logout error:", error);
//       throw error;
//     }
//   };

//   const value: AuthContextType = {
//     user,
//     loading,
//     signUp,
//     signIn,
//     logout,
//      updateProfile,
//     isAuthenticated: !!user,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
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
