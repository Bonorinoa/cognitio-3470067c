import { useState, useEffect } from "react";
import { Discussion } from "@/hooks/useDiscussions";
import { useAITutorSettings } from "@/hooks/useAITutor";
import ThreadList from "./ThreadList";
import ThreadView from "./ThreadView";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DiscussionTabProps {
  chapterId: string;
  courseId: string;
  instructorId: string;
  hasAccess: boolean;
  isAuthenticated: boolean;
  userId?: string;
  onSeekVideo?: (seconds: number) => void;
  currentVideoTime?: number;
}

export default function DiscussionTab({
  chapterId,
  courseId,
  instructorId,
  hasAccess,
  isAuthenticated,
  userId,
  onSeekVideo,
  currentVideoTime,
}: DiscussionTabProps) {
  const { t } = useTranslation();
  const [selectedThread, setSelectedThread] = useState<Discussion | null>(null);
  const { settings: aiSettings } = useAITutorSettings();

  // Reset selected thread when chapter changes
  useEffect(() => {
    setSelectedThread(null);
  }, [chapterId]);

  const isInstructorOrOwner = userId === instructorId;

  if (selectedThread) {
    return (
      <ThreadView
        discussion={selectedThread}
        hasAccess={hasAccess}
        isAuthenticated={isAuthenticated}
        isInstructorOrOwner={isInstructorOrOwner}
        onBack={() => setSelectedThread(null)}
        onSeekVideo={onSeekVideo}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* AI tutor disabled banner for admins/instructors */}
      {!aiSettings.enabled && isInstructorOrOwner && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t("discussion.aiTutorDisabledAdmin")}
          </AlertDescription>
        </Alert>
      )}

      <ThreadList
        chapterId={chapterId}
        courseId={courseId}
        hasAccess={hasAccess}
        isAuthenticated={isAuthenticated}
        onSelectThread={setSelectedThread}
        currentVideoTime={currentVideoTime}
      />
    </div>
  );
}
