import { motion } from "framer-motion";
import { Download, ChevronRight, CheckCircle, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const lessons = [
  {
    id: 1,
    className: "English Literature",
    teacher: "Dr. Sarah Miller",
    teacherAvatar: "/placeholder.svg",
    startingDate: "May 15, 2024",
    hasMaterial: true,
    paymentStatus: "done",
  },
  {
    id: 2,
    className: "Advanced Mathematics",
    teacher: "Prof. John Smith",
    teacherAvatar: "/placeholder.svg",
    startingDate: "May 18, 2024",
    hasMaterial: true,
    paymentStatus: "done",
  },
  {
    id: 3,
    className: "Physics Fundamentals",
    teacher: "Dr. Emily Chen",
    teacherAvatar: "/placeholder.svg",
    startingDate: "May 20, 2024",
    hasMaterial: false,
    paymentStatus: "pending",
  },
  {
    id: 4,
    className: "Computer Science",
    teacher: "Prof. Alex Johnson",
    teacherAvatar: "/placeholder.svg",
    startingDate: "May 22, 2024",
    hasMaterial: true,
    paymentStatus: "done",
  },
];

export function LessonsTable() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold">Lessons</h2>
        <Button variant="ghost" className="text-primary hover:text-primary/80">
          View all
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-accent/30">
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">Class Name</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">Teacher</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">Starting Date</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">Material</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">Payment</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson, index) => (
                <motion.tr
                  key={lesson.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05 * index }}
                  className="border-b border-border last:border-0 hover:bg-accent/20 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium">{lesson.className}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={lesson.teacherAvatar} />
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                          {lesson.teacher.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground">{lesson.teacher}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{lesson.startingDate}</td>
                  <td className="p-4">
                    {lesson.hasMaterial ? (
                      <Button size="sm" variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-sm">Coming soon</span>
                    )}
                  </td>
                  <td className="p-4">
                    {lesson.paymentStatus === "done" ? (
                      <Badge variant="secondary" className="bg-success/10 text-success border-0">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Done
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-warning/10 text-warning border-0">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-border">
          {lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{lesson.className}</h3>
                    <p className="text-sm text-muted-foreground">{lesson.startingDate}</p>
                  </div>
                </div>
                {lesson.paymentStatus === "done" ? (
                  <Badge variant="secondary" className="bg-success/10 text-success border-0">
                    Done
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-warning/10 text-warning border-0">
                    Pending
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={lesson.teacherAvatar} />
                    <AvatarFallback className="text-xs">
                      {lesson.teacher.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{lesson.teacher}</span>
                </div>
                {lesson.hasMaterial && (
                  <Button size="sm" variant="ghost" className="text-primary">
                    <Download className="w-4 h-4 mr-1" />
                    Material
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
