import { useSchedule } from "@/context/ScheduleContext";
import ClassCard from "@/components/classes/ClassCard";

export default function MyClassesPage() {
  const { classes, loading } = useSchedule();

  if (loading) return <p>Loading classes...</p>;
  if (!classes.length) return <p>No classes scheduled</p>;

  return (
    <div className="
    min-h-screen
    px-6
    py-8
    bg-gradient-to-br
    from-purple-100
    via-pink-100
    to-indigo-100
  ">
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">My Classes</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map(cls => (
          <ClassCard key={cls.id} cls={cls} />
        ))}
      </div>
    </div>
  </div>
  );
}
