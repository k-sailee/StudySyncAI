import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { ClassesSection } from "@/components/dashboard/ClassesSection";
import { LessonsTable } from "@/components/dashboard/LessonsTable";
import { RightSidebar } from "@/components/dashboard/RightSidebar";
import { FocusTimer } from "@/components/dashboard/FocusTimer";
import { LiveLessonsPage } from "@/components/pages/LiveLessonsPage";
import { RecordedLessonsPage } from "@/components/pages/RecordedLessonsPage";
import { TasksPage } from "@/components/pages/TasksPage";
import { DoubtSolverPage } from "@/components/pages/DoubtSolverPage";
import { TeacherDashboardPage } from "@/components/pages/TeacherDashboardPage";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [userRole, setUserRole] = useState<"student" | "teacher">("student");

  const handleRoleChange = (role: "student" | "teacher") => {
    setUserRole(role);
    // Reset to appropriate dashboard when switching roles
    if (role === "teacher") {
      setActiveSection("teacher-dashboard");
    } else {
      setActiveSection("dashboard");
    }
  };

  const renderContent = () => {
    // Teacher sections
    if (userRole === "teacher") {
      switch (activeSection) {
        case "teacher-dashboard":
          return (
            <div className="space-y-6">
              <WelcomeSection userName="Prof. Smith" role="teacher" />
              <TeacherDashboardPage />
            </div>
          );
        case "my-classes":
        case "live-sessions":
        case "assignments":
        case "student-progress":
        case "doubt-history":
          return <TeacherDashboardPage />;
        default:
          return (
            <div className="space-y-6">
              <WelcomeSection userName="Prof. Smith" role="teacher" />
              <TeacherDashboardPage />
            </div>
          );
      }
    }

    // Student sections
    switch (activeSection) {
      case "live-lessons":
        return <LiveLessonsPage />;
      case "recorded-lessons":
        return <RecordedLessonsPage />;
      case "tasks":
        return <TasksPage />;
      case "doubt-solver":
        return <DoubtSolverPage />;
      case "dashboard":
      default:
        return (
          <div className="flex gap-6">
            <div className="flex-1 min-w-0 space-y-6">
              <WelcomeSection userName="John" role="student" />
              <ClassesSection />
              <div className="grid lg:grid-cols-2 gap-6">
                <LessonsTable />
                <FocusTimer />
              </div>
            </div>
            <RightSidebar />
          </div>
        );
    }
  };

  return (
    <DashboardLayout 
      activeSection={activeSection} 
      onSectionChange={setActiveSection}
      userRole={userRole}
      onRoleChange={handleRoleChange}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default Index;
