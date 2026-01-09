import { auth, db } from "@/config/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { Assignment } from "@/types/Assignment";
// export const createAssignment = async (
//   data: any,
//   studentIds: string[]
// ) => {
//   const teacherId = auth.currentUser?.uid;
//   if (!teacherId) return;

//   const batchPromises = studentIds.map(studentId =>
//     addDoc(collection(db, "assignments"), {
//       ...data,
//       assignedBy: teacherId,
//       assignedTo: studentId,
//       status: "pending",
//       createdAt: Timestamp.now(),
//     })
//   );

//   await Promise.all(batchPromises);
// };
export const createAssignment = async (data: any, studentIds: string[]) => {
  const teacherId = auth.currentUser?.uid;
  if (!teacherId) return;

  await Promise.all(
    studentIds.map(studentUid =>
      addDoc(collection(db, "assignments"), {
        ...data,
        assignedBy: teacherId,
        assignedTo: studentUid, // ✅ UID here
        status: "pending",
        createdAt: Timestamp.now(),
      })
    )
  );
};

// export const getMyAssignments = async (studentId: string) => {
//   const q = query(
//     collection(db, "assignments"),
//     where("assignedTo", "==", studentId)
//   );

//   const snapshot = await getDocs(q);
//   return snapshot.docs.map(doc => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
// };
export const getTeacherAssignments = async () => {
  const teacherId = auth.currentUser?.uid;
  if (!teacherId) return [];

  const q = query(
    collection(db, "assignments"),
    where("assignedBy", "==", teacherId),
    // orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// export const getStudentAssignments = async (studentId: string) => {
//   const q = query(
//     collection(db, "assignments"),
//     where("assignedTo", "==", studentId)
//   );

//   const snapshot = await getDocs(q);

//   return snapshot.docs.map(doc => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
// };
export const getStudentAssignments = async (
  studentId: string
): Promise<Assignment[]> => {
  const q = query(
    collection(db, "assignments"),
    where("assignedTo", "==", studentId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Assignment, "id">),
  }));
};