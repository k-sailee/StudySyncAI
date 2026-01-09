import { useEffect, useState } from "react";
import { auth } from "@/config/firebase";
import { getStudentAssignments } from "@/services/assignmentService";
import { onAuthStateChanged } from "firebase/auth";

const MyTasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Wait for Firebase Auth to be ready
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("No logged-in user");
        setLoading(false);
        return;
      }

      console.log("Logged-in student UID:", user.uid);

      const data = await getStudentAssignments(user.uid);
      console.log("Student assignments:", data);

      setTasks(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p className="p-6">Loading tasks...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">My Tasks</h1>

      {tasks.length === 0 && (
        <p className="text-gray-500">No assignments assigned yet</p>
      )}

      {tasks.length > 0 && (
        <table className="w-full border-collapse bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Subject</th>
              <th className="p-3 border">Due Date</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="p-3 border">{task.title}</td>
                <td className="p-3 border">{task.subject}</td>
                <td className="p-3 border">{task.dueDate}</td>
                <td className="p-3 border capitalize">
                  {task.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyTasks;
