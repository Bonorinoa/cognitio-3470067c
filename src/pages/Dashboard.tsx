import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CourseCard from "@/components/CourseCard";
import ProgressCard from "@/components/ProgressCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  const { user, isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch purchased courses with progress
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
      if (!purchases || purchases.length === 0) return [];

      const courseIds = purchases.map((p) => p.course_id);

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
            Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}!
          </h1>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {isLoading ? (
            <>
              <Skeleton className="h-28 rounded-lg" />
              <Skeleton className="h-28 rounded-lg" />
              <Skeleton className="h-28 rounded-lg" />
              <Skeleton className="h-28 rounded-lg" />
            </>
          ) : (
            <>
              <ProgressCard
                title="Courses Enrolled"
                value={enrolledCourses.length}
                icon="courses"
                subtitle="Active courses"
              />
              <ProgressCard
                title="Courses Completed"
                value={completedCourses.length}
                icon="award"
                subtitle="Great progress!"
              />
              <ProgressCard
                title="Chapters Done"
                value={enrolledCourses.reduce((sum, c) => sum + c.completedChapters, 0)}
                icon="time"
                subtitle="Total completed"
              />
              <ProgressCard
                title="Overall Progress"
                value={`${overallProgress}%`}
                icon="trending"
                progress={overallProgress}
                subtitle="Keep going!"
              />
            </>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        {!isLoading && enrolledCourses.length > 0 && (
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                All Courses ({enrolledCourses.length})
              </TabsTrigger>
              <TabsTrigger value="in-progress" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                In Progress ({inProgressCourses.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Completed ({completedCourses.length})
              </TabsTrigger>
            </TabsList>

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

        {/* Empty state - no courses purchased */}
        {!isLoading && enrolledCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No courses yet</h3>
            <p className="text-muted-foreground mb-4">
              Start your learning journey by enrolling in a course.
            </p>
            <Link to="/courses" className="text-primary hover:underline">
              Browse Courses
            </Link>
          </div>
        )}

        {/* Empty state - search has no results */}
        {!isLoading && enrolledCourses.length > 0 && filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No courses found</h3>
            <p className="text-muted-foreground">Try a different search term.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
