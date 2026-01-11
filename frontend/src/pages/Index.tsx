import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import TeacherDashboardPage from "@/components/pages/TeacherDashboardPage";
import ContactSupportPage from "./ContactSupport";
import { ConnectionsPage } from "@/components/pages/ConnectionsPage";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams , useLocation} from "react-router-dom";

import TeacherAssignmentsPage from "@/components/pages/TeacherAssignmentsPage";

/* ✅ ADDED */
import TeacherScheduledClasses from "@/components/dashboard/TeacherScheduledClasses";
import StudentScheduledClasses from "@/components/dashboard/StudentScheduledClasses";

const Index = () => {
  // const [activeSection, setActiveSection] = useState("dashboard");
const location = useLocation();
const [activeSection, setActiveSection] = useState("dashboard");

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const sectionFromUrl = params.get("section");

  if (sectionFromUrl) {
    setActiveSection(sectionFromUrl);
  }
}, [location.search]);

useEffect(() => {
  const handler = (e: any) => {
    if (e.detail?.section) {
      setActiveSection(e.detail.section);
    }
  };

  window.addEventListener("dashboard:navigate", handler);
  return () => window.removeEventListener("dashboard:navigate", handler);
}, []);


  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const userRole = user?.role || "student";
  const userName =
    user?.displayName || (userRole === "teacher" ? "Prof. Smith" : "John Doe");

  /* ✅ SAME LOGIC AS FILE 1 */
  const getInitialSection = () => {
    if (!activeSection || activeSection === "dashboard") {
      return userRole === "teacher" ? "teacher-dashboard" : "dashboard";
    }
    return activeSection;
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      navigate("/login");
    } catch {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const renderContent = () => {
    /* Shared */
    if (activeSection === "connections") {
      return <ConnectionsPage />;
    }

    /* ================= TEACHER ================= */
    if (userRole === "teacher") {
      switch (activeSection) {
        case "teacher-dashboard":
          return (
            <div className="space-y-6">
              <WelcomeSection userName={userName} role="teacher" />
              <TeacherDashboardPage />
            </div>
          );

        case "my-classes":
          return (
            <div className="space-y-6">
              <WelcomeSection userName={userName} role="teacher" />
              <TeacherScheduledClasses />
            </div>
          );

        case "live-sessions":
        case "assignments":
          return <TeacherAssignmentsPage />;

        default:
          return (
            <div className="space-y-6">
              <WelcomeSection userName={userName} role="teacher" />
              <TeacherDashboardPage />
            </div>
          );
      }
    }

    /* ================= STUDENT ================= */
    switch (activeSection) {
      case "live-lessons":
        return <LiveLessonsPage />;

      case "recorded-lessons":
        return <RecordedLessonsPage />;

      case "tasks":
        return <TasksPage />;

      case "doubt-solver":
        return <DoubtSolverPage />;

      case "contact-support":
        return <ContactSupportPage />;

      case "dashboard":
      default:
        return (
          <div className="flex gap-6">
  {/* LEFT + CENTER */}
  <div className="flex-1 min-w-0 space-y-6">
    <WelcomeSection userName={userName} role="student" />
    <StudentScheduledClasses />
    {/* Lessons + Focus Timer side by side */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <LessonsTable />
      <FocusTimer />
    </div>
  </div>

  {/* RIGHT SIDEBAR */}
  <RightSidebar />
</div>

        );
    }
  };

  return (
    <DashboardLayout
      activeSection={getInitialSection()}
      onSectionChange={setActiveSection}
      userRole={userRole}
      showRoleSwitcher={false}
      onLogout={handleLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default Index;






















// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { DashboardLayout } from "@/components/layout/DashboardLayout";
// import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
// import { ClassesSection } from "@/components/dashboard/ClassesSection";
// import { LessonsTable } from "@/components/dashboard/LessonsTable";
// import { RightSidebar } from "@/components/dashboard/RightSidebar";
// import { FocusTimer } from "@/components/dashboard/FocusTimer";
// import { LiveLessonsPage } from "@/components/pages/LiveLessonsPage";
// import { RecordedLessonsPage } from "@/components/pages/RecordedLessonsPage";
// import { TasksPage } from "@/components/pages/TasksPage";
// import { DoubtSolverPage } from "@/components/pages/DoubtSolverPage";
// import  TeacherDashboardPage  from "@/components/pages/TeacherDashboardPage";
// import ContactSupportPage from "./ContactSupport";
// import { ConnectionsPage } from "@/components/pages/ConnectionsPage";
// import { useAuth } from "@/context/AuthContext";
// import { useToast } from "@/hooks/use-toast";
// import TeacherAssignmentsPage from "@/components/pages/TeacherAssignmentsPage";
// const Index = () => {
//   const [activeSection, setActiveSection] = useState("dashboard");
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const userRole = user?.role || "student";
// const userName = user?.displayName || "User";


//   // Initialize to correct dashboard based on role
//   const getInitialSection = () => {
//     if (!activeSection || activeSection === "dashboard") {
//       return userRole === "teacher" ? "teacher-dashboard" : "dashboard";
//     }
//     return activeSection;
//   };

//   const handleLogout = async () => {
//     try {
//       await logout();
//       toast({
//         title: "Success",
//         description: "Logged out successfully",
//       });
//       navigate("/login");
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to logout",
//         variant: "destructive",
//       });
//     }
//   };

//   const renderContent = () => {
//     // Shared sections (both teacher and student)
//     if (activeSection === "connections") {
//       return <ConnectionsPage />;
//     }

//     // Teacher sections
//     if (userRole === "teacher") {
//       switch (activeSection) {
//         case "teacher-dashboard":
//           return (
//             <div className="space-y-6">
//               <WelcomeSection userName={userName} role="teacher" />
//               <TeacherDashboardPage />
//             </div>
//           );
//         case "my-classes":
//         case "live-sessions":
//         case "assignments":
//            return <TeacherAssignmentsPage />;
//         case "student-progress":
//         case "doubt-history":
//           return <TeacherDashboardPage />;
//         default:
//           return (
//             <div className="space-y-6">
//               <WelcomeSection userName={userName} role="teacher" />
//               <TeacherDashboardPage />
//             </div>
//           );
//       }
//     }

//     // Student sections
//     switch (activeSection) {
//       case "live-lessons":
//         return <LiveLessonsPage />;
//       case "recorded-lessons":
//         return <RecordedLessonsPage />;
//       case "tasks":
//         return <TasksPage />;
//       case "doubt-solver":
//         return <DoubtSolverPage />;
//       case "contact-support":
//         return <ContactSupportPage />;
//       case "dashboard":
//       default:
//         return (
//           <div className="flex gap-6">
//             <div className="flex-1 min-w-0 space-y-6">
//               <WelcomeSection userName={userName} role={userRole} />
//               <ClassesSection />
//               <div className="grid lg:grid-cols-2 gap-6">
//                 <LessonsTable />
//                 <FocusTimer />
//               </div>
//             </div>
//             <RightSidebar />
//           </div>
//         );
//     }
//   };

//   return (
//     <DashboardLayout 
//       activeSection={activeSection}
//       onSectionChange={setActiveSection}
//       userRole={userRole}
//       showRoleSwitcher={false}
//       onLogout={handleLogout}
//     >
//       {renderContent()}
//     </DashboardLayout>
//   );
// };

// export default Index;
