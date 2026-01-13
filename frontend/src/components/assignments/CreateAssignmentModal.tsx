
import { useEffect, useState } from "react";
import { createAssignmentsForStudents } from "@/services/assignmentService";
import { getConnectedStudents } from "@/services/studentService";
import { Label } from "@/components/ui/label";
import { auth } from "@/config/firebase";
import { Timestamp } from "firebase/firestore";

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
        dueDate: Timestamp.fromDate(new Date(form.dueDate)),
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
