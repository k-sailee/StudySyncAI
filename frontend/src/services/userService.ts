import axios from "axios";
import { db } from "@/config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth } from "@/config/firebase";
// Use same-origin proxy (/api) in dev/preview to avoid CORS; allow override via VITE_API_URL for production
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
export type ProfessionalDetails = {
  class?: string;
  dob?: string;
  phone?: string;
  city?: string;
  state?: string;
  preferredLanguage?: string;
  board?: string;
  stream?: string;
  school?: string;
  section?: string;
  academicYear?: string;
};

export interface UserSearchResult {
  uid: string;
  displayName: string;
  email: string;
  role: "student" | "teacher";
  subject?: string[];
  bio?: string;
  profileImage?: string | null;
  createdAt?: string;
}

export interface Connection {
  id: string;
  studentId: string;
  teacherId: string;
  requestedBy: string;
  message: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;
  updatedAt: string;
  student?: UserSearchResult;
  teacher?: UserSearchResult;
}

export interface SearchResponse {
  success: boolean;
  results: UserSearchResult[];
  total: number;
}

export interface ConnectionsResponse {
  success: boolean;
  connections: Connection[];
  total: number;
}

/**
 * Search for users (students or teachers)
 */
export const searchUsers = async (
  query: string,
  role?: "student" | "teacher",
  currentUserId?: string,
  limit: number = 10
): Promise<UserSearchResult[]> => {
  const params = new URLSearchParams({
    query,
    limit: limit.toString(),
  });

  if (role) params.append("role", role);
  if (currentUserId) params.append("currentUserId", currentUserId);

  // Primary attempt using configured API base URL
  try {
    const response = await api.get<SearchResponse>(`/users/search?${params}`);
    return response.data.results;
  } catch (primaryError) {
    console.error("Primary search request failed:", primaryError);

    // Fallback: try same-origin /api path (useful in preview/proxy environments)
    try {
      if (typeof window !== "undefined") {
        const origin = window.location.origin;
        const fallbackUrl = `${origin}/api/users/search?${params.toString()}`;
        const res = await fetch(fallbackUrl, { method: "GET", headers: { "Content-Type": "application/json" } });
        if (res.ok) {
          const data = await res.json();
          return data.results || [];
        }
        console.error("Fallback search request failed (non-OK):", res.status, await res.text());
      }
    } catch (fallbackError) {
      console.error("Fallback search request failed:", fallbackError);
    }

    return [];
  }
};

/**
 * Get user profile by UID
 */
export const getUserProfile = async (uid: string): Promise<UserSearchResult | null> => {
  try {
    const response = await api.get(`/users/${uid}`);
    return response.data.user;
  } catch (error) {
    console.error("Get user profile error:", error);
    return null;
  }
};

/**
 * Create a connection request
 */
export const createConnection = async (
  studentId: string,
  teacherId: string,
  requestedBy: string,
  message?: string
): Promise<{ success: boolean; connectionId?: string; message: string }> => {
  try {
    const response = await api.post("/connections", {
      studentId,
      teacherId,
      requestedBy,
      message,
    });
    return {
      success: true,
      connectionId: response.data.connectionId,
      message: response.data.message,
    };
  } catch (error: any) {
    console.error("Create connection error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to send connection request",
    };
  }
};

/**
 * Get all connections for a user
 */
export const getConnections = async (
  userId: string,
  role: "student" | "teacher",
  status?: "pending" | "accepted" | "rejected"
): Promise<Connection[]> => {
  try {
    const params = new URLSearchParams({ userId, role });
    if (status) params.append("status", status);

    const response = await api.get<ConnectionsResponse>(`/connections?${params}`);
    return response.data.connections;
  } catch (error) {
    console.error("Get connections error:", error);
    return [];
  }
};

/**
 * Update connection status
 */
export const updateConnectionStatus = async (
  connectionId: string,
  status: "accepted" | "rejected" | "cancelled"
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.put(`/connections/${connectionId}`, { status });
    return { success: true, message: response.data.message };
  } catch (error: any) {
    console.error("Update connection error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update connection",
    };
  }
};

/**
 * Delete a connection
 */
export const deleteConnection = async (
  connectionId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete(`/connections/${connectionId}`);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    console.error("Delete connection error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete connection",
    };
  }
};

export async function getUserProfilePage() {
  const uid = auth.currentUser?.uid;
  if (!uid) return null;

  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  return snap.exists() ? snap.data() : null;
}

export const updateAcademicDetails = async (data: {
  grade?: string;
  stream?: string;
  courses?: number;
}) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const ref = doc(db, "users", uid);
  await updateDoc(ref, data);
};

export async function updateProfessionalDetails(data: ProfessionalDetails) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("User not authenticated");

  const ref = doc(db, "users", uid);

  await updateDoc(ref, {
    ...data,
    updatedAt: new Date(),
  });
}
