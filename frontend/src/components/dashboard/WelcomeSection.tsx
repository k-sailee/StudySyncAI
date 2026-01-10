import { motion } from "framer-motion";
import { Play, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeSectionProps {
  userName?: string;
  role?: "student" | "teacher";
}

export function WelcomeSection({ userName = "User", role = "student" }: WelcomeSectionProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long'
  });

  const studentStats = [
    { label: "Classes Today", value: "4", change: "+1" },
    { label: "Tasks Due", value: "3", change: "urgent" },
    { label: "Study Streak", value: "12 days", change: "🔥" },
    { label: "Progress", value: "78%", change: "+5%" },
  ];

  const teacherStats = [
    { label: "Classes Today", value: "5", change: "+2" },
    { label: "Pending Reviews", value: "12", change: "new" },
    { label: "Students Active", value: "156", change: "+8" },
    { label: "Assignments", value: "24", change: "due" },
  ];

  const stats = role === "teacher" ? teacherStats : studentStats;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl gradient-hero-bg p-6 lg:p-8 text-white shadow-xl"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
      <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-24" />
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{currentDate}</span>
            </div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-white">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-white/80 max-w-md">
              {role === "teacher" 
                ? "You have 12 pending submissions to review and 3 live classes today."
                : "You have 3 pending tasks and 2 live lessons today. Let's make it productive!"
              }
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 shadow-lg group"
            >
              <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              {role === "teacher" ? "Start Class" : "Start Learning"}
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/20 backdrop-blur-sm bg-white/10"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {role === "teacher" ? "AI Insights" : "AI Study Plan"}
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10"
            >
              <p className="text-white/70 text-xs sm:text-sm">{stat.label}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-bold text-white">{stat.value}</span>
                <span className="text-xs text-white/60">{stat.change}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
