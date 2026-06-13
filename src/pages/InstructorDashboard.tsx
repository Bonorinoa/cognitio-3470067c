import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Sparkles,
  TrendingUp,
  Eye,
  Edit,
  BarChart3,
  CheckCircle2,
  Circle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { InstructorGettingStartedCard } from "@/components/help/InstructorGettingStartedCard";
import { InstructorOnboardingModal } from "@/components/instructor/InstructorOnboardingModal";
import { useInstructorOnboarding } from "@/hooks/useInstructorOnboarding";

interface CourseWithStats {
  id: string;
  title: string;
  is_published: boolean;
  image_url: string | null;
  students: number;
  revenue: number;
  chapters: number;
  updated_at: string;
}

interface RecentEnrollment {
  name: string;
  course: string;
  date: string;
}

const InstructorDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseWithStats[]>([]);
  const [recentEnrollments, setRecentEnrollments] = useState<RecentEnrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  const onboarding = useInstructorOnboarding();
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  useEffect(() => {
    if (onboarding.shouldShow) setOnboardingOpen(true);
  }, [onboarding.shouldShow]);

  useEffect(() => {
    if (user) fetchInstructorData();
  }, [user]);

  const fetchInstructorData = async () => {
    if (!user) return;
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("bio, avatar_url, full_name")
        .eq("id", user.id)
        .single();
      setHasProfile(Boolean(profileData?.bio || profileData?.avatar_url));

      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select("id, title, is_published, image_url, updated_at")
        .eq("instructor_id", user.id)
        .order("updated_at", { ascending: false });
      if (coursesError) throw coursesError;

      const courseIds = coursesData?.map((c) => c.id) || [];

      const chapterCounts: Record<string, number> = {};
      if (courseIds.length > 0) {
        const { data: chaptersData } = await supabase
          .from("chapters")
          .select("course_id")
          .in("course_id", courseIds);
        chaptersData?.forEach((ch) => {
          chapterCounts[ch.course_id] = (chapterCounts[ch.course_id] || 0) + 1;
        });
      }

      const purchaseStats: Record<string, { students: number; revenue: number }> = {};
      if (courseIds.length > 0) {
        const { data: purchasesData } = await supabase
          .from("purchases")
          .select("course_id, amount, user_id, created_at")
          .in("course_id", courseIds);

        purchasesData?.forEach((p) => {
          if (!purchaseStats[p.course_id]) {
            purchaseStats[p.course_id] = { students: 0, revenue: 0 };
          }
          purchaseStats[p.course_id].students += 1;
          purchaseStats[p.course_id].revenue += Number(p.amount);
        });

        const recentPurchases =
          purchasesData
            ?.sort(
              (a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )
            .slice(0, 5) || [];

        const userIds = [...new Set(recentPurchases.map((p) => p.user_id))];
        const profileMap: Record<string, string> = {};
        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, full_name, email")
            .in("id", userIds);
          profiles?.forEach((p) => {
            profileMap[p.id] = p.full_name || p.email || "Anónimo";
          });
        }

        const courseMap: Record<string, string> = {};
        coursesData?.forEach((c) => (courseMap[c.id] = c.title));

        setRecentEnrollments(
          recentPurchases.map((p) => ({
            name: profileMap[p.user_id] || "Anónimo",
            course: courseMap[p.course_id] || "Curso",
            date: getRelativeTime(new Date(p.created_at)),
          }))
        );
      }

      const coursesWithStats: CourseWithStats[] = (coursesData || []).map((c) => ({
        id: c.id,
        title: c.title,
        is_published: c.is_published || false,
        image_url: c.image_url,
        students: purchaseStats[c.id]?.students || 0,
        revenue: purchaseStats[c.id]?.revenue || 0,
        chapters: chapterCounts[c.id] || 0,
        updated_at: c.updated_at,
      }));
      setCourses(coursesWithStats);
    } catch (error) {
      console.error("Error fetching instructor data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRelativeTime = (date: Date) => {
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 60) return t("instructorDashboard.minutesAgo", { count: diffMins });
    if (diffHours < 24) return t("instructorDashboard.hoursAgo", { count: diffHours });
    return t("instructorDashboard.daysAgo", { count: diffDays });
  };

  const firstName =
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "instructor";

  const totalStudents = courses.reduce((acc, c) => acc + c.students, 0);
  const totalRevenue = courses.reduce((acc, c) => acc + c.revenue, 0);
  const publishedCourses = courses.filter((c) => c.is_published).length;
  const draftCourses = courses.length - publishedCourses;

  const hasCourses = courses.length > 0;
  const hasVideos = courses.some((c) => c.chapters > 0);
  const hasPublished = publishedCourses > 0;
  const onboardingComplete = hasProfile && hasCourses && hasVideos && hasPublished;

  // Contextual next steps
  const nextSteps: { label: string; href: string; done: boolean }[] = [
    { label: "Completa tu perfil público", href: "/instructor/settings", done: hasProfile },
    { label: "Crea tu primer curso", href: "/instructor/create", done: hasCourses },
    { label: "Sube contenido de video", href: "/instructor/courses", done: hasVideos },
    { label: "Publica un curso", href: "/instructor/courses", done: hasPublished },
  ];
  const pendingSteps = nextSteps.filter((s) => !s.done).slice(0, 3);

  return (
    <div className="space-y-8 lg:space-y-10">
      {onboarding.profile && (
        <InstructorOnboardingModal
          open={onboardingOpen}
          onOpenChange={setOnboardingOpen}
          profile={onboarding.profile}
          onComplete={onboarding.markComplete}
        />
      )}
      {/* Welcome Strip */}
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
              {hasCourses
                ? `Tenés ${publishedCourses} ${
                    publishedCourses === 1 ? "curso publicado" : "cursos publicados"
                  } y ${totalStudents} ${
                    totalStudents === 1 ? "estudiante" : "estudiantes"
                  } en total. Sigamos.`
                : "Comencemos por crear tu primer curso. Te acompañamos en cada paso."}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/ai-studio">
                <Sparkles className="mr-2 h-4 w-4" />
                Abrir AI Studio
              </Link>
            </Button>
            <Button asChild size="lg" className="rounded-full">
              <Link to="/instructor/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear curso
              </Link>
            </Button>
          </div>
        </div>
        {/* warm coral glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        />
      </motion.section>

      {/* KPI Pulse Row */}
      <section
        aria-label="Métricas clave"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <KpiTile
          label="Estudiantes"
          value={isLoading ? null : totalStudents.toLocaleString()}
          footer={
            courses.length > 0 ? (
              <span className="rounded-full bg-success/10 px-2 py-0.5 font-medium text-success">
                En {courses.length} {courses.length === 1 ? "curso" : "cursos"}
              </span>
            ) : null
          }
        />
        <KpiTile
          label="Ingresos totales"
          value={isLoading ? null : `$${totalRevenue.toLocaleString()}`}
          footer={<span className="text-muted-foreground">Calculado en USD</span>}
        />
        <KpiTile
          label="Cursos publicados"
          value={isLoading ? null : publishedCourses}
          footer={
            publishedCourses > 0 ? (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Todos operativos
              </span>
            ) : (
              <span className="text-muted-foreground">Aún sin publicaciones</span>
            )
          }
        />
        <KpiTile
          label="Borradores"
          value={isLoading ? null : draftCourses}
          footer={
            <span className="text-muted-foreground">
              {draftCourses === 0 ? "Sin borradores" : "Listos para revisión"}
            </span>
          }
        />
      </section>

      {/* Main grid */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Left: Tus cursos */}
        <div className="space-y-5 lg:col-span-8">
          <header className="flex items-baseline justify-between">
            <h2 className="text-2xl font-serif text-foreground">Tus cursos</h2>
            <Link
              to="/instructor/courses"
              className="text-sm font-medium text-primary hover:underline"
            >
              Ver todos los cursos
            </Link>
          </header>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-2">
              <EmptyState
                icon={PlusCircle}
                title="Aún no tienes cursos"
                description="Crea tu primer curso y comienza a compartir tu conocimiento."
                action={{
                  label: "Crear mi primer curso",
                  onClick: () => navigate("/instructor/create"),
                }}
              />
            </div>
          ) : (
            <ul className="space-y-3">
              {courses.slice(0, 5).map((course) => (
                <CourseRow
                  key={course.id}
                  course={course}
                  relativeTime={getRelativeTime(new Date(course.updated_at))}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Right column */}
        <aside className="space-y-6 lg:col-span-4">
          {!onboardingComplete && (
            <InstructorGettingStartedCard
              hasProfile={hasProfile}
              hasCourses={hasCourses}
              hasVideos={hasVideos}
              hasPublished={hasPublished}
            />
          )}

          {/* Actividad reciente */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border/60 px-5 py-4">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="font-medium text-foreground">Actividad reciente</h3>
            </div>
            <div className="space-y-4 p-5">
              {isLoading ? (
                [1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)
              ) : recentEnrollments.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Aún no hay actividad. Aparecerá aquí cuando tengas inscripciones.
                </p>
              ) : (
                recentEnrollments.map((e, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {e.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{e.name}</span> se inscribió en{" "}
                        <span className="text-muted-foreground">{e.course}</span>
                      </p>
                      <span className="text-xs text-muted-foreground">{e.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Próximos pasos */}
          {pendingSteps.length > 0 && (
            <div className="rounded-2xl border border-border bg-secondary/40 p-5">
              <h3 className="mb-4 font-medium text-foreground">Próximos pasos</h3>
              <ul className="space-y-3">
                {pendingSteps.map((step) => (
                  <li key={step.label}>
                    <Link
                      to={step.href}
                      className="group flex items-center gap-3 rounded-md py-1 text-sm text-foreground transition-colors hover:text-primary"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-card">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      </span>
                      <span className="flex-1">{step.label}</span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Studio teaser */}
          <div className="relative overflow-hidden rounded-2xl bg-foreground p-6 text-background">
            <div className="relative z-10">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  AI Studio · Beta
                </span>
              </div>
              <h3 className="mb-1 font-serif text-lg leading-snug">
                Convierte tu material en blogs, newsletters y guiones.
              </h3>
              <p className="mb-4 text-sm text-background/70">
                Tu voz, multiplicada. Sin perder el control editorial.
              </p>
              <Button
                asChild
                size="sm"
                variant="secondary"
                className="rounded-full bg-background text-foreground hover:bg-background/90"
              >
                <Link to="/ai-studio">
                  Probar ahora
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/30 blur-3xl"
            />
          </div>
        </aside>
      </section>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Small pieces
// -----------------------------------------------------------------------------

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
        <Skeleton className="h-9 w-24" />
      ) : (
        <div className="font-serif text-3xl text-foreground">{value}</div>
      )}
      {footer && <div className="mt-4 text-xs">{footer}</div>}
    </div>
  );
}

interface CourseRowProps {
  course: CourseWithStats;
  relativeTime: string;
}

function CourseRow({ course, relativeTime }: CourseRowProps) {
  return (
    <li>
      <div className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-3 transition-all hover:-translate-y-0.5 hover:shadow-sm sm:p-4 sm:gap-6">
        {/* Thumbnail */}
        <Link
          to={`/course/${course.id}`}
          className="block h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary"
        >
          {course.image_url ? (
            <img
              src={course.image_url}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/10">
              <PlusCircle className="h-6 w-6 text-primary/60" />
            </div>
          )}
        </Link>

        {/* Meta */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Link
              to={`/instructor/edit/${course.id}`}
              className="truncate font-medium text-foreground transition-colors hover:text-primary"
            >
              {course.title}
            </Link>
            <span
              className={cn(
                "rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight",
                course.is_published
                  ? "bg-success/10 text-success"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {course.is_published ? "Publicado" : "Borrador"}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            <span>
              {course.students} {course.students === 1 ? "estudiante" : "estudiantes"}
            </span>
            <span aria-hidden>•</span>
            <span>
              {course.chapters} {course.chapters === 1 ? "capítulo" : "capítulos"}
            </span>
            <span aria-hidden>•</span>
            <span>Editado {relativeTime}</span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex shrink-0 items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8" title="Ver">
            <Link to={`/course/${course.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="h-8 w-8" title="Editar">
            <Link to={`/instructor/edit/${course.id}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Analíticas"
          >
            <Link to="/instructor/analytics">
              <BarChart3 className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </li>
  );
}

export default InstructorDashboard;
