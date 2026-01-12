import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/context/AuthContext";
import { TaskProvider } from "@/context/TaskContext";
import { ScheduleProvider } from "@/context/ScheduleContext";

import ProtectedRoute from "@/components/ProtectedRoute";
import TaskBootstrap from "@/components/TaskBootstrap";

import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "@/pages/ProfilePage";
import MyClassesPage from "./pages/MyClassesPage";
import ClassDetailsPage from "./pages/ClassDetailsPage";
import GroupChatPage from "./pages/GroupChat";
import RecommendLecture from "@/pages/teacher/RecommendLecture";
import ZombieGame from "./pages/ZombieGame";
// import RecommendedLectures from "./pages/student/RecommendedLectures";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <AuthProvider>
        <TaskProvider>
          <ScheduleProvider>
            <TaskBootstrap />

            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
{/* <Route
  path="/teacher/recommend-lecture"
  element={<RecommendLecture />}
/>

<Route path="/student/recommended-lectures" element={<RecommendedLectures />} /> */}

                {/* Class routes */}
                <Route path="/my-classes" element={<MyClassesPage />} />
                <Route path="/classes/:id" element={<ClassDetailsPage />} />

                {/* Protected dashboard */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  }
                />

                <Route path="/zombie-game" element={<ProtectedRoute><ZombieGame /></ProtectedRoute>} />
                <Route path="/groups/:id/chat" element={<ProtectedRoute><GroupChatPage /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>

          </ScheduleProvider>
        </TaskProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
