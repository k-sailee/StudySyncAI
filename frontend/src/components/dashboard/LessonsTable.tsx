import { Calendar, Clock, BookOpen } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSchedule } from "@/context/ScheduleContext";

export function LessonsTable() {
  const { classes } = useSchedule();

  return (
    <div className="bg-card rounded-2xl border shadow-card p-4 space-y-4">
      <h2 className="text-lg font-semibold">Lessons</h2>

      {classes.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No lessons scheduled
        </p>
      )}

      <div className="space-y-3">
        {classes.map((lesson) => (
          <div
            key={lesson.id}
            className="flex items-start gap-3 rounded-xl border p-3 hover:bg-accent/30 transition"
          >
            {/* Icon */}
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-1">
              <p className="font-medium">{lesson.subject}</p>
              <p className="text-sm text-muted-foreground">
                {lesson.topics}
              </p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {lesson.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {lesson.time}
                </span>
              </div>
            </div>

            {/* Teacher Avatar */}
            <Avatar className="w-8 h-8">
              <AvatarFallback>
                {lesson.teacherEmail?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        ))}
      </div>
    </div>
  );
}
