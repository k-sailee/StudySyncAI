import { Timestamp } from "firebase/firestore";

export function formatDate(value: any): string {
  if (!value) return "—";

  // Firestore Timestamp
  if (value instanceof Timestamp) {
    return value.toDate().toLocaleDateString();
  }

  // JS Date
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  // String date
  if (typeof value === "string") {
    return new Date(value).toLocaleDateString();
  }

  return "—";
}
