import { useSchedule } from "@/context/ScheduleContext";
import { useAuth } from "@/context/AuthContext";

const StudentScheduledClasses = () => {
  const { classes } = useSchedule();
  const { user } = useAuth();

  if (!user) return null;

  const myClasses = classes;

  if (myClasses.length === 0) {
    return (
      <p className="text-muted-foreground">
        No upcoming classes scheduled for you.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {myClasses.map((cls) => (
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
        </div>
      ))}
    </div>
  );
};

export default StudentScheduledClasses;
