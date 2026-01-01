import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  BookOpen, 
  Video, 
  PlayCircle, 
  CheckSquare, 
  TrendingUp, 
  Users, 
  Film, 
  HelpCircle, 
  Settings, 
  Menu, 
  X,
  LogOut,
  Bell,
  Search,
  ChevronRight,
  GraduationCap,
  ClipboardList,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  userRole?: "student" | "teacher";
  onRoleChange?: (role: "student" | "teacher") => void;
}

const studentNavItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "classes", label: "Classes", icon: BookOpen },
  { id: "live-lessons", label: "Live Lessons", icon: Video, badge: "Live" },
  { id: "recorded-lessons", label: "Recorded Lessons", icon: PlayCircle },
  { id: "tasks", label: "My Tasks", icon: CheckSquare, badge: "3" },
  { id: "progress", label: "Progress Tracker", icon: TrendingUp },
  { id: "study-groups", label: "Study Groups", icon: Users },
  { id: "video-library", label: "Video Library", icon: Film },
  { id: "doubt-solver", label: "Doubt Solver", icon: HelpCircle },
  { id: "settings", label: "Settings", icon: Settings },
];

const teacherNavItems = [
  { id: "teacher-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "my-classes", label: "My Classes", icon: BookOpen },
  { id: "live-sessions", label: "Live Sessions", icon: Video, badge: "2" },
  { id: "assignments", label: "Assignments", icon: ClipboardList, badge: "12" },
  { id: "student-progress", label: "Student Progress", icon: TrendingUp },
  { id: "doubt-history", label: "Doubt History", icon: HelpCircle },
  { id: "settings", label: "Settings", icon: Settings },
];

export function DashboardLayout({ 
  children, 
  activeSection, 
  onSectionChange,
  userRole = "student",
  onRoleChange
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navigationItems = userRole === "teacher" ? teacherNavItems : studentNavItems;
  const userName = userRole === "teacher" ? "Prof. Smith" : "John Doe";
  const userInitials = userRole === "teacher" ? "PS" : "JD";

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border shadow-xl lg:shadow-card",
          "lg:static lg:z-auto",
          "flex flex-col transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-glow">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-foreground">LearnHub</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Role Switcher */}
        {onRoleChange && (
          <div className="p-4 border-b border-border">
            <div className="flex gap-2 p-1 bg-accent/50 rounded-xl">
              <button
                onClick={() => onRoleChange("student")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                  userRole === "student"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <GraduationCap className="w-4 h-4" />
                Student
              </button>
              <button
                onClick={() => onRoleChange("teacher")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                  userRole === "teacher"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Users className="w-4 h-4" />
                Teacher
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <ul className="space-y-1.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onSectionChange(item.id);
                      setSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge 
                        variant={item.badge === "Live" ? "destructive" : "secondary"}
                        className={cn(
                          "text-xs",
                          item.badge === "Live" && "animate-pulse"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                    {isActive && <ChevronRight className="w-4 h-4" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile & Help */}
        <div className="p-4 border-t border-border space-y-4 shrink-0">
          <div className="p-4 rounded-xl bg-accent/50 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <HelpCircle className="w-5 h-5 text-primary" />
              <span className="font-medium text-sm">Need Help?</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Get support from our team or browse FAQs
            </p>
            <Button size="sm" variant="outline" className="w-full">
              Contact Support
            </Button>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors cursor-pointer">
            <Avatar className="w-10 h-10 border-2 border-primary/30 shadow-sm">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{userName}</p>
              <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
            </div>
            <Button variant="ghost" size="icon" className="shrink-0">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="hidden sm:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={userRole === "teacher" ? "Search students, classes..." : "Search classes, tasks, or lessons..."}
                className="pl-10 w-64 lg:w-80 bg-accent/50 border-transparent focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            
            <Avatar className="w-9 h-9 border-2 border-primary/30 shadow-sm">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-sm">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-4 lg:p-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
