import { lazy, Suspense, Component, ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import RequireInstructor from "@/components/RequireInstructor";
import RequireAdmin from "@/components/RequireAdmin";
import { Loader2, RefreshCw } from "lucide-react";
import { COMING_SOON_FEATURES } from "@/lib/aiStudioRoutes";

// Lazy-loaded layouts - only loaded when user navigates to protected routes
const InstructorLayout = lazy(() => import("./components/InstructorLayout"));
const AIStudioLayout = lazy(() => import("./components/AIStudioLayout"));

// Lazy-loaded page components - only loaded when user navigates to them
const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const CoursePage = lazy(() => import("./pages/CoursePage"));
const InstructorsPage = lazy(() => import("./pages/InstructorsPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const InstructorDashboard = lazy(() => import("./pages/InstructorDashboard"));
const InstructorCourses = lazy(() => import("./pages/InstructorCourses"));
const InstructorAnalytics = lazy(() => import("./pages/InstructorAnalytics"));
const InstructorSettings = lazy(() => import("./pages/InstructorSettings"));
const AIStudioLanding = lazy(() => import("./pages/AIStudioLanding"));
const AIStudioSettings = lazy(() => import("./pages/AIStudioSettings"));
const AIStudioKnowledge = lazy(() => import("./pages/AIStudioKnowledge"));
const AIStudioBlog = lazy(() => import("./pages/AIStudioBlog"));
const MarketingBundleHub = lazy(() => import("./pages/MarketingBundleHub"));
const AcademicBundleHub = lazy(() => import("./pages/AcademicBundleHub"));
const ComingSoonFeature = lazy(() => import("./pages/ComingSoonFeature"));
const InstructorProfile = lazy(() => import("./pages/InstructorProfile"));
const CreateCourse = lazy(() => import("./pages/CreateCourse"));
const EditCourse = lazy(() => import("./pages/EditCourse"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const UserSettings = lazy(() => import("./pages/UserSettings"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Error boundary to handle stale chunk loading failures
class ChunkErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Check if this is a chunk loading error
    if (error.message?.includes('Failed to fetch dynamically imported module')) {
      return { hasError: true };
    }
    throw error;
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 p-4 text-center">
          <RefreshCw className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Update Available</h2>
          <p className="text-muted-foreground max-w-md">
            A new version is available. Please refresh to continue.
          </p>
          <button
            onClick={this.handleRefresh}
            className="mt-4 rounded-md bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <ChunkErrorBoundary>
            <Suspense fallback={<PageLoader />}>
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
              <Route path="/ai-studio" element={<AIStudioLayout />}>
                <Route index element={<AIStudioLanding />} />
                <Route path="knowledge" element={<AIStudioKnowledge />} />
                <Route path="settings" element={<AIStudioSettings />} />
                
                {/* Marketing Bundle */}
                <Route path="marketing">
                  <Route index element={<MarketingBundleHub />} />
                  <Route path="blog" element={<AIStudioBlog />} />
                  <Route path="linkedin" element={<ComingSoonFeature {...COMING_SOON_FEATURES.marketing.linkedin} />} />
                  <Route path="twitter" element={<ComingSoonFeature {...COMING_SOON_FEATURES.marketing.twitter} />} />
                  <Route path="newsletter" element={<ComingSoonFeature {...COMING_SOON_FEATURES.marketing.newsletter} />} />
                </Route>
                
                {/* Academic Bundle */}
                <Route path="academic">
                  <Route index element={<AcademicBundleHub />} />
                  <Route path="literature-review" element={<ComingSoonFeature {...COMING_SOON_FEATURES.academic["literature-review"]} />} />
                  <Route path="paper-formatter" element={<ComingSoonFeature {...COMING_SOON_FEATURES.academic["paper-formatter"]} />} />
                  <Route path="paper-editor" element={<ComingSoonFeature {...COMING_SOON_FEATURES.academic["paper-editor"]} />} />
                </Route>
              </Route>
              
              {/* Backward compatibility redirect */}
              <Route path="/ai-studio/blog" element={<Navigate to="/ai-studio/marketing/blog" replace />} />
              
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
            </Suspense>
          </ChunkErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
