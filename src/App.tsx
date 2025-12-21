import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import RequireTeacher from "@/components/RequireTeacher";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CoursesPage from "./pages/CoursesPage";
import CoursePage from "./pages/CoursePage";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherCourses from "./pages/TeacherCourses";
import TeacherAnalytics from "./pages/TeacherAnalytics";
import TeacherSettings from "./pages/TeacherSettings";
import CreateCourse from "./pages/CreateCourse";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/course/:id" element={<CoursePage />} />
            <Route path="/teacher" element={<RequireTeacher><TeacherDashboard /></RequireTeacher>} />
            <Route path="/teacher/courses" element={<RequireTeacher><TeacherCourses /></RequireTeacher>} />
            <Route path="/teacher/create" element={<RequireTeacher><CreateCourse /></RequireTeacher>} />
            <Route path="/teacher/analytics" element={<RequireTeacher><TeacherAnalytics /></RequireTeacher>} />
            <Route path="/teacher/settings" element={<RequireTeacher><TeacherSettings /></RequireTeacher>} />
            <Route path="/auth" element={<AuthPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
