import { motion } from "framer-motion";
import { Video, Users, Clock, Calendar, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const liveLessons = [
  {
    id: 1,
    title: "Advanced Calculus - Integration Techniques",
    teacher: "Prof. John Smith",
    teacherAvatar: "/placeholder.svg",
    subject: "Mathematics",
    startTime: "10:00 AM",
    duration: "1h 30m",
    students: 24,
    isLive: true,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "Shakespeare's Hamlet - Act 3 Analysis",
    teacher: "Dr. Sarah Miller",
    teacherAvatar: "/placeholder.svg",
    subject: "English Literature",
    startTime: "11:30 AM",
    duration: "1h",
    students: 18,
    isLive: true,
    color: "from-violet-500 to-purple-600",
  },
  {
    id: 3,
    title: "Newton's Laws of Motion",
    teacher: "Dr. Emily Chen",
    teacherAvatar: "/placeholder.svg",
    subject: "Physics",
    startTime: "2:00 PM",
    duration: "1h 15m",
    students: 0,
    isLive: false,
    color: "from-orange-500 to-red-500",
  },
  {
    id: 4,
    title: "Data Structures - Binary Trees",
    teacher: "Prof. Alex Johnson",
    teacherAvatar: "/placeholder.svg",
    subject: "Computer Science",
    startTime: "3:30 PM",
    duration: "1h 30m",
    students: 0,
    isLive: false,
    color: "from-emerald-500 to-teal-500",
  },
];

export function LiveLessonsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold">Live Lessons</h1>
        <p className="text-muted-foreground mt-1">Join ongoing sessions or view upcoming live classes</p>
      </div>

      {/* Live Now Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
          </span>
          <h2 className="font-semibold text-lg">Live Now</h2>
        </div>

        <div className="grid gap-4">
          {liveLessons.filter(l => l.isLive).map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Thumbnail */}
                <div className={cn(
                  "relative w-full lg:w-80 h-48 lg:h-auto bg-gradient-to-br flex items-center justify-center",
                  lesson.color
                )}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative z-10 w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                  <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground animate-pulse">
                    🔴 LIVE
                  </Badge>
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="space-y-3">
                      <div>
                        <Badge variant="secondary" className="mb-2">{lesson.subject}</Badge>
                        <h3 className="font-heading font-semibold text-lg">{lesson.title}</h3>
                      </div>

                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2 border-primary/20">
                          <AvatarImage src={lesson.teacherAvatar} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {lesson.teacher.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{lesson.teacher}</p>
                          <p className="text-sm text-muted-foreground">Instructor</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{lesson.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{lesson.students} students watching</span>
                        </div>
                      </div>
                    </div>

                    <Button size="lg" className="gradient-bg text-primary-foreground shadow-lg whitespace-nowrap">
                      <Play className="w-4 h-4 mr-2" />
                      Join Now
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upcoming Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-lg">Upcoming Today</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {liveLessons.filter(l => !l.isLive).map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 2) }}
              className="bg-card rounded-2xl border border-border shadow-card p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0",
                  lesson.color
                )}>
                  <Video className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <Badge variant="outline" className="mb-2">{lesson.subject}</Badge>
                  <h3 className="font-semibold truncate">{lesson.title}</h3>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={lesson.teacherAvatar} />
                      <AvatarFallback className="text-xs">
                        {lesson.teacher.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{lesson.teacher}</span>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-primary">{lesson.startTime}</span>
                      <span className="text-muted-foreground">• {lesson.duration}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      Set Reminder
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
