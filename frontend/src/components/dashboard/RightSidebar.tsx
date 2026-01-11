import { motion } from "framer-motion";
import { Calendar, CheckCircle, Clock, AlertCircle, ChevronLeft, ChevronRight, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTasks } from "@/context/TaskContext";

// const upcomingTasks = [
//   {
//     id: 1,
//     title: "Submit Math Assignment",
//     subject: "Mathematics",
//     deadline: "Today, 6:00 PM",
//     priority: "high",
//     status: "pending",
//   },
//   {
//     id: 2,
//     title: "Physics Lab Report",
//     subject: "Physics",
//     deadline: "Tomorrow, 11:00 AM",
//     priority: "medium",
//     status: "in-progress",
//   },
//   {
//     id: 3,
//     title: "English Essay Draft",
//     subject: "English",
//     deadline: "May 18, 2024",
//     priority: "low",
//     status: "pending",
//   },
// ];

export function RightSidebar() {
   const { user } = useAuth();
  const navigate = useNavigate();
const { tasks } = useTasks();
const upcomingTasks = tasks
  .filter((t) => t.status !== "completed")
  .sort(
    (a, b) =>
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  )
  .slice(0, 3);
  const userName = user?.displayName || "User";
  const userInitials =
    user?.displayName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";
  const [currentMonth, setCurrentMonth] = useState(new Date());
 

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthName = currentMonth.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const today = new Date().getDate();
  const isCurrentMonth = 
    currentMonth.getMonth() === new Date().getMonth() &&
    currentMonth.getFullYear() === new Date().getFullYear();

  const highlightedDays = [5, 12, 15, 22, 28]; // Days with tasks

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentMonth(newDate);
  };

  return (
    <div className="hidden xl:block w-80 shrink-0 space-y-6">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-card rounded-2xl border border-border shadow-card p-6"
      >
        <div className="flex flex-col items-center text-center">
         <Avatar className="w-20 h-20 border-4 border-primary/30 shadow-lg">
  <AvatarImage src={user?.photoURL || undefined} />
  <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-2xl font-bold">
    {userInitials}
  </AvatarFallback>
</Avatar>

    <h3 className="mt-4 font-heading font-semibold text-lg">
  {userName}
</h3>

          <Badge variant="secondary" className="mt-2">
            Grade 11 - Science
          </Badge>
      <Button
  className="w-full"
  onClick={() => navigate("/profile")}
>
  View Profile
</Button>

        </div>
      </motion.div>

      {/* Calendar Widget */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl border border-border shadow-card p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Calendar
          </h3>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-7 h-7"
              onClick={() => navigateMonth(-1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-7 h-7"
              onClick={() => navigateMonth(1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <p className="text-sm text-center font-medium mb-3">{monthName}</p>

        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="p-2 text-muted-foreground font-medium">
              {day}
            </div>
          ))}
          
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2" />
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday = isCurrentMonth && day === today;
            const hasTask = highlightedDays.includes(day);
            
            return (
              <button
                key={day}
                className={cn(
                  "p-2 rounded-lg text-sm transition-all relative",
                  isToday 
                    ? "bg-primary text-primary-foreground font-bold" 
                    : "hover:bg-accent",
                  hasTask && !isToday && "font-semibold text-primary"
                )}
              >
                {day}
                {hasTask && !isToday && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-secondary rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Upcoming Tasks */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-2xl border border-border shadow-card p-4"
      >
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-primary" />
          Upcoming Tasks
        </h3>

        <div className="space-y-3">
          {upcomingTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={cn(
                "p-3 rounded-xl border transition-colors cursor-pointer",
                task.priority === "high" 
                  ? "bg-destructive/5 border-destructive/20 hover:bg-destructive/10"
                  : task.priority === "medium"
                  ? "bg-warning/5 border-warning/20 hover:bg-warning/10"
                  : "bg-accent/50 border-border hover:bg-accent"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-2 shrink-0",
                  task.priority === "high" ? "bg-destructive" :
                  task.priority === "medium" ? "bg-warning" : "bg-muted-foreground"
                )} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{task.title}</h4>
                  <p className="text-xs text-muted-foreground">{task.subject}</p>
                  <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                    {task.priority === "high" ? (
                      <AlertCircle className="w-3 h-3 text-destructive" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    {/* <span className={task.priority === "high" ? "text-destructive font-medium" : ""}>
                      {task.deadline}
                    </span> */}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Button variant="ghost" size="sm" className="w-full mt-4 text-primary" onClick={() => {
  window.dispatchEvent(
    new CustomEvent("dashboard:navigate", {
      detail: { section: "tasks" },
    })
  );
}}
>
          View All Tasks
        </Button>
      </motion.div>
    </div>
  );
}
