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
  Bell,
  ChevronRight,
  GraduationCap,
  ClipboardList,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/SearchBar";
import { UserProfileModal } from "@/components/UserProfileModal";
import { UserSearchResult } from "@/services/userService";
import { useAuth } from "@/context/AuthContext";
import ProfileDropdown from "@/components/header/ProfileDropdown";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  userRole?: "student" | "teacher";
  onRoleChange?: (role: "student" | "teacher") => void;
  showRoleSwitcher?: boolean;
}

const studentNavItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "connections", label: "My Teachers", icon: UserPlus },
  { id: "classes", label: "Classes", icon: BookOpen },
  { id: "live-lessons", label: "Live Lessons", icon: Video, badge: "Live" },
 {
  id: "recorded-lessons",
  label: "Recommended Lectures",
  icon: PlayCircle,
}
,
  { id: "tasks", label: "My Tasks", icon: CheckSquare},
  { id: "progress", label: "Progress Tracker", icon: TrendingUp },
  { id: "study-groups", label: "Study Groups", icon: Users },
  { id: "doubt-solver", label: "Doubt Solver", icon: HelpCircle },
  { id: "contact-support", label: "Contact Support", icon: HelpCircle },
  { id: "settings", label: "Settings", icon: Settings },
];

const teacherNavItems = [
  { id: "teacher-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "connections", label: "My Students", icon: UserPlus },
  { id: "my-classes", label: "My Classes", icon: BookOpen },
  { id: "live-sessions", label: "Live Sessions", icon: Video },
  //  badge:2
  { id: "assignments", label: "Assignments", icon: ClipboardList },
  {
  id: "recommend-lecture",
  label: "Recommended Lectures",
  icon: PlayCircle,
},
  { id: "student-progress", label: "Student Progress", icon: TrendingUp },
  { id: "contact-support", label: "Contact Support", icon: HelpCircle },
  { id: "settings", label: "Settings", icon: Settings },
];

export function DashboardLayout({
  children,
  activeSection,
  onSectionChange,
  userRole = "student",
  onRoleChange,
  showRoleSwitcher = false,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { user } = useAuth();

  const navigationItems = userRole === "teacher" ? teacherNavItems : studentNavItems;

  const handleUserSelect = (user: UserSearchResult) => {
    setSelectedUser(user);
    setIsProfileModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* User Profile Modal */}
      <UserProfileModal
        user={selectedUser}
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedUser(null);
        }}
      />

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
          "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border shadow-xl",
          "lg:static lg:z-auto",
          "flex flex-col transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">LearnHub</span>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Role Switcher */}
        {showRoleSwitcher && onRoleChange && (
          <div className="p-4 border-b">
            <div className="flex gap-2 p-1 bg-accent/50 rounded-xl">
              <button
                onClick={() => onRoleChange("student")}
                className={cn(
                  "flex-1 py-2 rounded-lg text-sm font-medium",
                  userRole === "student"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                )}
              >
                Student
              </button>
              <button
                onClick={() => onRoleChange("teacher")}
                className={cn(
                  "flex-1 py-2 rounded-lg text-sm font-medium",
                  userRole === "teacher"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                )}
              >
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
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="flex-1 text-left">{item.label}</span>
                    
                    {isActive && <ChevronRight className="w-4 h-4" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-card/80 backdrop-blur-xl border-b sticky top-0 z-50 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="hidden sm:block">
              <SearchBar
                placeholder={userRole === "teacher" ? "Search students..." : "Search teachers..."}
                onUserSelect={handleUserSelect}
              />
            </div>
          </div>

          {/* 🔥 HEADER RIGHT */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>

            {/* ✅ PROFESSIONAL PROFILE DROPDOWN */}
            <ProfileDropdown />
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
