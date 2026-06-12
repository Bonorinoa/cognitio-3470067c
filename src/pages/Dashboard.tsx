import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import CourseCard from "@/components/CourseCard";
import { CourseCardSkeleton } from "@/components/CourseCardSkeleton";
import { StatsCardSkeleton } from "@/components/StatsCardSkeleton";
import { EmptyState } from "@/components/EmptyState";
import ProgressCard from "@/components/ProgressCard";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { AnimatedTabsTrigger } from "@/components/ui/animated-tabs";
import { Input } from "@/components/ui/input";
import { Search, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LayoutGroup } from "framer-motion";


interface EnrolledCourse {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  chaptersCount: number;
  totalDurationSeconds: number;
  progress: number;
  category: string;
  completedChapters: number;
}

const StudentDashboard = () => {
  const { t } = useTranslation();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch enrolled courses (purchases + memberships) with progress
  const { data: enrolledCourses = [], isLoading } = useQuery({
    queryKey: ["enrolled-courses", user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get all purchases for this user
      const { data: purchases, error: purchasesError } = await supabase
        .from("purchases")
        .select("course_id")
        .eq("user_id", user.id);

      if (purchasesError) throw purchasesError;

      // Get all memberships for this user (private/unlisted courses)
      const { data: memberships, error: membershipsError } = await supabase
        .from("course_memberships")
        .select("course_id")
        .eq("user_id", user.id);

      if (membershipsError) throw membershipsError;

      // Combine and deduplicate course IDs
      const purchaseIds = (purchases || []).map((p) => p.course_id);
      const membershipIds = (memberships || []).map((m) => m.course_id);
      const courseIds = [...new Set([...purchaseIds, ...membershipIds])];

      if (courseIds.length === 0) return [];

      // Get course details with chapters
      const { data: courses, error: coursesError } = await supabase
        .from("courses")
        .select(`
          id,
          title,
          description,
          image_url,
          price,
          category,
          chapters (id, duration_seconds)
        `)
        .in("id", courseIds);

      if (coursesError) throw coursesError;

      // Get user progress for all chapters
      const { data: progressData, error: progressError } = await supabase
        .from("user_progress")
        .select("chapter_id, is_completed")
        .eq("user_id", user.id);

      if (progressError) throw progressError;

      const completedChapterIds = new Set(
        (progressData || [])
          .filter((p) => p.is_completed)
          .map((p) => p.chapter_id)
      );

      return (courses || []).map((course) => {
        const chapterIds = course.chapters?.map((ch) => ch.id) || [];
        const completedCount = chapterIds.filter((id) => completedChapterIds.has(id)).length;
        const totalChapters = chapterIds.length;
        const progressPercent = totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0;
        const totalDuration = course.chapters?.reduce((sum, ch) => sum + (ch.duration_seconds || 0), 0) || 0;

        return {
          id: course.id,
          title: course.title,
          description: course.description || "",
          image: course.image_url || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600",
          price: Number(course.price),
          chaptersCount: totalChapters,
          totalDurationSeconds: totalDuration,
          progress: progressPercent,
          category: course.category || "Development",
          completedChapters: completedCount,
        } as EnrolledCourse;
      });
    },
    enabled: !!user,
  });

  const completedCourses = enrolledCourses.filter((c) => c.progress === 100);
  const inProgressCourses = enrolledCourses.filter((c) => c.progress < 100);

  const filteredCourses = enrolledCourses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const overallProgress = enrolledCourses.length > 0
    ? Math.round(enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length)
    : 0;

  // Redirect to auth if not logged in
  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t("studentDashboard.welcomeBack")}{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}!
          </h1>
          <p className="text-muted-foreground">{t("studentDashboard.continueJourney")}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {isLoading ? (
            <>
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </>
          ) : (
            <>
              <ProgressCard
                title={t("studentDashboard.coursesEnrolled")}
                value={enrolledCourses.length}
                icon="courses"
                subtitle={t("studentDashboard.activeCourses")}
              />
              <ProgressCard
                title={t("studentDashboard.coursesCompleted")}
                value={completedCourses.length}
                icon="award"
                subtitle={t("studentDashboard.greatProgress")}
              />
              <ProgressCard
                title={t("studentDashboard.chaptersCompleted")}
                value={enrolledCourses.reduce((sum, c) => sum + c.completedChapters, 0)}
                icon="time"
                subtitle={t("studentDashboard.totalCompleted")}
              />
              <ProgressCard
                title={t("studentDashboard.overallProgress")}
                value={`${overallProgress}%`}
                icon="trending"
                progress={overallProgress}
                subtitle={t("studentDashboard.keepGoing")}
              />
            </>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("studentDashboard.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Tabs */}
        {!isLoading && enrolledCourses.length > 0 && (
          <Tabs defaultValue="all" className="space-y-6">
            <LayoutGroup id="dashboard-tabs">
              <TabsList className="bg-card border border-border">
                <AnimatedTabsTrigger value="all" layoutId="dashboard-tabs-indicator">
                  {t("studentDashboard.allCourses")} ({enrolledCourses.length})
                </AnimatedTabsTrigger>
                <AnimatedTabsTrigger value="in-progress" layoutId="dashboard-tabs-indicator">
                  {t("studentDashboard.inProgress")} ({inProgressCourses.length})
                </AnimatedTabsTrigger>
                <AnimatedTabsTrigger value="completed" layoutId="dashboard-tabs-indicator">
                  {t("studentDashboard.completed")} ({completedCourses.length})
                </AnimatedTabsTrigger>
              </TabsList>
            </LayoutGroup>

            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="in-progress">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgressCourses
                  .filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((course) => (
                    <CourseCard key={course.id} {...course} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedCourses
                  .filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((course) => (
                    <CourseCard key={course.id} {...course} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Empty state - no courses */}
        {!isLoading && enrolledCourses.length === 0 && (
          <EmptyState
            icon={BookOpen}
            title={t("studentDashboard.noCoursesYet")}
            description={t("studentDashboard.startLearning")}
            action={{
              label: t("studentDashboard.browseCourses"),
              onClick: () => navigate("/courses")
            }}
          />
        )}

        {/* Empty state - search has no results */}
        {!isLoading && enrolledCourses.length > 0 && filteredCourses.length === 0 && (
          <EmptyState
            icon={Search}
            title={t("studentDashboard.noCoursesFound")}
            description={t("studentDashboard.tryDifferentSearch")}
          />
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
