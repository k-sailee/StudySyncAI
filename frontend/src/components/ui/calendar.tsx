import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { useMemo } from "react";

import { useTasks } from "@/context/TaskContext";
import { CalendarTask } from "@/types/calendar-task";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const { tasks } = useTasks();

  /** 🔁 Convert full Task → CalendarTask */
  const calendarTasks: CalendarTask[] = useMemo(() => {
    return tasks.map((t) => ({
      id: t.id,
      title: t.title,
      dueDate: t.deadline, // 🔥 IMPORTANT
      isAssignment: t.isAssignment,
    }));
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
          const dayTasks = tasksByDate[dateKey];

          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="relative flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent"
                >
                  <span>{date.getDate()}</span>

                  {dayTasks?.map((t, i) => (
                    <span
                      key={t.id}
                      className={cn(
                        "absolute bottom-1 h-1.5 w-1.5 rounded-full",
                        t.isAssignment ? "bg-purple-500" : "bg-blue-500"
                      )}
                      style={{ left: `${45 + i * 6}%` }}
                    />
                  ))}
                </button>
              </TooltipTrigger>

              {dayTasks && (
                <TooltipContent side="right" className="max-w-xs">
                  {dayTasks.map((t) => (
                    <div key={t.id} className="text-xs">
                      {t.isAssignment ? "📘 Assignment" : "📝 Task"} — {t.title}
                    </div>
                  ))}
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
  );
}

Calendar.displayName = "Calendar";
