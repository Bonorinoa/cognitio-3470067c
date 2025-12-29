import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import InstructorSidebar from "@/components/InstructorSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Edit, Eye, Trash2, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useUserRole } from "@/hooks/useUserRole";

interface Course {
  id: string;
  title: string;
  description: string | null;
  price: number;
  is_published: boolean;
  is_featured: boolean;
  category: string | null;
  updated_at: string;
  chapter_count: number;
  student_count: number;
}

const InstructorCourses = () => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select("*")
        .eq("teacher_id", user?.id)
        .order("updated_at", { ascending: false });

      if (coursesError) throw coursesError;

      // Get chapter counts and student counts for each course
      const coursesWithStats = await Promise.all(
        (coursesData || []).map(async (course) => {
          const { count: chapterCount } = await supabase
            .from("chapters")
            .select("*", { count: "exact", head: true })
            .eq("course_id", course.id);

          const { count: studentCount } = await supabase
            .from("purchases")
            .select("*", { count: "exact", head: true })
            .eq("course_id", course.id);

          return {
            ...course,
            is_featured: course.is_featured || false,
            chapter_count: chapterCount || 0,
            student_count: studentCount || 0,
          };
        })
      );

      setCourses(coursesWithStats);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseId);

      if (error) throw error;

      setCourses(courses.filter((c) => c.id !== courseId));
      toast({
        title: "Course deleted",
        description: "The course has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting course:", error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  const handleToggleFeatured = async (courseId: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from("courses")
        .update({ is_featured: !currentFeatured })
        .eq("id", courseId);

      if (error) throw error;

      setCourses(courses.map(c => 
        c.id === courseId ? { ...c, is_featured: !currentFeatured } : c
      ));
      
      toast({
        title: !currentFeatured ? "Course featured" : "Course unfeatured",
        description: !currentFeatured 
          ? "The course will now appear on the homepage." 
          : "The course has been removed from featured.",
      });
    } catch (error) {
      console.error("Error toggling featured:", error);
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <InstructorSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Your Courses</h1>
            <p className="text-muted-foreground">
              Manage and organize your course content
            </p>
          </div>
          <Button asChild>
            <Link to="/instructor/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Course
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="flex flex-col">
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="flex-1">
                  <Skeleton className="mb-4 h-4 w-full" />
                  <Skeleton className="mb-2 h-20 w-full rounded-lg" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <Card className="p-12 text-center">
            <h3 className="mb-2 text-lg font-medium">No courses yet</h3>
            <p className="mb-4 text-muted-foreground">
              Get started by creating your first course
            </p>
            <Button asChild>
              <Link to="/instructor/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Course
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <Card 
                key={course.id} 
                className={cn(
                  "flex flex-col border-border/50",
                  course.is_featured && "border-primary/50 bg-primary/5"
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <CardTitle className="text-lg truncate">{course.title}</CardTitle>
                      {course.is_featured && (
                        <Star className="h-4 w-4 shrink-0 text-primary fill-primary" />
                      )}
                    </div>
                    <Badge variant={course.is_published ? "default" : "secondary"} className="shrink-0">
                      {course.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                    {course.description || "No description"}
                  </p>
                  
                  {/* Stats Grid */}
                  <div className="mb-4 grid grid-cols-3 gap-2 rounded-lg bg-muted/30 p-3 text-center">
                    <div>
                      <div className="font-medium text-foreground">{course.chapter_count}</div>
                      <div className="text-xs text-muted-foreground">chapters</div>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{course.student_count}</div>
                      <div className="text-xs text-muted-foreground">students</div>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">${course.price}</div>
                      <div className="text-xs text-muted-foreground">price</div>
                    </div>
                  </div>
                  
                  {/* Admin Featured Toggle */}
                  {isAdmin && (
                    <div className="flex items-center justify-between rounded-lg bg-muted/20 p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Featured</span>
                      </div>
                      <Switch
                        checked={course.is_featured}
                        onCheckedChange={() => handleToggleFeatured(course.id, course.is_featured)}
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="gap-2 pt-4 border-t border-border/30">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to={`/course/${course.id}`}>
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                      View
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to={`/instructor/edit/${course.id}`}>
                      <Edit className="mr-1.5 h-3.5 w-3.5" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(course.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default InstructorCourses;
