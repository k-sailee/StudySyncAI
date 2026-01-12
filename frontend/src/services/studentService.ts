import { db, auth } from "@/config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export const getConnectedStudents = async () => {
  const teacherId = auth.currentUser?.uid;
  console.log("Teacher UID:", teacherId);

  if (!teacherId) return [];

  const q = query(
    collection(db, "users"),
    where("role", "==", "student"),
     //where("teacherId", "==", teacherId)
    // 🔴 temporarily REMOVE connectionStatus filter
  );

  const snapshot = await getDocs(q);

  console.log("Students snapshot size:", snapshot.size);

  const students = snapshot.docs.map(doc => {
    console.log("Student doc:", doc.data());
    return {
      uid: doc.id,
      ...doc.data(),
    };
  });

  return students;
};

// export const getConnectedStudents = async (teacherId: string) => {
//   if (!teacherId) return [];

//   const q = query(
//     collection(db, "users"),
//     where("role", "==", "student"),
//     where("teacherId", "==", teacherId)
//   );

//   const snapshot = await getDocs(q);

//   return snapshot.docs.map(doc => ({
//     id: doc.id,
//     ...(doc.data() as any),
//   }));
// };
