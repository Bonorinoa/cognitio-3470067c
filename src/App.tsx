import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import RequireInstructor from "@/components/RequireInstructor";
import RequireAdmin from "@/components/RequireAdmin";
import RequireAuth from "@/components/RequireAuth";
import { Loader2 } from "lucide-react";
import { COMING_SOON_FEATURES } from "@/lib/aiStudioRoutes";
import { instructorNav, studentNav, adminNav, aiStudioNav } from "@/config/panelNav";

// Lazy-loaded layouts - only loaded when user navigates to protected routes
const PanelLayout = lazy(() => import("./components/panel/PanelLayout"));

// Lazy-loaded page components - only loaded when user navigates to them
const Index = lazy(() => import("./pages/Index"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const CoursePage = lazy(() => import("./pages/CoursePage"));
const InstructorsPage = lazy(() => import("./pages/InstructorsPage"));
const InstructorsDirectoryPage = lazy(() => import("./pages/InstructorsDirectoryPage"));
const PlanesPage = lazy(() => import("./pages/ServicesPage"));
const ConsultoriasPage = lazy(() => import("./pages/ServicesCatalogPage"));
const InstitutionsPage = lazy(() => import("./pages/InstitutionsPage"));
const InstructorDashboard = lazy(() => import("./pages/InstructorDashboard"));
const InstructorCourses = lazy(() => import("./pages/InstructorCourses"));
const InstructorAnalytics = lazy(() => import("./pages/InstructorAnalytics"));
const InstructorSettings = lazy(() => import("./pages/InstructorSettings"));
const InstructorGuide = lazy(() => import("./pages/InstructorGuide"));
const AIStudioLanding = lazy(() => import("./pages/AIStudioLanding"));
const AIStudioSettings = lazy(() => import("./pages/AIStudioSettings"));
const AIStudioKnowledge = lazy(() => import("./pages/AIStudioKnowledge"));
const AIStudioDrafts = lazy(() => import("./pages/AIStudioDrafts"));
const AIStudioBlog = lazy(() => import("./pages/AIStudioBlog"));
const MarketingBundleHub = lazy(() => import("./pages/MarketingBundleHub"));
const AcademicBundleHub = lazy(() => import("./pages/AcademicBundleHub"));
const ComingSoonFeature = lazy(() => import("./pages/ComingSoonFeature"));
const InstructorProfile = lazy(() => import("./pages/InstructorProfile"));
const CreateCourse = lazy(() => import("./pages/CreateCourse"));
const EditCourse = lazy(() => import("./pages/EditCourse"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminAITutor = lazy(() => import("./pages/AdminAITutor"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const UserSettings = lazy(() => import("./pages/UserSettings"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const FAQPage = lazy(() => import("./pages/FAQPage"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/plataforma" element={<Navigate to="/instructors" replace />} />
                <Route path="/platform" element={<Navigate to="/instructors" replace />} />
                <Route path="/instituciones" element={<InstitutionsPage />} />
                <Route path="/institutions" element={<Navigate to="/instituciones" replace />} />
                <Route path="/instructors" element={<InstructorsPage />} />
                <Route path="/instructors/directory" element={<InstructorsDirectoryPage />} />
                <Route path="/planes" element={<PlanesPage />} />
                <Route path="/consultorias" element={<ConsultoriasPage />} />
                {/* Legacy redirects */}
                <Route path="/services" element={<Navigate to="/planes" replace />} />
                <Route path="/services/catalog" element={<Navigate to="/consultorias" replace />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/course/:id" element={<CoursePage />} />

                {/* Student panel with shared layout */}
                <Route path="/dashboard" element={<RequireAuth><PanelLayout nav={studentNav} /></RequireAuth>}>
                  <Route index element={<Dashboard />} />
                </Route>

                {/* Instructor routes with shared layout */}
                <Route path="/instructor" element={<RequireInstructor><PanelLayout nav={instructorNav} /></RequireInstructor>}>
                  <Route index element={<InstructorDashboard />} />
                  <Route path="courses" element={<InstructorCourses />} />
                  <Route path="create" element={<CreateCourse />} />
                  <Route path="analytics" element={<InstructorAnalytics />} />
                  <Route path="guide" element={<InstructorGuide />} />
                  <Route path="settings" element={<InstructorSettings />} />
                  <Route path="edit/:id" element={<EditCourse />} />
                </Route>

                {/* AI Studio routes — share the unified panel shell */}
                <Route path="/ai-studio" element={<PanelLayout nav={aiStudioNav} />}>
                  <Route index element={<AIStudioLanding />} />
                  <Route path="knowledge" element={<AIStudioKnowledge />} />
                  <Route path="drafts" element={<AIStudioDrafts />} />
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
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/faq" element={<FAQPage />} />
                {/* Admin panel with shared layout */}
                <Route path="/admin" element={<RequireAdmin><PanelLayout nav={adminNav} /></RequireAdmin>}>
                  <Route index element={<AdminUsers />} />
                  <Route path="ai-tutor" element={<AdminAITutor />} />
                </Route>
                {/* Legacy route redirects for backward compatibility */}
                <Route path="/teacher" element={<Navigate to="/instructor" replace />} />
                <Route path="/teacher/*" element={<Navigate to="/instructor" replace />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
