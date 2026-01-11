import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ScheduleProvider } from "@/context/ScheduleContext"; // ✅ ADDED
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "@/pages/ProfilePage";
import { TaskProvider } from "@/context/TaskContext";



/* ✅ ADDED (from file 2) */
import MyClassesPage from "./pages/MyClassesPage";
import ClassDetailsPage from "./pages/ClassDetailsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
<<<<<<< Updated upstream
         <TaskProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
<Route path="/profile" element={<ProfilePage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/my-tasks" element={<MyTasks />} /> */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TaskProvider>
=======
        {/* ✅ WRAPPED WITH ScheduleProvider */}
        <ScheduleProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* ✅ CLASS ROUTES FROM FILE 2 */}
              <Route path="/my-classes" element={<MyClassesPage />} />
              <Route path="/classes/:id" element={<ClassDetailsPage />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ScheduleProvider>
>>>>>>> Stashed changes
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
