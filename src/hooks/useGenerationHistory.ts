import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface GenerationHistoryItem {
  id: string;
  content_type: "blog" | "newsletter";
  topic: string;
  generated_content: string;
  created_at: string;
}

interface SaveGenerationParams {
  content_type: "blog" | "newsletter";
  topic: string;
  generated_content: string;
  additional_instructions?: string;
  selected_document_ids?: string[];
}

const HISTORY_LIMIT = 10;

export function useGenerationHistory() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: history = [], isLoading } = useQuery({
    queryKey: ["generation-history", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("ai_generation_history")
        .select("id, content_type, topic, generated_content, created_at")
        .eq("instructor_id", user.id)
        .eq("status", "completed")
        .eq("is_active", true) // Only show active items in history
        .order("created_at", { ascending: false })
        .limit(HISTORY_LIMIT);

      if (error) throw error;
      return data as GenerationHistoryItem[];
    },
    enabled: !!user?.id,
    staleTime: 60000,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["generation-history"] });
    queryClient.invalidateQueries({ queryKey: ["generation-usage"] });
  };

  const saveGeneration = async (params: SaveGenerationParams): Promise<string | null> => {
    if (!user?.id) return null;

    // Check current count of ACTIVE items
    const { count } = await supabase
      .from("ai_generation_history")
      .select("*", { count: "exact", head: true })
      .eq("instructor_id", user.id)
      .eq("status", "completed")
      .eq("is_active", true);

    // If at limit, soft-delete oldest (set is_active = false)
    if (count && count >= HISTORY_LIMIT) {
      const { data: oldest } = await supabase
        .from("ai_generation_history")
        .select("id")
        .eq("instructor_id", user.id)
        .eq("status", "completed")
        .eq("is_active", true)
        .order("created_at", { ascending: true })
        .limit(1);

      if (oldest?.[0]) {
        await supabase
          .from("ai_generation_history")
          .update({ is_active: false })
          .eq("id", oldest[0].id);
      }
    }

    // Insert new
    const { data, error } = await supabase
      .from("ai_generation_history")
      .insert({
        instructor_id: user.id,
        content_type: params.content_type,
        topic: params.topic,
        generated_content: params.generated_content,
        additional_instructions: params.additional_instructions,
        selected_document_ids: params.selected_document_ids || [],
        status: "completed",
        model_used: "google/gemini-2.5-flash",
      })
      .select("id")
      .single();

    if (error) throw error;
    invalidate();
    return data.id;
  };

  const updateGeneration = async (id: string, content: string): Promise<void> => {
    if (!user?.id) return;

    const { error } = await supabase
      .from("ai_generation_history")
      .update({
        generated_content: content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("instructor_id", user.id);

    if (error) throw error;
    invalidate();
  };

  const deleteGeneration = async (id: string): Promise<void> => {
    if (!user?.id) return;

    const { error } = await supabase
      .from("ai_generation_history")
      .delete()
      .eq("id", id)
      .eq("instructor_id", user.id);

    if (error) throw error;
    invalidate();
  };

  return {
    history,
    isLoading,
    saveGeneration,
    updateGeneration,
    deleteGeneration,
    invalidate,
  };
}

// Helper for relative time display
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
