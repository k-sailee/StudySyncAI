export function normalizeDate(date: any) {
  if (!date) return null;

  if (typeof date === "string" && date.includes("-")) {
    return date.slice(0, 10);
  }

  if (date?.toDate) {
    return date.toDate().toISOString().split("T")[0];
  }

  return null;
}
