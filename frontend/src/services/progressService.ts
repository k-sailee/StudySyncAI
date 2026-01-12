import { auth } from "@/config/firebase";

const API_BASE = "http://localhost:5000/progress";

/* ---------------- METRICS ---------------- */
export const getProgressMetrics = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const token = await user.getIdToken();

  const res = await fetch(`${API_BASE}/metrics`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("Failed to fetch progress metrics");
  }

  return res.json();
};

/* ---------------- BADGES ---------------- */
export const getProgressBadges = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const token = await user.getIdToken();

  const res = await fetch(`${API_BASE}/badges`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("Failed to fetch badges");
  }

  return res.json();
};

/* ---------------- FOCUS COMPLETE ---------------- */
export const completeFocusSession = async (minutes: number) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const token = await user.getIdToken();

  const res = await fetch(`${API_BASE}/focus-complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ minutes })
  });

  if (!res.ok) {
    throw new Error("Failed to save focus session");
  }

  return res.json();
};
