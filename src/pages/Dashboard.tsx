import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Search, BookOpen, Sparkles, ArrowRight, Compass } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import { CourseCardSkeleton } from "@/components/CourseCardSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { AnimatedTabsTrigger } from "@/components/ui/animated-tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: enrolledCourses = [], isLoading } = useQuery({
    queryKey: ["enrolled-courses", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: purchases, error: purchasesError } = await supabase
        .from("purchases")
        .select("course_id")
        .eq("user_id", user.id);
      if (purchasesError) throw purchasesError;

      const { data: memberships, error: membershipsError } = await supabase
        .from("course_memberships")
        .select("course_id")
        .eq("user_id", user.id);
      if (membershipsError) throw membershipsError;

      const purchaseIds = (purchases || []).map((p) => p.course_id);
      const membershipIds = (memberships || []).map((m) => m.course_id);
      const courseIds = [...new Set([...purchaseIds, ...membershipIds])];

      if (courseIds.length === 0) return [];

      const { data: courses, error: coursesError } = await supabase
        .from("courses")
        .select(`
          id, title, description, image_url, price, category,
          chapters (id, duration_seconds)
        `)
        .in("id", courseIds);
      if (coursesError) throw coursesError;

      const { data: progressData, error: progressError } = await supabase
        .from("user_progress")
        .select("chapter_id, is_completed")
        .eq("user_id", user.id);
      if (progressError) throw progressError;

      const completedChapterIds = new Set(
        (progressData || []).filter((p) => p.is_completed).map((p) => p.chapter_id)
      );

      return (courses || []).map((course) => {
        const chapterIds = course.chapters?.map((ch) => ch.id) || [];
        const completedCount = chapterIds.filter((id) =>
          completedChapterIds.has(id)
        ).length;
        const totalChapters = chapterIds.length;
        const progressPercent =
          totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0;
        const totalDuration =
          course.chapters?.reduce((sum, ch) => sum + (ch.duration_seconds || 0), 0) || 0;

        return {
          id: course.id,
          title: course.title,
          description: course.description || "",
          image:
            course.image_url ||
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600",
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
  const totalChaptersDone = enrolledCourses.reduce(
    (sum, c) => sum + c.completedChapters,
    0
  );
  const overallProgress =
    enrolledCourses.length > 0
      ? Math.round(
          enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length
        )
      : 0;

  const firstName =
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "estudiante";

  // Pick a course to resume: highest progress > 0 and < 100
  const resumeCourse =
    inProgressCourses
      .filter((c) => c.progress > 0)
      .sort((a, b) => b.progress - a.progress)[0] || inProgressCourses[0];

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Welcome strip */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8"
      >
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="mb-2 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
              Hola de nuevo,{" "}
              <span className="font-serif italic text-primary">{firstName}</span>
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
              {enrolledCourses.length > 0
                ? `Llevás ${totalChaptersDone} ${
                    totalChaptersDone === 1 ? "capítulo" : "capítulos"
                  } completados y ${overallProgress}% de avance general. Seguí tu ritmo.`
                : "Explorá el catálogo y comenzá tu primer curso cuando quieras."}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/courses">
                <Compass className="mr-2 h-4 w-4" />
                Explorá el catálogo
              </Link>
            </Button>
            {resumeCourse && (
              <Button asChild size="lg" className="rounded-full">
                <Link to={`/course/${resumeCourse.id}`}>
                  Continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        />
      </motion.section>

      {/* KPI Pulse Row */}
      <section
        aria-label="Tu progreso"
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        <KpiTile
          label="Inscritos"
          value={isLoading ? null : enrolledCourses.length}
          footer={
            <span className="text-muted-foreground">
              {enrolledCourses.length === 1 ? "curso activo" : "cursos activos"}
            </span>
          }
        />
        <KpiTile
          label="En progreso"
          value={isLoading ? null : inProgressCourses.length}
          footer={
            inProgressCourses.length > 0 ? (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
                Sigue así
              </span>
            ) : (
              <span className="text-muted-foreground">Todo al día</span>
            )
          }
        />
        <KpiTile
          label="Completados"
          value={isLoading ? null : completedCourses.length}
          footer={
            <span className="text-muted-foreground">
              {completedCourses.length === 0
                ? "Aún ninguno"
                : completedCourses.length === 1
                ? "curso terminado"
                : "cursos terminados"}
            </span>
          }
        />
        <KpiTile
          label="Avance general"
          value={isLoading ? null : `${overallProgress}%`}
          footer={
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          }
        />
      </section>

      {/* Search */}
      {enrolledCourses.length > 0 && (
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("studentDashboard.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-full border-border bg-card pl-10"
          />
        </div>
      )}

      {/* Courses area */}
      <section className="space-y-5">
        <header className="flex items-baseline justify-between">
          <h2 className="text-2xl font-serif text-foreground">Tus cursos</h2>
          <Link
            to="/courses"
            className="text-sm font-medium text-primary hover:underline"
          >
            Buscar más
          </Link>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        ) : enrolledCourses.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-2">
            <EmptyState
              icon={BookOpen}
              title={t("studentDashboard.noCoursesYet")}
              description={t("studentDashboard.startLearning")}
              action={{
                label: t("studentDashboard.browseCourses"),
                onClick: () => navigate("/courses"),
              }}
            />
          </div>
        ) : (
          <Tabs defaultValue="all" className="space-y-6">
            <LayoutGroup id="student-panel-tabs">
              <TabsList className="bg-card border border-border">
                <AnimatedTabsTrigger value="all" layoutId="student-panel-tabs-indicator">
                  {t("studentDashboard.allCourses")} ({enrolledCourses.length})
                </AnimatedTabsTrigger>
                <AnimatedTabsTrigger
                  value="in-progress"
                  layoutId="student-panel-tabs-indicator"
                >
                  {t("studentDashboard.inProgress")} ({inProgressCourses.length})
                </AnimatedTabsTrigger>
                <AnimatedTabsTrigger
                  value="completed"
                  layoutId="student-panel-tabs-indicator"
                >
                  {t("studentDashboard.completed")} ({completedCourses.length})
                </AnimatedTabsTrigger>
              </TabsList>
            </LayoutGroup>

            <TabsContent value="all">
              {filteredCourses.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title={t("studentDashboard.noCoursesFound")}
                  description={t("studentDashboard.tryDifferentSearch")}
                />
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCourses.map((course) => (
                    <CourseCard key={course.id} {...course} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="in-progress">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {inProgressCourses
                  .filter((c) =>
                    c.title.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((course) => (
                    <CourseCard key={course.id} {...course} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {completedCourses
                  .filter((c) =>
                    c.title.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((course) => (
                    <CourseCard key={course.id} {...course} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </section>

      {/* Discovery teaser */}
      <section className="relative overflow-hidden rounded-2xl bg-foreground p-6 text-background sm:p-8">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                Para ti
              </span>
            </div>
            <h3 className="mb-1 font-serif text-xl leading-snug">
              Descubre instructores que enseñan lo que te interesa.
            </h3>
            <p className="text-sm text-background/70">
              Cursos cortos y profundos, hechos por académicos y profesionales en activo.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="rounded-full bg-background text-foreground hover:bg-background/90"
          >
            <Link to="/instructors">
              Ver instructores
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/30 blur-3xl"
        />
      </section>
    </div>
  );
};

interface KpiTileProps {
  label: string;
  value: number | string | null;
  footer?: React.ReactNode;
}

function KpiTile({ label, value, footer }: KpiTileProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      {value === null ? (
        <Skeleton className="h-9 w-20" />
      ) : (
        <div className="font-serif text-3xl text-foreground">{value}</div>
      )}
      {footer && <div className="mt-4 text-xs">{footer}</div>}
    </div>
  );
}

export default StudentDashboard;
