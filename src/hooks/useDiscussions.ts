import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Discussion {
  id: string;
  chapter_id: string;
  course_id: string;
  user_id: string;
  title: string;
  content: string;
  video_timestamp_seconds: number | null;
  is_resolved: boolean;
  has_ai_response: boolean;
  upvote_count: number;
  reply_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface DiscussionReply {
  id: string;
  discussion_id: string;
  user_id: string;
  content: string;
  is_ai_generated: boolean;
  is_accepted_answer: boolean;
  upvote_count: number;
  created_at: string;
  parent_reply_id: string | null;
  author?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export type SortOption = "top" | "new";

export function useDiscussions(chapterId: string | undefined, sortBy: SortOption = "new") {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch discussions for a chapter
  const { data: discussions = [], isLoading } = useQuery({
    queryKey: ["discussions", chapterId, sortBy],
    queryFn: async () => {
      if (!chapterId) return [];

      // Fetch discussions
      const { data: discussionsData, error } = await supabase
        .from("discussions")
        .select("*")
        .eq("chapter_id", chapterId)
        .order("created_at", { ascending: sortBy === "new" ? false : true });

      if (error) {
        console.error("Error fetching discussions:", error);
        return [];
      }

      if (!discussionsData || discussionsData.length === 0) return [];

      // Fetch author profiles separately
      const userIds = [...new Set(discussionsData.map((d) => d.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", userIds);

      const profileMap = (profiles || []).reduce((acc, p) => {
        acc[p.id] = { full_name: p.full_name, avatar_url: p.avatar_url };
        return acc;
      }, {} as Record<string, { full_name: string | null; avatar_url: string | null }>);

      const result: Discussion[] = discussionsData.map((d) => ({
        ...d,
        author: profileMap[d.user_id] || { full_name: null, avatar_url: null },
      }));

      // Apply time decay for "top" sort
      if (sortBy === "top") {
        const now = Date.now();
        return result.sort((a, b) => {
          const hoursA = (now - new Date(a.created_at).getTime()) / (1000 * 60 * 60);
          const hoursB = (now - new Date(b.created_at).getTime()) / (1000 * 60 * 60);
          const scoreA = a.upvote_count / (1 + hoursA / 24);
          const scoreB = b.upvote_count / (1 + hoursB / 24);
          return scoreB - scoreA;
        });
      }

      return result;
    },
    enabled: !!chapterId,
  });

  // Create a new discussion
  const createDiscussion = useMutation({
    mutationFn: async (params: {
      chapterId: string;
      courseId: string;
      title: string;
      content: string;
      videoTimestamp?: number;
    }) => {
      if (!user) throw new Error("Must be logged in");

      const { data, error } = await supabase
        .from("discussions")
        .insert({
          chapter_id: params.chapterId,
          course_id: params.courseId,
          user_id: user.id,
          title: params.title,
          content: params.content,
          video_timestamp_seconds: params.videoTimestamp || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussions", chapterId] });
    },
  });

  // Toggle resolved status
  const toggleResolved = useMutation({
    mutationFn: async (discussionId: string) => {
      const discussion = discussions.find((d) => d.id === discussionId);
      if (!discussion) throw new Error("Discussion not found");

      const { error } = await supabase
        .from("discussions")
        .update({ is_resolved: !discussion.is_resolved })
        .eq("id", discussionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussions", chapterId] });
    },
  });

  return {
    discussions,
    isLoading,
    createDiscussion,
    toggleResolved,
  };
}

export function useDiscussionReplies(discussionId: string | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch replies for a discussion
  const { data: replies = [], isLoading } = useQuery({
    queryKey: ["discussion-replies", discussionId],
    queryFn: async () => {
      if (!discussionId) return [];

      // Fetch replies
      const { data: repliesData, error } = await supabase
        .from("discussion_replies")
        .select("*")
        .eq("discussion_id", discussionId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching replies:", error);
        return [];
      }

      if (!repliesData || repliesData.length === 0) return [];

      // Fetch author profiles separately
      const userIds = [...new Set(repliesData.map((r) => r.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", userIds);

      const profileMap = (profiles || []).reduce((acc, p) => {
        acc[p.id] = { full_name: p.full_name, avatar_url: p.avatar_url };
        return acc;
      }, {} as Record<string, { full_name: string | null; avatar_url: string | null }>);

      const result: DiscussionReply[] = repliesData.map((r) => ({
        ...r,
        author: profileMap[r.user_id] || { full_name: null, avatar_url: null },
      }));

      // Sort: accepted answers first, then by upvotes, then by time
      return result.sort((a, b) => {
        if (a.is_accepted_answer && !b.is_accepted_answer) return -1;
        if (!a.is_accepted_answer && b.is_accepted_answer) return 1;
        if (a.upvote_count !== b.upvote_count) return b.upvote_count - a.upvote_count;
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });
    },
    enabled: !!discussionId,
  });

  // Create a reply
  const createReply = useMutation({
    mutationFn: async (content: string) => {
      if (!user || !discussionId) throw new Error("Must be logged in");

      const { data, error } = await supabase
        .from("discussion_replies")
        .insert({
          discussion_id: discussionId,
          user_id: user.id,
          content,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussion-replies", discussionId] });
      queryClient.invalidateQueries({ queryKey: ["discussions"] });
    },
  });

  // Toggle accepted answer
  const toggleAccepted = useMutation({
    mutationFn: async (replyId: string) => {
      const reply = replies.find((r) => r.id === replyId);
      if (!reply) throw new Error("Reply not found");

      const { error } = await supabase
        .from("discussion_replies")
        .update({ is_accepted_answer: !reply.is_accepted_answer })
        .eq("id", replyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussion-replies", discussionId] });
    },
  });

  return {
    replies,
    isLoading,
    createReply,
    toggleAccepted,
  };
}

export function useDiscussionVotes() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get user's votes for a set of targets
  const getUserVotes = async (targetType: "discussion" | "reply", targetIds: string[]) => {
    if (!user || targetIds.length === 0) return {};

    const { data, error } = await supabase
      .from("discussion_votes")
      .select("target_id, vote")
      .eq("user_id", user.id)
      .eq("target_type", targetType)
      .in("target_id", targetIds);

    if (error) {
      console.error("Error fetching votes:", error);
      return {};
    }

    return data.reduce((acc, v) => ({ ...acc, [v.target_id]: v.vote }), {} as Record<string, number>);
  };

  // Vote on a discussion or reply
  const vote = useMutation({
    mutationFn: async (params: {
      targetType: "discussion" | "reply";
      targetId: string;
      vote: 1 | -1;
      currentVote: number | null;
    }) => {
      if (!user) throw new Error("Must be logged in");

      // If already voted the same way, remove vote
      if (params.currentVote === params.vote) {
        const { error } = await supabase
          .from("discussion_votes")
          .delete()
          .eq("user_id", user.id)
          .eq("target_type", params.targetType)
          .eq("target_id", params.targetId);

        if (error) throw error;
        return { removed: true };
      }

      // Upsert vote
      const { error } = await supabase
        .from("discussion_votes")
        .upsert({
          user_id: user.id,
          target_type: params.targetType,
          target_id: params.targetId,
          vote: params.vote,
        }, {
          onConflict: "user_id,target_type,target_id",
        });

      if (error) throw error;
      return { removed: false };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussions"] });
      queryClient.invalidateQueries({ queryKey: ["discussion-replies"] });
      queryClient.invalidateQueries({ queryKey: ["user-votes"] });
    },
  });

  return {
    getUserVotes,
    vote,
  };
}
