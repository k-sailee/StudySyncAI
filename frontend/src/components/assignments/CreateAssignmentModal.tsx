// import { useEffect, useState } from "react";
// import { createAssignment } from "@/services/assignmentService";
// import { getConnectedStudents } from "@/services/studentService";
// import { Label } from "@/components/ui/label";
// import { useAuth } from "@/context/AuthContext";
// import { uploadToCloudinary } from "@/utils/cloudinaryUpload";
// const CreateAssignmentModal = ({ onClose }: { onClose: () => void }) => {
//   const [students, setStudents] = useState<any[]>([]);
//   const [selectedStudent, setSelectedStudent] = useState("");
// const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
// const { user } = useAuth();
// const teacherId = user?.uid;

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     subject: "",
//     dueDate: "",
//     totalMarks: "",
//   });

//   useEffect(() => {
//     getConnectedStudents().then(setStudents);
//   }, []);




//   // const handleCreate = async () => {
//   //   if (!selectedStudent) {
//   //     alert("Please select a student");
//   //     return;
//   //   }

//   //   await createAssignment(
//   //     {
//   //       title: form.title,
//   //       description: form.description,
//   //       subject: form.subject,
//   //       dueDate: form.dueDate,
//   //       totalMarks: Number(form.totalMarks || 20),
//   //     },
//   //     [selectedStudent]
//   //   );

//   //   onClose();
//   // };
//   const handleCreate = async () => {
//   if (!teacherId) {
//     alert("Teacher not authenticated");
//     return;
//   }

//   if (!selectedStudent) {
//     alert("Please select a student");
//     return;
//   }

//   let fileUrl: string | null = null;

//   // 1️⃣ Upload assignment PDF (optional)
//   if (assignmentFile) {
//       fileUrl = await uploadToCloudinary(assignmentFile);
//   }

//   // 2️⃣ Create assignment in Firestore
//   await createAssignment(
//     {
//       title: form.title,
//       description: form.description,
//       subject: form.subject,
//       dueDate: form.dueDate,
//       totalMarks: Number(form.totalMarks || 20),
//       fileUrl, // 👈 saved here
//     },
//     [selectedStudent]
//   );

//   onClose();
// };


//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white w-[420px] rounded-xl p-6 space-y-4">

//         <h2 className="text-lg font-semibold">Create Assignment</h2>

//         {/* Title */}
//          <div className="space-y-2">
//         <Label>Title</Label>
//         <input
//           className="input"
//           placeholder="Assignment title"
//           onChange={e => setForm({ ...form, title: e.target.value })}
//         />
// </div>
//         {/* Description */}
//          <div className="space-y-2">
//               <Label>Description</Label>
//         <textarea
//           className="input"
//           placeholder="Describe the assignment"
//           onChange={e => setForm({ ...form, description: e.target.value })}
//         />
// </div>
// <div className="space-y-2">
//   <Label>Assignment File (PDF)</Label>
//   <input
//     type="file"
//     accept=".pdf"
//     onChange={(e) => setAssignmentFile(e.target.files?.[0] || null)}
//   />
// </div>

//       <div className="space-y-2">
//                 <Label>Subject</Label>
//         <input
//           className="input"
//           placeholder="Subject"
//           onChange={e => setForm({ ...form, subject: e.target.value })}
//         />
//         </div>
//  <div className="space-y-2">
//                 <Label>Due Date</Label>
//         {/* Due Date */}
//         <input
//           type="date"
//           className="input"
//           onChange={e => setForm({ ...form, dueDate: e.target.value })}
//         /></div>
//  <div className="space-y-2">
//                 <Label>Total Marks</Label>
//         <input
//           type="text"
//           className="input"
//           placeholder="20"
//           value={form.totalMarks}
//           onChange={e => setForm({ ...form, totalMarks: e.target.value })}
//         />
// </div>
//         {/* Student Dropdown (FIXED) */}
//         <div>
//           <label className="text-sm font-medium">Select Student</label>
//           <select
//             className="input mt-1"
//             value={selectedStudent}
//             onChange={e => setSelectedStudent(e.target.value)}
//           >
//             <option value="">Select student</option>
//             {students.map(student => (
//               <option key={student.uid} value={student.uid}>
//                 {student.displayName || student.email}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Actions */}
//         <div className="flex justify-end gap-2 pt-2">
//           <button className="btn-secondary" onClick={onClose}>
//             Cancel
//           </button>
//           <button className="btn-primary" onClick={handleCreate}>
//             Create Assignment
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateAssignmentModal;

import { useEffect, useState } from "react";
import { createAssignmentsForStudents } from "@/services/assignmentService";
import { getConnectedStudents } from "@/services/studentService";
import { Label } from "@/components/ui/label";
import { auth } from "@/config/firebase";

const CreateAssignmentModal = ({ onClose }: { onClose: () => void }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    dueDate: "",
    totalMarks: "",
  });

  useEffect(() => {
    getConnectedStudents().then(setStudents);
  }, []);

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (selectedStudents.length === 0) {
      alert("Select at least one student");
      return;
    }

    const teacherId = auth.currentUser?.uid;
    if (!teacherId) return;

    await createAssignmentsForStudents({
      assignment: {
        title: form.title,
        description: form.description,
        subject: form.subject,
        dueDate: form.dueDate,
        totalMarks: Number(form.totalMarks),
      },
      studentIds: selectedStudents,
      teacherId,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[450px] rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Create Assignment</h2>
 <div className="space-y-2">
      <Label>Title</Label>
        <input
          className="input"
          placeholder="Title"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        </div>
 <div className="space-y-2">
           <Label>Description</Label>
        <textarea
          className="input"
          placeholder="Description"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        </div>
  <div className="space-y-2">
         <Label>Subject</Label> 
        <input
          className="input"
          placeholder="Subject"
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />
        </div>
  <div className="space-y-2"> 
        <Label>Due Date</Label>

        <input
          type="date"
          className="input"
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />
        </div>
  <div className="space-y-2">
        <Label>Total Marks</Label>

        <input
          className="input"
          placeholder="20"
          value={form.totalMarks}
          onChange={(e) => setForm({ ...form, totalMarks: e.target.value })}
        />
        </div>

        {/* MULTI STUDENT SELECT */}
        <div>
          <Label>Select Students</Label>
          <div className="max-h-40 overflow-y-auto border rounded-lg p-2 mt-1">
            {students.map((s) => (
              <label
                key={s.uid}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(s.uid)}
                  onChange={() => toggleStudent(s.uid)}
                />
                {s.displayName || s.email}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleCreate}>
            Create Assignment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignmentModal;
