import { useSchedule } from "@/context/ScheduleContext";
import ClassCard from "@/components/classes/ClassCard";

export default function TeacherScheduledClasses() {
  const { classes, loading } = useSchedule();

  if (loading) return <p>Loading...</p>;
  if (!classes.length) return <p>No classes scheduled</p>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {classes.map(cls => (
        <ClassCard key={cls.id} cls={cls} />
      ))}
    </div>
  );
}
