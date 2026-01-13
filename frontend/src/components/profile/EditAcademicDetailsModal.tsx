import { useState } from "react";
import { updateAcademicDetails } from "@/services/profileService";

export default function EditAcademicDetailsModal({
  open,
  onClose,
  onSaved
}: any) {
  const [grade, setGrade] = useState("");
  const [stream, setStream] = useState("");
  const [courses, setCourses] = useState(0);

  if (!open) return null;

  const save = async () => {
    await updateAcademicDetails({ grade, stream, courses });
    onSaved();
  };

  return (
    <div className="modal">
      <h3>Update Academic Details</h3>

      <input placeholder="Grade" onChange={e => setGrade(e.target.value)} />
      <input placeholder="Stream" onChange={e => setStream(e.target.value)} />
      <input
        type="number"
        placeholder="Courses"
        onChange={e => setCourses(+e.target.value)}
      />

      <button onClick={save}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}
