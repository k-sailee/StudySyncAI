import { motion } from "framer-motion";
import { 
  Users, BookOpen, FileText, Clock, CheckCircle, AlertCircle,
  TrendingUp, BarChart3, Calendar, Eye, MessageSquare, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const classes = [
  {
    id: 1,
    name: "Advanced Mathematics",
    section: "Grade 11 - A",
    students: 32,
    nextClass: "Today, 10:00 AM",
    pendingAssignments: 8,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    name: "Calculus Basics",
    section: "Grade 12 - B",
    students: 28,
    nextClass: "Today, 2:00 PM",
    pendingAssignments: 5,
    color: "from-violet-500 to-purple-600",
  },
  {
    id: 3,
    name: "Statistics 101",
    section: "Grade 10 - C",
    students: 35,
    nextClass: "Tomorrow, 9:00 AM",
    pendingAssignments: 12,
    color: "from-orange-500 to-red-500",
  },
];

const recentSubmissions = [
  {
    id: 1,
    student: "Alice Johnson",
    assignment: "Chapter 5 - Integration",
    subject: "Mathematics",
    submittedAt: "2 hours ago",
    status: "pending",
  },
  {
    id: 2,
    student: "Bob Smith",
    assignment: "Physics Lab Report",
    subject: "Physics",
    submittedAt: "3 hours ago",
    status: "pending",
  },
  {
    id: 3,
    student: "Carol Williams",
    assignment: "Essay on Shakespeare",
    subject: "English",
    submittedAt: "5 hours ago",
    status: "reviewed",
  },
  {
    id: 4,
    student: "David Brown",
    assignment: "Chapter 5 - Integration",
    subject: "Mathematics",
    submittedAt: "6 hours ago",
    status: "pending",
  },
];

const topStudents = [
  { name: "Emma Thompson", grade: "A+", progress: 98, avatar: "ET" },
  { name: "James Wilson", grade: "A", progress: 92, avatar: "JW" },
  { name: "Sophia Davis", grade: "A", progress: 89, avatar: "SD" },
  { name: "Michael Chen", grade: "A-", progress: 85, avatar: "MC" },
];

const frequentDoubts = [
  { question: "How to solve differential equations?", count: 15, subject: "Mathematics" },
  { question: "Newton's laws application", count: 12, subject: "Physics" },
  { question: "Integration by parts", count: 10, subject: "Mathematics" },
  { question: "Thermodynamics concepts", count: 8, subject: "Physics" },
];

export function TeacherDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button className="gradient-bg gap-2">
          <Plus className="w-4 h-4" />
          Create Assignment
        </Button>
        <Button variant="outline" className="gap-2">
          <Calendar className="w-4 h-4" />
          Schedule Class
        </Button>
        <Button variant="outline" className="gap-2">
          <MessageSquare className="w-4 h-4" />
          Send Announcement
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: "156", icon: Users, color: "text-primary", bgColor: "bg-primary/10" },
          { label: "Active Classes", value: "8", icon: BookOpen, color: "text-success", bgColor: "bg-success/10" },
          { label: "Pending Reviews", value: "24", icon: FileText, color: "text-warning", bgColor: "bg-warning/10" },
          { label: "Avg. Performance", value: "78%", icon: TrendingUp, color: "text-secondary", bgColor: "bg-secondary/10" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
          >
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className={cn("p-2 sm:p-3 rounded-xl", stat.bgColor)}>
                    <stat.icon className={cn("w-5 h-5 sm:w-6 sm:h-6", stat.color)} />
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold">{stat.value}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-3">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* My Classes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold">My Classes</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((classItem, index) => (
              <motion.div
                key={classItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <Card className="group hover:shadow-lg transition-all cursor-pointer overflow-hidden">
                  <div className={cn("h-2 bg-gradient-to-r", classItem.color)} />
                  <CardContent className="p-4">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {classItem.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{classItem.section}</p>
                    
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          {classItem.students} students
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {classItem.nextClass}
                        </span>
                      </div>
                      {classItem.pendingAssignments > 0 && (
                        <Badge variant="secondary" className="mt-2">
                          {classItem.pendingAssignments} pending
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold">Top Performers</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button>
          </div>

          <Card>
            <CardContent className="p-4 space-y-4">
              {topStudents.map((student, index) => (
                <motion.div
                  key={student.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-3"
                >
                  <span className="text-sm font-medium text-muted-foreground w-4">
                    {index + 1}
                  </span>
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {student.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{student.name}</p>
                    <Progress value={student.progress} className="h-1.5 mt-1" />
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {student.grade}
                  </Badge>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold">Recent Submissions</h2>
            <Badge variant="secondary">{recentSubmissions.filter(s => s.status === "pending").length} pending</Badge>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentSubmissions.map((submission, index) => (
                  <motion.div
                    key={submission.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 * index }}
                    className="p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-secondary/50 text-secondary-foreground text-sm">
                            {submission.student.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{submission.student}</p>
                          <p className="text-sm text-muted-foreground">{submission.assignment}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {submission.subject}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {submission.submittedAt}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {submission.status === "pending" ? (
                          <>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" className="gradient-bg">
                              Review
                            </Button>
                          </>
                        ) : (
                          <Badge className="bg-success/10 text-success border-0">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Reviewed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Frequent Doubts (FAQ) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold">Frequent Student Doubts</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button>
          </div>

          <Card>
            <CardContent className="p-4 space-y-3">
              {frequentDoubts.map((doubt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-accent/50 hover:bg-accent transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{doubt.question}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {doubt.subject}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Asked {doubt.count} times
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="shrink-0">
                    Answer
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Class Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-accent/30 rounded-xl border-2 border-dashed border-border">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">Performance analytics will be displayed here</p>
              <p className="text-sm text-muted-foreground">Connect to database for live data</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
