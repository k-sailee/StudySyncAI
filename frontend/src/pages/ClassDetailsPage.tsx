import { useParams } from "react-router-dom";
import { useSchedule } from "@/context/ScheduleContext";

export default function ClassDetailsPage() {
  const { id } = useParams();
  const { classes, loading } = useSchedule();

  if (loading) {
    return <p className="p-6">Loading class details...</p>;
  }

  const cls = classes.find(c => c.id === id);

  if (!cls) {
    return <p className="p-6">Class not found</p>;
  }

  return (
    /* FULL PAGE GRADIENT BACKGROUND */
    <div className="
  min-h-screen
  flex
  items-center
  justify-center
  bg-gradient-to-br
  from-purple-100
  via-pink-100
  to-indigo-100
">
      
      {/* CENTER CARD */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
        
        {/* TITLE */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {cls.subject}
        </h1>

        <p className="text-gray-600 mb-6">
          Topics: {cls.topics}
        </p>

        {/* INFO GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          
          <div className="flex items-center gap-3">
            <span className="text-purple-600">📅</span>
            <div>
              <p className="font-medium text-gray-700">Date</p>
              <p className="text-gray-600">{cls.date}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-purple-600">⏰</span>
            <div>
              <p className="font-medium text-gray-700">Time</p>
              <p className="text-gray-600">{cls.time}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-purple-600">👩‍🏫</span>
            <div>
              <p className="font-medium text-gray-700">Teacher</p>
              <p className="text-gray-600">{cls.teacherEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-purple-600">👥</span>
            <div>
              <p className="font-medium text-gray-700">Students</p>
              <p className="text-gray-600">
                {cls.students?.length || 0} enrolled
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
