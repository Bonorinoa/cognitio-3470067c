import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import RequireInstructor from "@/components/RequireInstructor";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CoursesPage from "./pages/CoursesPage";
import CoursePage from "./pages/CoursePage";
import AboutPage from "./pages/AboutPage";
import InstructorDashboard from "./pages/InstructorDashboard";
import InstructorCourses from "./pages/InstructorCourses";
import InstructorAnalytics from "./pages/InstructorAnalytics";
import InstructorSettings from "./pages/InstructorSettings";
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
            <Route path="/about" element={<AboutPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/course/:id" element={<CoursePage />} />
            <Route path="/instructor" element={<RequireInstructor><InstructorDashboard /></RequireInstructor>} />
            <Route path="/instructor/courses" element={<RequireInstructor><InstructorCourses /></RequireInstructor>} />
            <Route path="/instructor/create" element={<RequireInstructor><CreateCourse /></RequireInstructor>} />
            <Route path="/instructor/analytics" element={<RequireInstructor><InstructorAnalytics /></RequireInstructor>} />
            <Route path="/instructor/settings" element={<RequireInstructor><InstructorSettings /></RequireInstructor>} />
            <Route path="/auth" element={<AuthPage />} />
            {/* Legacy route redirects for backward compatibility */}
            <Route path="/teacher" element={<Navigate to="/instructor" replace />} />
            <Route path="/teacher/*" element={<Navigate to="/instructor" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
