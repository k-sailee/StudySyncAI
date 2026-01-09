import { useState } from "react";
import AssignmentsPage from "@/components/pages/AssignmentsPage";
import CreateAssignmentModal from "@/components/assignments/CreateAssignmentModal";

const TeacherAssignmentsPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <button className="btn-primary" onClick={() => setOpen(true)}>
        + Create Assignment
      </button>

      <AssignmentsPage />

      {open && (
        <CreateAssignmentModal onClose={() => setOpen(false)} />
      )}
    </div>
  );
};

export default TeacherAssignmentsPage;
