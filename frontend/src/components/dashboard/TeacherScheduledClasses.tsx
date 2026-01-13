import { useSchedule } from "@/context/ScheduleContext";
import ClassCard from "@/components/classes/ClassCard";

export default function TeacherScheduledClasses() {
  const { classes } = useSchedule();

  if (!classes.length) {
    return <p className="text-muted-foreground">No classes scheduled</p>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      {/* <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Classes</h2>
      </div> */}

      {/* 🔥 SCROLLABLE CLASSES CONTAINER */}
      <div className="max-h-[520px] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <ClassCard key={cls.id} cls={cls} />
          ))}
        </div>
      </div>
    </div>
  );
}
