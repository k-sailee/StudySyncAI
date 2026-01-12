// import { useEffect, useState } from "react";
// import { getStudentLectures } from "@/services/lectureService";
// import { useAuth } from "@/context/AuthContext";

// export default function RecommendedLectures() {
//   const { user } = useAuth();
//   const [lectures, setLectures] = useState<any[]>([]);

//   useEffect(() => {
//     getStudentLectures(user.uid).then(setLectures);
//   }, []);

//   return (
//     <div className="max-w-4xl">
//       <h2 className="text-2xl font-bold mb-6">Recommended Lectures</h2>

//       {lectures.map(lecture => (
//         <div
//           key={lecture.id}
//           className="bg-white rounded-xl p-4 shadow mb-4"
//         >
//           <h3 className="font-semibold text-lg">{lecture.title}</h3>

//           <iframe
//             className="w-full h-64 mt-3 rounded"
//             src={lecture.youtubeUrl.replace("watch?v=", "embed/")}
//             allowFullScreen
//           />
//         </div>
//       ))}
//     </div>
//   );
// }
