import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type DraftContentType = "blog" | "newsletter";

export interface Draft {
  id: string;
  content_type: DraftContentType;
  topic: string;
  generated_content: string;
  created_at: string;
  updated_at: string;
  pinned: boolean;
  is_active: boolean;
}

export interface SaveDraftParams {
  content_type: DraftContentType;
  topic: string;
  generated_content: string;
  additional_instructions?: string;
  selected_document_ids?: string[];
}

interface UseDraftsOptions {
  contentType?: DraftContentType | "all";
  search?: string;
  includeArchived?: boolean;
  limit?: number;
}

/**
 * Rolling auto-archive cap. Pinned drafts are never archived.
 */
export const DRAFTS_CAP = 25;

export function useDrafts(options: UseDraftsOptions = {}) {
  const { contentType = "all", search, includeArchived = false, limit } = options;
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const queryKey = ["drafts", user?.id, { contentType, search, includeArchived, limit }];

  const { data: drafts = [], isLoading } = useQuery({
    queryKey,
    queryFn: async (): Promise<Draft[]> => {
      if (!user?.id) return [];

      let query = supabase
        .from("ai_generation_history")
        .select("id, content_type, topic, generated_content, created_at, updated_at, pinned, is_active")
        .eq("user_id", user.id)
        .eq("status", "completed");

      if (!includeArchived) query = query.eq("is_active", true);
      if (contentType !== "all") query = query.eq("content_type", contentType);
      if (search?.trim()) query = query.ilike("topic", `%${search.trim()}%`);

      query = query
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false });

      if (limit) query = query.limit(limit);

      const { data, error } = await query;
      if (error) throw error;
      return (data as Draft[]) ?? [];
    },
    enabled: !!user?.id,
    staleTime: 30_000,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["drafts"] });
    queryClient.invalidateQueries({ queryKey: ["generation-usage"] });
  };

  const saveDraft = async (params: SaveDraftParams): Promise<string | null> => {
    if (!user?.id) return null;

    const { count } = await supabase
      .from("ai_generation_history")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "completed")
      .eq("is_active", true)
      .eq("pinned", false);

    if (count && count >= DRAFTS_CAP) {
      const { data: oldest } = await supabase
        .from("ai_generation_history")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .eq("is_active", true)
        .eq("pinned", false)
        .order("created_at", { ascending: true })
        .limit(1);

      if (oldest?.[0]) {
        await supabase
          .from("ai_generation_history")
          .update({ is_active: false })
          .eq("id", oldest[0].id);
      }
    }

    const { data, error } = await supabase
      .from("ai_generation_history")
      .insert({
        user_id: user.id,
        content_type: params.content_type,
        topic: params.topic,
        generated_content: params.generated_content,
        additional_instructions: params.additional_instructions,
        selected_document_ids: params.selected_document_ids || [],
        status: "completed",
        model_used: "google/gemini-3-flash-preview",
      })
      .select("id")
      .single();

    if (error) throw error;
    invalidate();
    return data.id;
  };

  const updateDraft = async (id: string, content: string): Promise<void> => {
    if (!user?.id) return;
    const { error } = await supabase
      .from("ai_generation_history")
      .update({ generated_content: content, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) throw error;
    invalidate();
  };

  const deleteDraft = async (id: string): Promise<void> => {
    if (!user?.id) return;
    const { error } = await supabase
      .from("ai_generation_history")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) throw error;
    invalidate();
  };

  const renameMutation = useMutation({
    mutationFn: async ({ id, topic }: { id: string; topic: string }) => {
      if (!user?.id) throw new Error("Not authenticated");
      const trimmed = topic.trim().slice(0, 200);
      if (!trimmed) throw new Error("Topic cannot be empty");
      const { error } = await supabase
        .from("ai_generation_history")
        .update({ topic: trimmed, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const duplicateMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error("Not authenticated");
      const { data: source, error: fetchError } = await supabase
        .from("ai_generation_history")
        .select("content_type, topic, generated_content, additional_instructions, selected_document_ids, model_used")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();
      if (fetchError) throw fetchError;

      const { error: insertError } = await supabase
        .from("ai_generation_history")
        .insert({
          user_id: user.id,
          content_type: source.content_type,
          topic: `${source.topic} (copia)`.slice(0, 200),
          generated_content: source.generated_content,
          additional_instructions: source.additional_instructions,
          selected_document_ids: source.selected_document_ids || [],
          status: "completed",
          model_used: source.model_used || "google/gemini-3-flash-preview",
        });
      if (insertError) throw insertError;
    },
    onSuccess: invalidate,
  });

  const pinMutation = useMutation({
    mutationFn: async ({ id, pinned }: { id: string; pinned: boolean }) => {
      if (!user?.id) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("ai_generation_history")
        .update({ pinned })
        .eq("id", id)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("ai_generation_history")
        .update({ is_active: true })
        .eq("id", id)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return {
    drafts,
    isLoading,
    saveDraft,
    updateDraft,
    deleteDraft,
    renameDraft: (id: string, topic: string) => renameMutation.mutateAsync({ id, topic }),
    duplicateDraft: (id: string) => duplicateMutation.mutateAsync(id),
    pinDraft: (id: string) => pinMutation.mutate({ id, pinned: true }),
    unpinDraft: (id: string) => pinMutation.mutate({ id, pinned: false }),
    restoreDraft: restoreMutation.mutate,
    isPinning: pinMutation.isPending,
    isRenaming: renameMutation.isPending,
    isDuplicating: duplicateMutation.isPending,
    isRestoring: restoreMutation.isPending,
    invalidate,
  };
}

export function formatRelativeTime(dateString: string, locale = "es"): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (locale === "es") {
    if (diffMins < 1) return "Hace instantes";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays < 7) return `Hace ${diffDays} d`;
    return date.toLocaleDateString("es");
  }
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
