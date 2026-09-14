import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CourseOverview from "@/components/CourseOverview";
import ChapterView from "@/components/ChapterView";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/errorUtils";
import { SEO } from "@/components/SEO";

interface Chapter {
  id: string;
  title: string;
  duration_seconds: number | null;
  is_free_preview: boolean | null;
  position: number;
  mux_playback_id: string | null;
  description: string | null;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  price: number;
  category: string | null;
  instructor_id: string;
  stripe_price_id: string | null;
  average_rating: number | null;
  rating_count: number | null;
  chapters: Chapter[];
  instructor?: {
    full_name: string | null;
    email: string | null;
  };
}

type ViewMode = "overview" | "chapter";

const CoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, session, isLoading: authLoading } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [isVerifyingAccess, setIsVerifyingAccess] = useState(false);
  const verifyAttemptRef = useRef(0);

  // Verify access with exponential backoff polling
  const verifyAccessWithRetry = useCallback(async () => {
    const maxAttempts = 5;
    const baseDelay = 2000;
    
    setIsVerifyingAccess(true);
    verifyAttemptRef.current = 0;

    const poll = async (): Promise<boolean> => {
      verifyAttemptRef.current += 1;
      const { data } = await refetchPurchase();
      
      if (data) {
        return true;
      }
      
      if (verifyAttemptRef.current >= maxAttempts) {
        return false;
      }
      
      const delay = baseDelay * Math.pow(2, verifyAttemptRef.current - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
      return poll();
    };

    const accessConfirmed = await poll();
    setIsVerifyingAccess(false);
    
    if (accessConfirmed) {
      toast.success("Access activated! Enjoy your course.");
    } else {
      toast.warning(
        "We're still processing your payment. Please refresh in a moment or contact support if access isn't granted.",
        { duration: 8000 }
      );
    }
  }, []);

  // Handle payment status from URL
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      toast.info("Checkout complete. Verifying your access...");
      setSearchParams({}, { replace: true });
      verifyAccessWithRetry();
    } else if (paymentStatus === "canceled") {
      toast.error("Payment was canceled");
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, verifyAccessWithRetry]);

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
            description,
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

      // Fetch instructor info
      const { data: instructorData } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", courseData.instructor_id)
        .maybeSingle();

      return {
        ...courseData,
        chapters: (courseData.chapters || []).sort((a: Chapter, b: Chapter) => a.position - b.position),
        instructor: instructorData,
      } as Course;
    },
    enabled: !!id,
  });

  // Check if user has purchased OR was manually enrolled (private courses)
  const { data: hasPurchased, refetch: refetchPurchase } = useQuery({
    queryKey: ["purchase", id, user?.id],
    queryFn: async () => {
      if (!user) return false;

      const [purchaseRes, membershipRes] = await Promise.all([
        supabase
          .from("purchases")
          .select("id")
          .eq("user_id", user.id)
          .eq("course_id", id)
          .maybeSingle(),
        supabase
          .from("course_memberships")
          .select("id")
          .eq("user_id", user.id)
          .eq("course_id", id)
          .maybeSingle(),
      ]);

      if (purchaseRes.error) throw purchaseRes.error;
      if (membershipRes.error) throw membershipRes.error;
      return !!purchaseRes.data || !!membershipRes.data;
    },
    enabled: !!id && !!user,
  });


  // Fetch user progress for this course
  const { data: userProgress, refetch: refetchProgress } = useQuery({
    queryKey: ["progress", id, user?.id],
    queryFn: async () => {
      if (!user || !course) return [];
      
      const chapterIds = course.chapters.map(ch => ch.id);
      
      const { data, error } = await supabase
        .from("user_progress")
        .select("chapter_id, is_completed, completed_at")
        .eq("user_id", user.id)
        .in("chapter_id", chapterIds);

      if (error) throw error;
      return data || [];
    },
    enabled: !!id && !!user && !!course,
  });

  // Set initial chapter when entering chapter view
  useEffect(() => {
    if (course?.chapters?.length && !currentChapterId && viewMode === "chapter") {
      setCurrentChapterId(course.chapters[0].id);
    }
  }, [course, currentChapterId, viewMode]);

  const currentChapter = course?.chapters?.find((c) => c.id === currentChapterId);
  const isOwner = user?.id === course?.instructor_id;
  const isCurrentChapterCompleted = userProgress?.some(
    p => p.chapter_id === currentChapterId && p.is_completed
  ) ?? false;

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
        const inIframe = window.self !== window.top;
        
        if (inIframe) {
          const newWindow = window.open(data.url, "_blank", "noopener,noreferrer");
          if (!newWindow) {
            toast.info("Opening checkout in same tab...");
            window.location.assign(data.url);
          } else {
            toast.info("Checkout opened in a new tab. Complete payment there.");
            setIsCheckoutLoading(false);
          }
        } else {
          window.location.assign(data.url);
        }
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: unknown) {
      console.error("Checkout error:", error);
      toast.error(getErrorMessage(error));
      setIsCheckoutLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!user || !currentChapterId) {
      toast.error("Please sign in to track progress");
      return;
    }

    setIsMarkingComplete(true);
    
    try {
      const { error } = await supabase
        .from("user_progress")
        .upsert({
          user_id: user.id,
          chapter_id: currentChapterId,
          is_completed: true,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: "user_id,chapter_id",
        });

      if (error) throw error;
      
      toast.success("Chapter marked as complete!");
      refetchProgress();
    } catch (error: unknown) {
      console.error("Error marking complete:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartLearning = () => {
    if (course?.chapters?.length) {
      setCurrentChapterId(course.chapters[0].id);
      setViewMode("chapter");
    }
  };

  const handleSelectChapter = (chapterId: string) => {
    setCurrentChapterId(chapterId);
    setViewMode("chapter");
  };

  const handleBackToOverview = () => {
    setViewMode("overview");
  };

  // Calculate total duration
  const totalDuration = course?.chapters?.reduce((acc, ch) => acc + (ch.duration_seconds || 0), 0) || 0;
  const totalMinutes = Math.floor(totalDuration / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  const formattedTotalDuration = totalHours > 0 
    ? `${totalHours}h ${remainingMinutes}m` 
    : `${totalMinutes}m`;

  if (courseLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="aspect-video w-full rounded-xl" />
                <Skeleton className="h-10 w-3/4 mt-6" />
                <Skeleton className="h-4 w-1/2 mt-4" />
                <Skeleton className="h-32 w-full mt-8" />
              </div>
              <div className="lg:col-span-1">
                <Skeleton className="h-80 w-full rounded-lg" />
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
    isCompleted: userProgress?.find(p => p.chapter_id === ch.id && p.is_completed) ? true : false,
    mux_playback_id: ch.mux_playback_id,
    description: ch.description,
  }));

  return (
    <div className="min-h-screen bg-background">
      {course && (
        <SEO
          title={course.title}
          description={
            course.description?.slice(0, 155) ??
            `Curso de ${course.instructor?.full_name ?? "instructor invitado"} en Cognitio.`
          }
          path={`/course/${course.id}`}
          image={course.image_url ?? undefined}
          type="article"
        />
      )}
      <Navbar />


      <main className="pt-16">
        {viewMode === "overview" ? (
          <CourseOverview
            course={course}
            chapters={chaptersForList}
            totalDuration={formattedTotalDuration}
            isOwner={isOwner}
            hasPurchased={hasPurchased || false}
            isVerifyingAccess={isVerifyingAccess}
            isCheckoutLoading={isCheckoutLoading}
            authLoading={authLoading}
            user={user}
            onPurchase={handlePurchase}
            onStartLearning={handleStartLearning}
            onSelectChapter={handleSelectChapter}
            navigateToAuth={() => navigate(`/auth?redirect=/course/${id}`)}
          />
        ) : (
          <ChapterView
            course={course}
            chapters={chaptersForList}
            currentChapter={chaptersForList.find(ch => ch.id === currentChapterId)}
            currentChapterId={currentChapterId || ""}
            isOwner={isOwner}
            hasPurchased={hasPurchased || false}
            isMarkingComplete={isMarkingComplete}
            isCurrentChapterCompleted={isCurrentChapterCompleted}
            onSelectChapter={handleSelectChapter}
            onMarkComplete={handleMarkComplete}
            onBackToOverview={handleBackToOverview}
            userId={user?.id}
            isAuthenticated={!!user}
          />
        )}
      </main>
    </div>
  );
};

export default CoursePage;
