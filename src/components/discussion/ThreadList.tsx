import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageSquare, Clock, ArrowUp, Bot, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDiscussions, SortOption, Discussion } from "@/hooks/useDiscussions";
import CreateThreadModal from "./CreateThreadModal";

interface ThreadListProps {
  chapterId: string;
  courseId: string;
  hasAccess: boolean;
  isAuthenticated: boolean;
  onSelectThread: (discussion: Discussion) => void;
  currentVideoTime?: number;
}

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function ThreadList({
  chapterId,
  courseId,
  hasAccess,
  isAuthenticated,
  onSelectThread,
  currentVideoTime,
}: ThreadListProps) {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<SortOption>("new");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { discussions, isLoading, createDiscussion } = useDiscussions(chapterId, sortBy);

  const handleCreateThread = async (data: {
    title: string;
    content: string;
    videoTimestamp?: number;
  }) => {
    await createDiscussion.mutateAsync({
      chapterId,
      courseId,
      ...data,
    });
    setIsCreateOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with sort and create */}
      <div className="flex items-center justify-between gap-4">
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">{t("discussion.sortNew")}</SelectItem>
            <SelectItem value="top">{t("discussion.sortTop")}</SelectItem>
          </SelectContent>
        </Select>

        {hasAccess && isAuthenticated && (
          <Button onClick={() => setIsCreateOpen(true)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            {t("discussion.askQuestion")}
          </Button>
        )}
      </div>

      {/* Login banner for guests */}
      {!isAuthenticated && (
        <Card className="bg-muted/50">
          <CardContent className="py-3 text-sm text-muted-foreground text-center">
            {t("discussion.loginToParticipate")}
          </CardContent>
        </Card>
      )}

      {/* Thread list */}
      {discussions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/70 mb-4" />
            <p className="text-muted-foreground">{t("discussion.noDiscussions")}</p>
            {hasAccess && isAuthenticated && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsCreateOpen(true)}
              >
                {t("discussion.startFirst")}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {discussions.map((discussion) => (
            <Card
              key={discussion.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => onSelectThread(discussion)}
            >
              <CardContent className="py-3">
                <div className="flex items-start gap-3">
                  {/* Upvote count */}
                  <div className="flex flex-col items-center text-muted-foreground min-w-[40px]">
                    <ArrowUp className="h-4 w-4" />
                    <span className="text-sm font-medium">{discussion.upvote_count}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-medium text-foreground truncate">
                        {discussion.title}
                      </h4>
                      {discussion.is_resolved && (
                        <Badge variant="secondary" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {t("discussion.resolved")}
                        </Badge>
                      )}
                      {discussion.has_ai_response && (
                        <Badge variant="outline" className="gap-1">
                          <Bot className="h-3 w-3" />
                          AI
                        </Badge>
                      )}
                      {discussion.video_timestamp_seconds !== null && (
                        <Badge variant="outline" className="gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(discussion.video_timestamp_seconds)}
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {discussion.content}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>{discussion.author?.full_name || t("discussion.anonymous")}</span>
                      <span>•</span>
                      <span>{formatRelativeTime(discussion.created_at)}</span>
                      <span>•</span>
                      <span>
                        {discussion.reply_count} {t("discussion.replies")}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create thread modal */}
      <CreateThreadModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreateThread}
        isSubmitting={createDiscussion.isPending}
        currentVideoTime={currentVideoTime}
      />
    </div>
  );
}
