import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { useMemo } from "react";

import { useTasks } from "@/context/TaskContext";
import { CalendarTask } from "@/types/calendar-task";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

/** 🔐 SAFE LOCAL DATE KEY (NO TIMEZONE BUG) */
function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function getDateKeyFromTask(task: any): string | null {
  // Assignment (Firestore Timestamp)
  if (task.dueDate?.toDate) {
    return toDateKey(task.dueDate.toDate());
  }

  // Normal task (string / Date)
  if (task.deadline) {
    return toDateKey(new Date(task.deadline));
  }

  return null;
}


export function TaskCalendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {


  const { tasks } = useTasks();


  /** 🔁 Convert full Task → CalendarTask */
//  const calendarTasks: CalendarTask[] = useMemo(() => {
//   return tasks
//     .map((t) => {
//       const dateKey = getDateKeyFromTask(t);
//       if (!dateKey) return null;

//       return {
//         id: t.id,
//         title: t.title,
//         dueDate: dateKey, // ✅ ALWAYS yyyy-mm-dd
//         isAssignment: t.isAssignment,
//       };
//     })
//     .filter(Boolean) as CalendarTask[];
// }, [tasks]);
const calendarTasks: CalendarTask[] = useMemo(() => {
  return tasks
    .map((t) => {
      if (!t.deadline) return null;

      const date = new Date(t.deadline);
      if (isNaN(date.getTime())) return null;

      return {
        id: t.id,
        title: t.title,
        dueDate: toDateKey(date), // yyyy-mm-dd
        isAssignment: Boolean(t.isAssignment),
      };
    })
    .filter(Boolean) as CalendarTask[];
}, [tasks]);




  /** 📅 Group tasks by date */
  const tasksByDate = useMemo(() => {
    const map: Record<string, CalendarTask[]> = {};
    calendarTasks.forEach((t) => {
      if (!map[t.dueDate]) map[t.dueDate] = [];
      map[t.dueDate].push(t);
    });
    return map;
  }, [calendarTasks]);

 return (
  <TooltipProvider delayDuration={200}>
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      modifiers={{
        hasTask: (date) => {
          const key = toDateKey(date);
          return Boolean(tasksByDate[key]);
        },
      }}
      components={{
        DayContent: ({ date }) => {
          const dateKey = toDateKey(date);
          const dayTasks = tasksByDate[dateKey] || [];

          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="relative flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent"
                >
                  <span>{date.getDate()}</span>

                  <div className="absolute bottom-1 flex gap-0.5">
                    {dayTasks.slice(0, 3).map((t) => (
                      <span
                        key={t.id}
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          t.isAssignment
                            ? "bg-purple-500"
                            : "bg-blue-500"
                        )}
                      />
                    ))}
                  </div>
                </button>
              </TooltipTrigger>

              {dayTasks.length > 0 && (
                <TooltipContent side="right" className="max-w-xs">
                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map((t) => (
                      <div
                        key={t.id}
                        className="text-xs flex items-center gap-1"
                      >
                        <span>{t.isAssignment ? "📘" : "📝"}</span>
                        <span className="font-medium">
                          {t.isAssignment ? "Assignment" : "Task"}:
                        </span>
                        <span className="truncate">{t.title}</span>
                      </div>
                    ))}

                    {dayTasks.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayTasks.length - 3} more
                      </div>
                    )}
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          );
        },

        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "space-y-4",
        caption: "flex justify-center items-center relative",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell: "w-9 text-xs text-muted-foreground",
        row: "flex mt-2",
        cell: "h-9 w-9 text-center relative",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal"
        ),
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        ...classNames,
      }}
      {...props}
    />
  </TooltipProvider>
);

}
TaskCalendar.displayName = "TaskCalendar";

