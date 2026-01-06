import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowUp, ArrowDown, Clock, Bot, CheckCircle, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Discussion, useDiscussionReplies, useDiscussionVotes, DiscussionReply } from "@/hooks/useDiscussions";
import { useAITutorUsage, useAITutorSettings, useAITutorReply } from "@/hooks/useAITutor";
import { useAuth } from "@/contexts/AuthContext";
import ReplyComposer from "./ReplyComposer";

interface ThreadViewProps {
  discussion: Discussion;
  hasAccess: boolean;
  isAuthenticated: boolean;
  isInstructorOrOwner: boolean;
  onBack: () => void;
  onSeekVideo?: (seconds: number) => void;
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

export default function ThreadView({
  discussion,
  hasAccess,
  isAuthenticated,
  isInstructorOrOwner,
  onBack,
  onSeekVideo,
}: ThreadViewProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { replies, isLoading, createReply, toggleAccepted } = useDiscussionReplies(discussion.id);
  const { vote } = useDiscussionVotes();
  const { settings: aiSettings } = useAITutorSettings();
  const { used, remaining, canUseAI } = useAITutorUsage(discussion.chapter_id);
  const { generateReply, isGenerating } = useAITutorReply();
  
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
  const [discussionVote, setDiscussionVote] = useState<number | null>(null);

  const isDiscussionOwner = user?.id === discussion.user_id;
  const canMarkAccepted = isDiscussionOwner || isInstructorOrOwner;

  // Load user votes
  const { getUserVotes } = useDiscussionVotes();
  useEffect(() => {
    const loadVotes = async () => {
      if (!user) return;
      
      // Get discussion vote
      const discVotes = await getUserVotes("discussion", [discussion.id]);
      setDiscussionVote(discVotes[discussion.id] || null);
      
      // Get reply votes
      if (replies.length > 0) {
        const replyVotes = await getUserVotes("reply", replies.map((r) => r.id));
        setUserVotes(replyVotes);
      }
    };
    loadVotes();
  }, [user, discussion.id, replies, getUserVotes]);

  const handleVoteDiscussion = async (voteValue: 1 | -1) => {
    if (!user) return;
    
    const prevVote = discussionVote;
    // Optimistic update
    setDiscussionVote(prevVote === voteValue ? null : voteValue);
    
    try {
      await vote.mutateAsync({
        targetType: "discussion",
        targetId: discussion.id,
        vote: voteValue,
        currentVote: prevVote,
      });
    } catch {
      // Rollback on error
      setDiscussionVote(prevVote);
    }
  };

  const handleVoteReply = async (replyId: string, voteValue: 1 | -1) => {
    if (!user) return;
    
    const prevVote = userVotes[replyId] || null;
    // Optimistic update
    setUserVotes((prev) => ({
      ...prev,
      [replyId]: prevVote === voteValue ? 0 : voteValue,
    }));
    
    try {
      await vote.mutateAsync({
        targetType: "reply",
        targetId: replyId,
        vote: voteValue,
        currentVote: prevVote,
      });
    } catch {
      // Rollback on error
      setUserVotes((prev) => ({
        ...prev,
        [replyId]: prevVote || 0,
      }));
    }
  };

  const handleReply = async (content: string, mentionsAI: boolean) => {
    if (mentionsAI && aiSettings.enabled && canUseAI) {
      // Generate AI reply
      await generateReply.mutateAsync({
        discussionId: discussion.id,
        chapterId: discussion.chapter_id,
        videoTimestampSeconds: discussion.video_timestamp_seconds || undefined,
        userMessage: content,
      });
    } else {
      // Regular reply
      await createReply.mutateAsync(content);
    }
  };

  const handleMarkAccepted = async (replyId: string) => {
    await toggleAccepted.mutateAsync(replyId);
  };

  return (
    <div className="space-y-4">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        {t("discussion.backToList")}
      </Button>

      {/* Original question */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start gap-4">
            {/* Vote buttons */}
            <div className="flex flex-col items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${discussionVote === 1 ? "text-primary" : ""}`}
                onClick={() => handleVoteDiscussion(1)}
                disabled={!isAuthenticated}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">{discussion.upvote_count}</span>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${discussionVote === -1 ? "text-destructive" : ""}`}
                onClick={() => handleVoteDiscussion(-1)}
                disabled={!isAuthenticated}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h2 className="text-xl font-semibold">{discussion.title}</h2>
                {discussion.is_resolved && (
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {t("discussion.resolved")}
                  </Badge>
                )}
                {discussion.video_timestamp_seconds !== null && (
                  <Badge
                    variant="outline"
                    className="gap-1 cursor-pointer hover:bg-accent"
                    onClick={() => onSeekVideo?.(discussion.video_timestamp_seconds!)}
                  >
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(discussion.video_timestamp_seconds)}
                  </Badge>
                )}
              </div>

              <p className="text-muted-foreground whitespace-pre-wrap">{discussion.content}</p>

              <div className="flex items-center gap-3 mt-4 text-sm text-muted-foreground">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={discussion.author?.avatar_url || undefined} />
                  <AvatarFallback>
                    {discussion.author?.full_name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <span>{discussion.author?.full_name || t("discussion.anonymous")}</span>
                <span>•</span>
                <span>{formatRelativeTime(discussion.created_at)}</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Replies */}
      <div className="space-y-3">
        <h3 className="font-medium text-foreground">
          {discussion.reply_count} {t("discussion.replies")}
        </h3>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : replies.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {t("discussion.noReplies")}
            </CardContent>
          </Card>
        ) : (
          replies.map((reply) => (
            <ReplyCard
              key={reply.id}
              reply={reply}
              userVote={userVotes[reply.id] || null}
              canMarkAccepted={canMarkAccepted}
              isAuthenticated={isAuthenticated}
              onVote={(vote) => handleVoteReply(reply.id, vote)}
              onMarkAccepted={() => handleMarkAccepted(reply.id)}
              t={t}
            />
          ))
        )}
      </div>

      {/* Reply composer */}
      {hasAccess && isAuthenticated && (
        <ReplyComposer
          onSubmit={handleReply}
          isSubmitting={createReply.isPending || isGenerating}
          aiEnabled={aiSettings.enabled}
          aiRemaining={remaining}
          aiUsed={used}
        />
      )}
    </div>
  );
}

interface ReplyCardProps {
  reply: DiscussionReply;
  userVote: number | null;
  canMarkAccepted: boolean;
  isAuthenticated: boolean;
  onVote: (vote: 1 | -1) => void;
  onMarkAccepted: () => void;
  t: (key: string) => string;
}

function ReplyCard({
  reply,
  userVote,
  canMarkAccepted,
  isAuthenticated,
  onVote,
  onMarkAccepted,
  t,
}: ReplyCardProps) {
  return (
    <Card className={reply.is_accepted_answer ? "border-primary/50 bg-primary/5" : ""}>
      <CardContent className="py-4">
        <div className="flex items-start gap-4">
          {/* Vote buttons */}
          <div className="flex flex-col items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 ${userVote === 1 ? "text-primary" : ""}`}
              onClick={() => onVote(1)}
              disabled={!isAuthenticated}
            >
              <ArrowUp className="h-3 w-3" />
            </Button>
            <span className="text-xs font-medium">{reply.upvote_count}</span>
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 ${userVote === -1 ? "text-destructive" : ""}`}
              onClick={() => onVote(-1)}
              disabled={!isAuthenticated}
            >
              <ArrowDown className="h-3 w-3" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Avatar className="h-5 w-5">
                <AvatarImage src={reply.author?.avatar_url || undefined} />
                <AvatarFallback>
                  {reply.is_ai_generated ? "AI" : reply.author?.full_name?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                {reply.is_ai_generated ? "CognitioAI" : reply.author?.full_name || t("discussion.anonymous")}
              </span>
              {reply.is_ai_generated && (
                <Badge variant="outline" className="gap-1">
                  <Bot className="h-3 w-3" />
                  AI
                </Badge>
              )}
              {reply.is_accepted_answer && (
                <Badge variant="default" className="gap-1">
                  <Check className="h-3 w-3" />
                  {t("discussion.acceptedAnswer")}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(reply.created_at)}
              </span>
            </div>

            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {reply.content}
            </p>

            {canMarkAccepted && !reply.is_accepted_answer && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-xs"
                onClick={onMarkAccepted}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                {t("discussion.markAsAccepted")}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
