import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import InstructorSidebar from "@/components/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, DollarSign, Users, TrendingUp } from "lucide-react";

interface AnalyticsData {
  totalRevenue: number;
  totalStudents: number;
  totalCourses: number;
  recentPurchases: {
    date: string;
    amount: number;
    course: string;
  }[];
}

const InstructorAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      // Fetch courses for this instructor
      const { data: courses } = await supabase
        .from("courses")
        .select("id, title")
        .eq("teacher_id", user?.id);

      const courseIds = courses?.map((c) => c.id) || [];

      if (courseIds.length === 0) {
        setAnalytics({
          totalRevenue: 0,
          totalStudents: 0,
          totalCourses: 0,
          recentPurchases: [],
        });
        setIsLoading(false);
        return;
      }

      // Fetch purchases for these courses
      const { data: purchases } = await supabase
        .from("purchases")
        .select("amount, created_at, course_id")
        .in("course_id", courseIds)
        .order("created_at", { ascending: false })
        .limit(10);

      const totalRevenue = purchases?.reduce((sum, p) => sum + p.amount, 0) || 0;
      const uniqueStudents = new Set(purchases?.map((p) => p.course_id)).size;

      const recentPurchases = (purchases || []).map((p) => ({
        date: new Date(p.created_at).toLocaleDateString(),
        amount: p.amount,
        course: courses?.find((c) => c.id === p.course_id)?.title || "Unknown",
      }));

      setAnalytics({
        totalRevenue,
        totalStudents: uniqueStudents,
        totalCourses: courses?.length || 0,
        recentPurchases,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <InstructorSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">
            Track your course performance and revenue
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${analytics?.totalRevenue.toFixed(2)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Enrollments
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics?.totalStudents}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Courses
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics?.totalCourses}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg. Course Price
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    $
                    {analytics?.totalCourses
                      ? (analytics.totalRevenue / analytics.totalCourses).toFixed(2)
                      : "0.00"}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Purchases</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics?.recentPurchases.length === 0 ? (
                  <p className="text-muted-foreground">No purchases yet</p>
                ) : (
                  <div className="space-y-4">
                    {analytics?.recentPurchases.map((purchase, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between border-b border-border pb-2 last:border-0"
                      >
                        <div>
                          <p className="font-medium">{purchase.course}</p>
                          <p className="text-sm text-muted-foreground">
                            {purchase.date}
                          </p>
                        </div>
                        <span className="font-medium text-primary">
                          ${purchase.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default InstructorAnalytics;
