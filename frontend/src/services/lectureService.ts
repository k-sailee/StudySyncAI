import { db } from "@/config/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp
} from "firebase/firestore";
import { RecommendedLecture } from "@/types/lecture";

const lecturesRef = collection(db, "recommendedLectures");

export const addRecommendedLecture = async (
  lecture: RecommendedLecture
) => {
  await addDoc(lecturesRef, {
    ...lecture,
    createdAt: serverTimestamp(),
  });
};

export const getStudentLectures = async (studentId: string) => {
  const q = query(
    lecturesRef,
    where("studentIds", "array-contains", studentId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};
export const getRecommendedLecturesForStudent = async (
  studentId: string
) => {
  if (!studentId) return [];

  const q = query(
    collection(db, "recommendedLectures"),
    where("studentIds", "array-contains", studentId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};