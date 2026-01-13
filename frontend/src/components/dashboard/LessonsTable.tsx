// import { Calendar, Clock, BookOpen } from "lucide-react";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { useSchedule } from "@/context/ScheduleContext";

// export function LessonsTable() {
//   const { classes } = useSchedule();

//   const today = new Date().toISOString().split("T")[0];

//   return (
//     <div
//       className="
//         bg-card
//         rounded-2xl
//         border
//         shadow-xl
//         hover:shadow-2xl
//         transition-shadow
//         p-4
//         space-y-4
//       "
//     >
//       {/* Header (fixed) */}
//       <div className="flex items-center justify-between">
//         <h2 className="text-lg font-semibold">Lessons</h2>
//         <span className="text-xs text-muted-foreground">
//           {classes.length} total
//         </span>
//       </div>

//       {classes.length === 0 && (
//         <p className="text-sm text-muted-foreground">
//           No lessons scheduled
//         </p>
//       )}

//       {/* Scrollable lessons list */}
//       <div
//         className="
//           max-h-[420px]
//           overflow-y-auto
//           pr-2
//           space-y-3
//           scrollbar-thin
//           scrollbar-thumb-muted-foreground/40
//           scrollbar-track-transparent
//         "
//       >
//         {classes.map((lesson) => {
//           const isToday = lesson.date === today;

//           return (
//             <div
//               key={lesson.id}
//               className={`
//                 flex items-start gap-3 rounded-xl border p-3
//                 transition-all
//                 hover:bg-accent/40
//                 hover:translate-y-[-2px]
//                 ${isToday ? "bg-primary/5 border-primary/30" : ""}
//               `}
//             >
//               {/* Icon */}
//               <div
//                 className={`
//                   w-10 h-10 rounded-lg flex items-center justify-center
//                   ${isToday ? "bg-primary/20" : "bg-primary/10"}
//                 `}
//               >
//                 <BookOpen className="w-5 h-5 text-primary" />
//               </div>

//               {/* Content */}
//               <div className="flex-1 space-y-1">
//                 <div className="flex items-center gap-2">
//                   <p className="font-medium leading-none">
//                     {lesson.subject}
//                   </p>
//                   {isToday && (
//                     <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
//                       Today
//                     </span>
//                   )}
//                 </div>

//                 <p className="text-sm text-muted-foreground">
//                   {lesson.topics || "Lesson"}
//                 </p>

//                 <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
//                   <span className="flex items-center gap-1">
//                     <Calendar className="w-3 h-3" />
//                     {lesson.date}
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <Clock className="w-3 h-3" />
//                     {lesson.time}
//                   </span>
//                 </div>
//               </div>

//               {/* Teacher Avatar */}
//               <Avatar className="w-8 h-8">
//                 <AvatarFallback>
//                   {lesson.teacherEmail?.charAt(0).toUpperCase()}
//                 </AvatarFallback>
//               </Avatar>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
import { Calendar, Clock, BookOpen } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSchedule } from "@/context/ScheduleContext";

export function LessonsTable() {
  const { classes } = useSchedule();

  return (
    <div
      className="
        bg-card
        rounded-2xl
        border
        shadow-[0_20px_40px_rgba(0,0,0,0.08)]
        p-4
        flex
        flex-col
        h-[640px]
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Lessons</h2>
        <span className="text-sm text-muted-foreground">
          {classes.length} total
        </span>
      </div>

      {/* Scrollable Lessons */}
      <div
        className="
          flex-1
          overflow-y-auto
          pr-2
          space-y-3
          scrollbar-thin
          scrollbar-thumb-primary/30
          scrollbar-track-transparent
        "
      >
        {classes.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No lessons scheduled
          </p>
        )}

        {classes.map((lesson) => (
          <div
            key={lesson.id}
            className="
              flex items-start gap-3
              rounded-xl
              border
              p-3
              bg-white
              hover:bg-accent/40
              transition
            "
          >
            {/* Icon */}
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-1">
              <p className="font-medium capitalize">{lesson.subject}</p>
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

      {/* Bottom Visual Filler (uses extra space intentionally) */}
      <div className="mt-4 pt-4 border-t flex flex-col items-center text-center">
        <div className="w-28 h-28 mb-3 opacity-90">
          <img
            src="/study-illustration.svg"
            alt="Study illustration"
            className="w-full h-full object-contain"
          />
        </div>

        <p className="text-sm font-medium text-muted-foreground">
          Stay consistent ✨
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Small lessons every day build big results.
        </p>
      </div>
    </div>
  );
}
