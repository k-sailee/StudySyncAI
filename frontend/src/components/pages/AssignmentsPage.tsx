import { useEffect, useState } from "react";
import { getTeacherAssignments } from "@/services/assignmentService";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { formatDate } from "@/utils/formatDate";

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
const total = assignments.length;
const completed = assignments.filter(a => a.status === "completed").length;
const pending = assignments.filter(a => a.status === "pending").length;
const [filter, setFilter] = useState<
  "all" | "pending" | "completed" | "overdue"
>("all");
const [subjectFilter, setSubjectFilter] = useState<string>("all");
const subjects = Array.from(
  new Set(assignments.map(a => a.subject).filter(Boolean))
);

const isOverdue = (assignment: any) => {
  if (assignment.status === "completed") return false;
  return new Date(assignment.dueDate) < new Date();
};
const filteredAssignments = assignments.filter((a) => {
  if (filter === "completed") return a.status === "completed";
  if (filter === "pending") return a.status === "pending";
  if (filter === "overdue") return isOverdue(a);
  if (subjectFilter !== "all" && a.subject !== subjectFilter) return false;
  return true; // all
});

  useEffect(() => {
    const fetchAssignments = async () => {
      const data = await getTeacherAssignments();

      // fetch student names for each assignment
      const enriched = await Promise.all(
        data.map(async (a: any) => {
          const studentRef = doc(db, "users", a.assignedTo);
          const studentSnap = await getDoc(studentRef);

          return {
            ...a,
            studentName: studentSnap.exists()
              ? studentSnap.data().displayName || studentSnap.data().email
              : "Unknown",
          };
        })
      );

      setAssignments(enriched);
      setLoading(false);
    };

    fetchAssignments();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-3">Assignments</h2>
<div className="grid grid-cols-3 gap-4 mb-6">
  <div className="bg-card border rounded-xl p-4 text-center">
    <p className="text-sm text-muted-foreground">Total</p>
    <p className="text-2xl font-bold">{total}</p>
  </div>

  <div className="bg-card border rounded-xl p-4 text-center">
    <p className="text-sm text-muted-foreground">Completed</p>
    <p className="text-2xl font-bold text-green-600">
      {completed}
    </p>
  </div>

  <div className="bg-card border rounded-xl p-4 text-center">
    <p className="text-sm text-muted-foreground">Pending</p>
    <p className="text-2xl font-bold text-yellow-600">
      {pending}
    </p>
  </div>
</div>
<div className="flex gap-2 mb-6">
  {["all", "pending", "completed", "overdue"].map((f) => (
    <button
      key={f}
      onClick={() => setFilter(f as any)}
      className={`px-4 py-2 rounded-lg text-sm font-medium border transition
        ${
          filter === f
            ? "bg-primary text-primary-foreground"
            : "bg-card hover:bg-accent"
        }`}
    >
      {f.charAt(0).toUpperCase() + f.slice(1)}
    </button>
  ))}
</div>
<div className="flex gap-3 mb-6 items-center">
  <span className="text-sm text-muted-foreground">
    Filter by subject:
  </span>

  <select
    value={subjectFilter}
    onChange={(e) => setSubjectFilter(e.target.value)}
    className="border rounded-lg px-3 py-2 text-sm bg-card"
  >
    <option value="all">All Subjects</option>

    {subjects.map((subject) => (
      <option key={subject} value={subject}>
        {subject}
      </option>
    ))}
  </select>
</div>


      {/* <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Due Date</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Assigned To</th>
          </tr>
        </thead>

        <tbody>
          {assignments.map(a => (
            <tr key={a.id} className="hover:bg-gray-50">
              <td className="p-2 border">{a.title}</td>
              <td className="p-2 border">{a.description}</td>
              <td className="p-2 border">{a.dueDate}</td>
              <td className="p-2 border capitalize">{a.status}</td>
              <td className="p-2 border">{a.studentName}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
  <div className="space-y-4">
  {filteredAssignments.length === 0 && (
    <p className="text-sm text-muted-foreground">
      No assignments found
    </p>
  )}

  {filteredAssignments.map((assignment) => (
    <div
      key={assignment.id}
      className="bg-card border rounded-xl p-4 flex justify-between items-start shadow-sm"
    >
      {/* LEFT */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">
          {assignment.title}
        </h3>

        <p className="text-sm text-muted-foreground">
          {assignment.description}
        </p>

        <div className="flex flex-wrap gap-2 text-sm">
          <Badge variant="secondary">
            {assignment.subject}
          </Badge>

          <Badge className="bg-blue-100 text-blue-700 border-blue-300">
            Assignment
          </Badge>

          <span className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {formatDate(assignment.dueDate)}

          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-end gap-2">
        <Badge
          className={
            assignment.status === "completed"
              ? "bg-green-100 text-green-700 border-green-300"
              : "bg-yellow-100 text-yellow-700 border-yellow-300"
          }
        >
          {assignment.status}
        </Badge>

        <span className="text-sm text-muted-foreground">
          Assigned to: {assignment.studentName}
        </span>
      </div>
    </div>
  ))}
</div>


    </div>
  );
};

export default AssignmentsPage;
