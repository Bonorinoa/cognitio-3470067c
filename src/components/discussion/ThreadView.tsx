import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowUp, ArrowDown, Clock, Bot, CheckCircle } from "lucide-react";
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

export default function ThreadView({
  discussion,
  hasAccess,
  isAuthenticated,
  isInstructorOrOwner,
  onBack,
  onSeekVideo,
  currentVideoTime,
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
      // Generate AI reply (non-streaming) - use current video time for context
      await generateReply.mutateAsync({
        discussionId: discussion.id,
        chapterId: discussion.chapter_id,
        videoTimestampSeconds: currentVideoTime ?? discussion.video_timestamp_seconds ?? undefined,
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
          <>
            {(() => {
              // Group replies: AI responses are linked to their parent prompts
              const parentReplies = replies.filter((r) => !r.parent_reply_id);
              const childRepliesMap = replies.reduce((acc, r) => {
                if (r.parent_reply_id) {
                  acc[r.parent_reply_id] = r;
                }
                return acc;
              }, {} as Record<string, DiscussionReply>);

              return parentReplies.map((reply) => {
                const aiChild = childRepliesMap[reply.id];
                // If this reply has an AI child, render them as a unified card
                if (aiChild) {
                  // Only count the AI reply votes (the target of user voting)
                  const voteCount = aiChild.upvote_count;
                  const effectiveVote = userVotes[aiChild.id] || null;
                  return (
                    <AIExchangeCard
                      key={reply.id}
                      promptReply={reply}
                      aiReply={aiChild}
                      voteCount={voteCount}
                      userVote={effectiveVote}
                      isAuthenticated={isAuthenticated}
                      onVote={(vote) => handleVoteReply(aiChild.id, vote)}
                      t={t}
                    />
                  );
                }
                // Otherwise render as a regular reply
                return (
                  <ReplyCard
                    key={reply.id}
                    reply={reply}
                    userVote={userVotes[reply.id] || null}
                    isAuthenticated={isAuthenticated}
                    onVote={(vote) => handleVoteReply(reply.id, vote)}
                    t={t}
                  />
                );
              });
            })()}
          </>
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
          currentVideoTime={currentVideoTime}
        />
      )}
    </div>
  );
}

interface ReplyCardProps {
  reply: DiscussionReply;
  userVote: number | null;
  isAuthenticated: boolean;
  onVote: (vote: 1 | -1) => void;
  t: (key: string) => string;
}

function ReplyCard({
  reply,
  userVote,
  isAuthenticated,
  onVote,
  t,
}: ReplyCardProps) {
  return (
    <Card>
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
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(reply.created_at)}
              </span>
            </div>

            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {reply.content}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface AIExchangeCardProps {
  promptReply: DiscussionReply;
  aiReply: DiscussionReply;
  voteCount: number;
  userVote: number | null;
  isAuthenticated: boolean;
  onVote: (vote: 1 | -1) => void;
  t: (key: string) => string;
}

function AIExchangeCard({
  promptReply,
  aiReply,
  voteCount,
  userVote,
  isAuthenticated,
  onVote,
  t,
}: AIExchangeCardProps) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="py-4">
        <div className="flex items-start gap-4">
          {/* Single voting control for the AI reply */}
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
            <span className="text-xs font-medium">{voteCount}</span>
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
          <div className="flex-1 space-y-4">
            {/* User's prompt */}
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={promptReply.author?.avatar_url || undefined} />
                  <AvatarFallback>
                    {promptReply.author?.full_name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {promptReply.author?.full_name || t("discussion.anonymous")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(promptReply.created_at)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {promptReply.content}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-border/50" />

            {/* AI response */}
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Avatar className="h-5 w-5 bg-primary/20">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">AI</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-primary">CognitioAI</span>
                <Badge variant="outline" className="gap-1 text-xs">
                  <Bot className="h-3 w-3" />
                  AI
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(aiReply.created_at)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {aiReply.content}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
