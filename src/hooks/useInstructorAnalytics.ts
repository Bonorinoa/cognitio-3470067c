import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, subMonths, format, eachDayOfInterval, subDays } from "date-fns";

export interface CourseAnalytics {
  id: string;
  title: string;
  students: number;
  revenue: number;
  completionRate: number;
  totalChapters: number;
}

export interface RevenueTimePoint {
  date: string;
  revenue: number;
  enrollments: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalStudents: number;
  totalCourses: number;
  publishedCourses: number;
  avgCompletionRate: number;
  revenueThisMonth: number;
  studentsThisMonth: number;
  revenueGrowth: number; // percentage
  studentGrowth: number; // percentage
}

export interface InstructorAnalyticsData {
  summary: AnalyticsSummary;
  courseAnalytics: CourseAnalytics[];
  revenueTimeSeries: RevenueTimePoint[];
  recentPurchases: {
    id: string;
    date: string;
    amount: number;
    course: string;
    studentName: string;
  }[];
}

export const useInstructorAnalytics = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["instructor-analytics", user?.id],
    queryFn: async (): Promise<InstructorAnalyticsData> => {
      if (!user) throw new Error("Not authenticated");

      // Fetch all courses for instructor
      const { data: courses, error: coursesError } = await supabase
        .from("courses")
        .select("id, title, is_published, price")
        .eq("instructor_id", user.id);

      if (coursesError) throw coursesError;

      const courseIds = courses?.map((c) => c.id) || [];
      const courseMap = new Map(courses?.map((c) => [c.id, c.title]) || []);

      if (courseIds.length === 0) {
        return {
          summary: {
            totalRevenue: 0,
            totalStudents: 0,
            totalCourses: 0,
            publishedCourses: 0,
            avgCompletionRate: 0,
            revenueThisMonth: 0,
            studentsThisMonth: 0,
            revenueGrowth: 0,
            studentGrowth: 0,
          },
          courseAnalytics: [],
          revenueTimeSeries: [],
          recentPurchases: [],
        };
      }

      // Fetch all purchases for these courses
      const { data: purchases, error: purchasesError } = await supabase
        .from("purchases")
        .select("id, course_id, user_id, amount, created_at")
        .in("course_id", courseIds)
        .order("created_at", { ascending: false });

      if (purchasesError) throw purchasesError;

      // Fetch chapters for each course
      const { data: chapters, error: chaptersError } = await supabase
        .from("chapters")
        .select("id, course_id")
        .in("course_id", courseIds);

      if (chaptersError) throw chaptersError;

      // Count chapters per course
      const chapterCountMap = new Map<string, number>();
      const chapterIdsByCourse = new Map<string, string[]>();
      chapters?.forEach((ch) => {
        chapterCountMap.set(ch.course_id, (chapterCountMap.get(ch.course_id) || 0) + 1);
        const existing = chapterIdsByCourse.get(ch.course_id) || [];
        existing.push(ch.id);
        chapterIdsByCourse.set(ch.course_id, existing);
      });

      // Fetch user progress for completion rates
      const allChapterIds = chapters?.map((ch) => ch.id) || [];
      let progressData: { chapter_id: string; user_id: string; is_completed: boolean }[] = [];
      
      if (allChapterIds.length > 0) {
        const { data: progress } = await supabase
          .from("user_progress")
          .select("chapter_id, user_id, is_completed")
          .in("chapter_id", allChapterIds);
        
        progressData = progress || [];
      }

      // Calculate per-course analytics
      const purchasesByCourse = new Map<string, typeof purchases>();
      purchases?.forEach((p) => {
        const existing = purchasesByCourse.get(p.course_id) || [];
        existing.push(p);
        purchasesByCourse.set(p.course_id, existing);
      });

      // Calculate completion rates per course
      const courseAnalytics: CourseAnalytics[] = (courses || []).map((course) => {
        const coursePurchases = purchasesByCourse.get(course.id) || [];
        const courseChapterIds = chapterIdsByCourse.get(course.id) || [];
        const totalChapters = courseChapterIds.length;

        // Calculate completion rate
        let completionRate = 0;
        if (totalChapters > 0 && coursePurchases.length > 0) {
          const studentProgress = new Map<string, number>();
          
          progressData
            .filter((p) => courseChapterIds.includes(p.chapter_id) && p.is_completed)
            .forEach((p) => {
              studentProgress.set(p.user_id, (studentProgress.get(p.user_id) || 0) + 1);
            });

          // Only count students who have actually enrolled
          const enrolledStudentIds = new Set(coursePurchases.map((p) => p.user_id));
          let totalCompletion = 0;
          let countedStudents = 0;

          enrolledStudentIds.forEach((studentId) => {
            const completedChapters = studentProgress.get(studentId) || 0;
            totalCompletion += completedChapters / totalChapters;
            countedStudents++;
          });

          completionRate = countedStudents > 0 ? (totalCompletion / countedStudents) * 100 : 0;
        }

        return {
          id: course.id,
          title: course.title,
          students: coursePurchases.length,
          revenue: coursePurchases.reduce((sum, p) => sum + Number(p.amount), 0),
          completionRate: Math.round(completionRate),
          totalChapters,
        };
      });

      // Calculate time series (last 30 days)
      const thirtyDaysAgo = subDays(new Date(), 30);
      const days = eachDayOfInterval({ start: thirtyDaysAgo, end: new Date() });

      const revenueTimeSeries: RevenueTimePoint[] = days.map((day) => {
        const dayStr = format(day, "yyyy-MM-dd");
        const dayPurchases = purchases?.filter((p) => 
          format(new Date(p.created_at), "yyyy-MM-dd") === dayStr
        ) || [];

        return {
          date: format(day, "MMM dd"),
          revenue: dayPurchases.reduce((sum, p) => sum + Number(p.amount), 0),
          enrollments: dayPurchases.length,
        };
      });

      // Calculate monthly comparison for growth
      const now = new Date();
      const thisMonthStart = startOfMonth(now);
      const lastMonthStart = startOfMonth(subMonths(now, 1));

      const thisMonthPurchases = purchases?.filter(
        (p) => new Date(p.created_at) >= thisMonthStart
      ) || [];
      const lastMonthPurchases = purchases?.filter(
        (p) => new Date(p.created_at) >= lastMonthStart && new Date(p.created_at) < thisMonthStart
      ) || [];

      const revenueThisMonth = thisMonthPurchases.reduce((sum, p) => sum + Number(p.amount), 0);
      const revenueLastMonth = lastMonthPurchases.reduce((sum, p) => sum + Number(p.amount), 0);
      const studentsThisMonth = new Set(thisMonthPurchases.map((p) => p.user_id)).size;
      const studentsLastMonth = new Set(lastMonthPurchases.map((p) => p.user_id)).size;

      const revenueGrowth = revenueLastMonth > 0 
        ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100 
        : revenueThisMonth > 0 ? 100 : 0;
      const studentGrowth = studentsLastMonth > 0 
        ? ((studentsThisMonth - studentsLastMonth) / studentsLastMonth) * 100 
        : studentsThisMonth > 0 ? 100 : 0;

      // Get unique student IDs
      const uniqueStudentIds = new Set(purchases?.map((p) => p.user_id) || []);

      // Fetch student profiles for recent purchases
      const recentPurchaseData = purchases?.slice(0, 10) || [];
      const studentIds = [...new Set(recentPurchaseData.map((p) => p.user_id))];
      
      const profileMap = new Map<string, string>();
      if (studentIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .in("id", studentIds);
        
        profiles?.forEach((p) => {
          profileMap.set(p.id, p.full_name || p.email || "Usuario");
        });
      }

      const recentPurchases = recentPurchaseData.map((p) => ({
        id: p.id,
        date: format(new Date(p.created_at), "dd MMM yyyy"),
        amount: Number(p.amount),
        course: courseMap.get(p.course_id) || "Curso desconocido",
        studentName: profileMap.get(p.user_id) || "Usuario",
      }));

      // Calculate average completion rate
      const avgCompletionRate = courseAnalytics.length > 0
        ? courseAnalytics.reduce((sum, c) => sum + c.completionRate, 0) / courseAnalytics.length
        : 0;

      const summary: AnalyticsSummary = {
        totalRevenue: purchases?.reduce((sum, p) => sum + Number(p.amount), 0) || 0,
        totalStudents: uniqueStudentIds.size,
        totalCourses: courses?.length || 0,
        publishedCourses: courses?.filter((c) => c.is_published).length || 0,
        avgCompletionRate: Math.round(avgCompletionRate),
        revenueThisMonth,
        studentsThisMonth,
        revenueGrowth: Math.round(revenueGrowth),
        studentGrowth: Math.round(studentGrowth),
      };

      return {
        summary,
        courseAnalytics,
        revenueTimeSeries,
        recentPurchases,
      };
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Helper function to export data as CSV
export const exportAnalyticsCSV = (data: InstructorAnalyticsData) => {
  const { summary, courseAnalytics, recentPurchases } = data;

  // Create CSV content
  let csv = "RESUMEN DE ANALYTICS\n";
  csv += `Ingresos Totales,$${summary.totalRevenue.toFixed(2)}\n`;
  csv += `Total Estudiantes,${summary.totalStudents}\n`;
  csv += `Cursos Publicados,${summary.publishedCourses}\n`;
  csv += `Tasa de Finalización Promedio,${summary.avgCompletionRate}%\n`;
  csv += `Ingresos Este Mes,$${summary.revenueThisMonth.toFixed(2)}\n`;
  csv += `Crecimiento de Ingresos,${summary.revenueGrowth}%\n\n`;

  csv += "ANALYTICS POR CURSO\n";
  csv += "Curso,Estudiantes,Ingresos,Tasa de Finalización,Capítulos\n";
  courseAnalytics.forEach((course) => {
    csv += `"${course.title}",${course.students},$${course.revenue.toFixed(2)},${course.completionRate}%,${course.totalChapters}\n`;
  });

  csv += "\nCOMPRAS RECIENTES\n";
  csv += "Fecha,Curso,Estudiante,Monto\n";
  recentPurchases.forEach((purchase) => {
    csv += `${purchase.date},"${purchase.course}","${purchase.studentName}",$${purchase.amount.toFixed(2)}\n`;
  });

  // Download file
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `analytics_${format(new Date(), "yyyy-MM-dd")}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
