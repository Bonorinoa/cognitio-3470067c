import { lazy, Suspense, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Check, ArrowLeft, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import ChapterList from "@/components/ChapterList";
import DiscussionTab from "@/components/discussion/DiscussionTab";
import ResourcesTab from "@/components/ResourcesTab";
import type { VideoPlayerHandle } from "@/components/VideoPlayer";

const VideoPlayer = lazy(() => import("@/components/VideoPlayer"));

const VideoPlayerFallback = () => (
  <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

interface Chapter {
  id: string;
  title: string;
  duration: string;
  isPreview: boolean;
  isCompleted?: boolean;
  mux_playback_id?: string | null;
  description?: string | null;
}

interface ChapterViewProps {
  course: {
    id: string;
    title: string;
    image_url: string | null;
    instructor_id: string;
  };
  chapters: Chapter[];
  currentChapter: Chapter | undefined;
  currentChapterId: string;
  isOwner: boolean;
  hasPurchased: boolean;
  isMarkingComplete: boolean;
  isCurrentChapterCompleted: boolean;
  onSelectChapter: (chapterId: string) => void;
  onMarkComplete: () => void;
  onBackToOverview: () => void;
  userId?: string;
  isAuthenticated?: boolean;
}

const ChapterView = ({
  course,
  chapters,
  currentChapter,
  currentChapterId,
  isOwner,
  hasPurchased,
  isMarkingComplete,
  isCurrentChapterCompleted,
  onSelectChapter,
  onMarkComplete,
  onBackToOverview,
  userId,
  isAuthenticated = false,
}: ChapterViewProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("discussion");
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const videoRef = useRef<VideoPlayerHandle>(null);

  const hasAccess = hasPurchased || isOwner;
  const currentIndex = chapters.findIndex((ch) => ch.id === currentChapterId);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  const canAccessPrev = prevChapter && (hasAccess || prevChapter.isPreview);
  const canAccessNext = nextChapter && (hasAccess || nextChapter.isPreview);

  const handleSeekVideo = useCallback((seconds: number) => {
    if (videoRef.current) {
      videoRef.current.seekTo(seconds);
      // Switch to content tab to show video
      setActiveTab("content");
    }
  }, []);

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentVideoTime(time);
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back to Overview */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onBackToOverview}
        className="mb-4 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("coursePage.backToOverview")}
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player Column */}
        <div className="lg:col-span-2 space-y-4">
          <Suspense fallback={<VideoPlayerFallback />}>
            <VideoPlayer
              ref={videoRef}
              playbackId={currentChapter?.mux_playback_id || undefined}
              poster={course.image_url || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200"}
              title={currentChapter?.title}
              onTimeUpdate={handleTimeUpdate}
            />
          </Suspense>

          {/* Chapter Title and Navigation */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {currentChapter?.title || t("coursePage.selectChapter")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("coursePage.chapterOf", { current: currentIndex + 1, total: chapters.length })} • {currentChapter?.duration}
              </p>
            </div>

            {/* Chapter Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={!canAccessPrev}
                onClick={() => prevChapter && onSelectChapter(prevChapter.id)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={!canAccessNext}
                onClick={() => nextChapter && onSelectChapter(nextChapter.id)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mark Complete Button */}
          {hasAccess && !isOwner && currentChapter && (
            <Button
              onClick={onMarkComplete}
              disabled={isMarkingComplete || isCurrentChapterCompleted}
              variant={isCurrentChapterCompleted ? "outline" : "default"}
              className="w-full"
            >
              {isMarkingComplete ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("coursePage.marking")}
                </>
              ) : isCurrentChapterCompleted ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {t("coursePage.completed")}
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {t("coursePage.markComplete")}
                </>
              )}
            </Button>
          )}

          {/* Tabs for Discussion / Resources */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="discussion" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                {t("coursePage.discussionTab")}
              </TabsTrigger>
              <TabsTrigger value="resources">{t("coursePage.resourcesTab")}</TabsTrigger>
            </TabsList>

            <TabsContent value="discussion" className="mt-4">
              <DiscussionTab
                chapterId={currentChapterId}
                courseId={course.id}
                instructorId={course.instructor_id}
                hasAccess={hasAccess}
                isAuthenticated={isAuthenticated}
                userId={userId}
                onSeekVideo={handleSeekVideo}
                currentVideoTime={currentVideoTime}
              />
            </TabsContent>

            <TabsContent value="resources" className="mt-4">
              <ResourcesTab chapterId={currentChapterId} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Chapters List Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <h2 className="text-lg font-bold text-foreground mb-4">
              {t("coursePage.courseContent")}
            </h2>
            <ChapterList
              chapters={chapters}
              currentChapterId={currentChapterId}
              onSelectChapter={onSelectChapter}
              hasAccess={hasAccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterView;
