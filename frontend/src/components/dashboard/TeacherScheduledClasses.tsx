import { useSchedule } from "@/context/ScheduleContext";

const TeacherScheduledClasses = () => {
  const { classes } = useSchedule();

  console.log("CLASSES FROM CONTEXT:", classes);

  if (classes.length === 0) {
    return (
      <p className="text-muted-foreground">
        No classes scheduled yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {classes.map((cls) => (
        <div
          key={cls.id}
          className="border rounded-lg p-4"
        >
          <h3 className="font-semibold">{cls.subject}</h3>
          <p className="text-sm text-muted-foreground">
            Topics: {cls.topics}
          </p>
          <p className="text-sm">
            📅 {cls.date} ⏰ {cls.time}
          </p>
          <p className="text-sm">
            👥 Students selected: {cls.students.length}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TeacherScheduledClasses;
