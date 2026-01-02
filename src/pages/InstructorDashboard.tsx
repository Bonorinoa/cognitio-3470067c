import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProgressCard from "@/components/ProgressCard";
import { StatsCardSkeleton } from "@/components/StatsCardSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, Eye, Edit, TrendingUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseWithStats {
  id: string;
  title: string;
  is_published: boolean;
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

  useEffect(() => {
    if (user) {
      fetchInstructorData();
    }
  }, [user]);

  const fetchInstructorData = async () => {
    if (!user) return;

    try {
      // Fetch courses with chapter counts
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select(`
          id,
          title,
          is_published,
          updated_at
        `)
        .eq("instructor_id", user.id)
        .order("updated_at", { ascending: false });

      if (coursesError) throw coursesError;

      // Fetch chapter counts for each course
      const courseIds = coursesData?.map(c => c.id) || [];
      
      const chapterCounts: Record<string, number> = {};
      if (courseIds.length > 0) {
        const { data: chaptersData } = await supabase
          .from("chapters")
          .select("course_id")
          .in("course_id", courseIds);
        
        chaptersData?.forEach(ch => {
          chapterCounts[ch.course_id] = (chapterCounts[ch.course_id] || 0) + 1;
        });
      }

      // Fetch purchases for revenue and student counts
      const purchaseStats: Record<string, { students: number; revenue: number }> = {};
      if (courseIds.length > 0) {
        const { data: purchasesData } = await supabase
          .from("purchases")
          .select("course_id, amount, user_id, created_at")
          .in("course_id", courseIds);
        
        purchasesData?.forEach(p => {
          if (!purchaseStats[p.course_id]) {
            purchaseStats[p.course_id] = { students: 0, revenue: 0 };
          }
          purchaseStats[p.course_id].students += 1;
          purchaseStats[p.course_id].revenue += Number(p.amount);
        });

        // Get recent enrollments
        const recentPurchases = purchasesData
          ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5) || [];

        // Fetch user profiles for recent enrollments
        const userIds = [...new Set(recentPurchases.map(p => p.user_id))];
        const profileMap: Record<string, string> = {};
        
        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, full_name, email")
            .in("id", userIds);
          
          profiles?.forEach(p => {
            profileMap[p.id] = p.full_name || p.email || "Unknown User";
          });
        }

        const courseMap: Record<string, string> = {};
        coursesData?.forEach(c => {
          courseMap[c.id] = c.title;
        });

        const enrollments: RecentEnrollment[] = recentPurchases.map(p => ({
          name: profileMap[p.user_id] || "Unknown User",
          course: courseMap[p.course_id] || "Unknown Course",
          date: getRelativeTime(new Date(p.created_at)),
        }));

        setRecentEnrollments(enrollments);
      }

      // Combine all data
      const coursesWithStats: CourseWithStats[] = (coursesData || []).map(course => ({
        id: course.id,
        title: course.title,
        is_published: course.is_published || false,
        students: purchaseStats[course.id]?.students || 0,
        revenue: purchaseStats[course.id]?.revenue || 0,
        chapters: chapterCounts[course.id] || 0,
        updated_at: course.updated_at,
      }));

      setCourses(coursesWithStats);
    } catch (error) {
      console.error("Error fetching instructor data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return t("instructorDashboard.minutesAgo", { count: diffMins });
    if (diffHours < 24) return t("instructorDashboard.hoursAgo", { count: diffHours });
    return t("instructorDashboard.daysAgo", { count: diffDays });
  };

  const totalStudents = courses.reduce((acc, c) => acc + c.students, 0);
  const totalRevenue = courses.reduce((acc, c) => acc + c.revenue, 0);
  const publishedCourses = courses.filter((c) => c.is_published).length;

  return (
    <>
      {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t("instructorDashboard.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("instructorDashboard.subtitle")}
            </p>
          </div>
          <Link to="/instructor/create">
            <Button>
              <PlusCircle className="mr-2 h-5 w-5" />
              {t("instructorDashboard.createCourse")}
            </Button>
          </Link>
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
                title={t("instructorDashboard.totalStudents")}
                value={totalStudents.toLocaleString()}
                icon="courses"
                subtitle={courses.length > 0 ? t("instructorDashboard.acrossCourses", { count: courses.length }) : undefined}
              />
              <ProgressCard
                title={t("instructorDashboard.totalRevenue")}
                value={`$${totalRevenue.toLocaleString()}`}
                icon="trending"
              />
              <ProgressCard
                title={t("instructorDashboard.publishedCourses")}
                value={publishedCourses}
                icon="award"
              />
              <ProgressCard
                title={t("instructorDashboard.draftCourses")}
                value={courses.length - publishedCourses}
                icon="trending"
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Courses Table */}
          <Card className="lg:col-span-2 border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">{t("instructorDashboard.yourCourses")}</CardTitle>
              <Link to="/instructor/courses">
                <Button variant="ghost" size="sm">
                  {t("instructorDashboard.viewAll")}
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : courses.length === 0 ? (
                <EmptyState
                  icon={PlusCircle}
                  title={t("instructorDashboard.noCourses")}
                  description={t("instructorDashboard.createFirstDescription", "Crea tu primer curso y comienza a compartir tu conocimiento con estudiantes de todo el mundo.")}
                  action={{
                    label: t("instructorDashboard.createFirst"),
                    onClick: () => navigate("/instructor/create")
                  }}
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">{t("instructorDashboard.course")}</TableHead>
                      <TableHead className="text-muted-foreground">{t("instructorDashboard.status")}</TableHead>
                      <TableHead className="text-muted-foreground">{t("instructorDashboard.students")}</TableHead>
                      <TableHead className="text-muted-foreground">{t("instructorDashboard.revenue")}</TableHead>
                      <TableHead className="text-muted-foreground w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id} className="border-border">
                        <TableCell className="font-medium text-foreground">
                          {course.title}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={course.is_published ? "default" : "outline"}
                            className={
                              course.is_published
                                ? "bg-accent/20 text-accent-foreground border-accent/30"
                                : "border-border text-muted-foreground"
                            }
                          >
                            {course.is_published ? t("instructorDashboard.published") : t("instructorDashboard.draft")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {course.students.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          ${course.revenue.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/course/${course.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  {t("instructorDashboard.view")}
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/instructor/edit/${course.id}`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  {t("instructorDashboard.edit")}
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                {t("instructorDashboard.recentEnrollments")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : recentEnrollments.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">
                  {t("instructorDashboard.noEnrollments")}
                </p>
              ) : (
                <div className="space-y-4">
                  {recentEnrollments.map((enrollment, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {enrollment.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {enrollment.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {enrollment.course}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {enrollment.date}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
    </>
  );
};

export default InstructorDashboard;
