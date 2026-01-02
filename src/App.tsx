import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import RequireInstructor from "@/components/RequireInstructor";
import RequireAdmin from "@/components/RequireAdmin";
import InstructorLayout from "@/components/InstructorLayout";
import AIStudioLayout from "@/components/AIStudioLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CoursesPage from "./pages/CoursesPage";
import CoursePage from "./pages/CoursePage";

import InstructorsPage from "./pages/InstructorsPage";
import ServicesPage from "./pages/ServicesPage";
import InstructorDashboard from "./pages/InstructorDashboard";
import InstructorCourses from "./pages/InstructorCourses";
import InstructorAnalytics from "./pages/InstructorAnalytics";
import InstructorSettings from "./pages/InstructorSettings";
import AIStudioDashboard from "./pages/AIStudioDashboard";
import AIStudioKnowledge from "./pages/AIStudioKnowledge";
import AIStudioBlog from "./pages/AIStudioBlog";
import InstructorProfile from "./pages/InstructorProfile";
import CreateCourse from "./pages/CreateCourse";
import EditCourse from "./pages/EditCourse";
import AuthPage from "./pages/AuthPage";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UserSettings from "./pages/UserSettings";

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
            <Route path="/about" element={<Navigate to="/instructors" replace />} />
            <Route path="/instructors" element={<InstructorsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/course/:id" element={<CoursePage />} />
            
            {/* Instructor routes with shared layout */}
            <Route path="/instructor" element={<RequireInstructor><InstructorLayout /></RequireInstructor>}>
              <Route index element={<InstructorDashboard />} />
              <Route path="courses" element={<InstructorCourses />} />
              <Route path="create" element={<CreateCourse />} />
              <Route path="analytics" element={<InstructorAnalytics />} />
              <Route path="settings" element={<InstructorSettings />} />
              <Route path="edit/:id" element={<EditCourse />} />
            </Route>
            
            {/* AI Studio routes with dedicated layout */}
            <Route path="/ai-studio" element={<RequireInstructor><AIStudioLayout /></RequireInstructor>}>
              <Route index element={<AIStudioDashboard />} />
              <Route path="knowledge" element={<AIStudioKnowledge />} />
              <Route path="blog" element={<AIStudioBlog />} />
            </Route>
            
            {/* Public instructor profile - not part of layout */}
            <Route path="/instructor/profile/:id" element={<InstructorProfile />} />
            
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/settings" element={<UserSettings />} />
            <Route path="/admin" element={<RequireAdmin><AdminPanel /></RequireAdmin>} />
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
