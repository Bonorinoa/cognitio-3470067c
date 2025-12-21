import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import ChapterList from "@/components/ChapterList";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Clock, Users, Star, Check, ShoppingCart, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface Chapter {
  id: string;
  title: string;
  duration_seconds: number | null;
  is_free_preview: boolean | null;
  position: number;
  mux_playback_id: string | null;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  price: number;
  category: string | null;
  teacher_id: string;
  stripe_price_id: string | null;
  chapters: Chapter[];
  teacher?: {
    full_name: string | null;
    email: string | null;
  };
}

const CoursePage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user, session } = useAuth();
  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  // Check for payment success
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success" && user && id) {
      toast.success("Payment successful! Recording your purchase...");
      recordPurchase();
    } else if (paymentStatus === "canceled") {
      toast.error("Payment was canceled");
    }
  }, [searchParams, user, id]);

  const recordPurchase = async () => {
    if (!session || !id) return;
    
    try {
      const { error } = await supabase.functions.invoke("record-purchase", {
        body: { courseId: id, amount: course?.price || 0 },
      });
      
      if (error) {
        console.error("Error recording purchase:", error);
      } else {
        refetchPurchase();
      }
    } catch (error) {
      console.error("Error recording purchase:", error);
    }
  };

  // Fetch course data
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select(`
          *,
          chapters (
            id,
            title,
            duration_seconds,
            is_free_preview,
            position,
            mux_playback_id
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (courseError) throw courseError;
      if (!courseData) throw new Error("Course not found");

      // Fetch teacher info
      const { data: teacherData } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", courseData.teacher_id)
        .maybeSingle();

      return {
        ...courseData,
        chapters: (courseData.chapters || []).sort((a: Chapter, b: Chapter) => a.position - b.position),
        teacher: teacherData,
      } as Course;
    },
    enabled: !!id,
  });

  // Check if user has purchased
  const { data: hasPurchased, refetch: refetchPurchase } = useQuery({
    queryKey: ["purchase", id, user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from("purchases")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_id", id)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!id && !!user,
  });

  // Set initial chapter
  useEffect(() => {
    if (course?.chapters?.length && !currentChapterId) {
      setCurrentChapterId(course.chapters[0].id);
    }
  }, [course, currentChapterId]);

  const currentChapter = course?.chapters?.find((c) => c.id === currentChapterId);

  const handlePurchase = async () => {
    if (!user) {
      toast.error("Please sign in to purchase this course");
      return;
    }

    if (!session) {
      toast.error("Session expired. Please sign in again.");
      return;
    }

    setIsCheckoutLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("create-course-checkout", {
        body: { courseId: id },
      });

      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, "_blank");
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to start checkout");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (courseLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <div className="bg-card border-b border-border">
            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Skeleton className="aspect-video w-full rounded-lg" />
                  <Skeleton className="h-8 w-3/4 mt-4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </div>
                <div className="lg:col-span-1">
                  <Skeleton className="h-64 w-full rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Course not found</h1>
            <p className="text-muted-foreground mt-2">This course may have been removed or doesn't exist.</p>
          </div>
        </main>
      </div>
    );
  }

  const chaptersForList = course.chapters.map((ch) => ({
    id: ch.id,
    title: ch.title,
    duration: formatDuration(ch.duration_seconds),
    isPreview: ch.is_free_preview || false,
  }));

  const features = [
    `${course.chapters.length} chapters of content`,
    "Lifetime access",
    "Certificate of completion",
    "Mobile and TV access",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {/* Video Section */}
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Player */}
              <div className="lg:col-span-2">
                <VideoPlayer
                  playbackId={currentChapter?.mux_playback_id || undefined}
                  poster={course.image_url || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200"}
                  title={currentChapter?.title}
                />
                <div className="mt-4">
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {course.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-accent-foreground fill-accent-foreground" />
                      4.8
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {course.chapters.length} chapters
                    </span>
                    {course.category && (
                      <Badge variant="secondary">{course.category}</Badge>
                    )}
                    <span>by {course.teacher?.full_name || course.teacher?.email || "Instructor"}</span>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-20 border-border bg-card">
                  <CardContent className="p-6">
                    {!hasPurchased ? (
                      <>
                        <div className="text-center mb-6">
                          <span className="text-4xl font-bold text-foreground">
                            ${course.price}
                          </span>
                        </div>
                        <Button
                          size="lg"
                          className="w-full mb-4"
                          onClick={handlePurchase}
                          disabled={isCheckoutLoading}
                        >
                          {isCheckoutLoading ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="mr-2 h-5 w-5" />
                              Purchase Course
                            </>
                          )}
                        </Button>
                        <p className="text-sm text-muted-foreground text-center mb-6">
                          30-day money-back guarantee
                        </p>
                        <Separator className="mb-6" />
                      </>
                    ) : (
                      <Badge className="w-full justify-center py-2 mb-6 bg-accent/20 text-accent-foreground border-accent/30">
                        <Check className="mr-2 h-4 w-4" />
                        You have access to this course
                      </Badge>
                    )}

                    <h3 className="font-semibold text-foreground mb-4">
                      This course includes:
                    </h3>
                    <ul className="space-y-3">
                      {features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="h-4 w-4 text-accent-foreground" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Description */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  About this course
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {course.description || "No description available."}
                </p>
              </div>
            </div>

            {/* Chapters List */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Course Content
              </h2>
              <ChapterList
                chapters={chaptersForList}
                currentChapterId={currentChapterId || ""}
                onSelectChapter={setCurrentChapterId}
                hasAccess={hasPurchased || false}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoursePage;
