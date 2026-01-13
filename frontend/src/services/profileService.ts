import { auth } from "@/config/firebase";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

const db = getFirestore();

export const getUserProfile = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  return snap.exists() ? snap.data() : null;
};

export const updateAcademicDetails = async (academic: {
  grade: string;
  stream: string;
  courses: number;
}) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  const ref = doc(db, "users", user.uid);
  await updateDoc(ref, { academic });
};
