import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Messages per chapter PER DAY. Must stay in sync with AI_TUTOR_LIMIT in the
// ai-discussion-reply edge function.
const AI_TUTOR_LIMIT_PER_CHAPTER = 5;

// Quota day boundary: 06:00 Argentina = 09:00 UTC. Mirrors getDayStart() in
// supabase/functions/_shared/ai.ts.
const RESET_HOUR_UTC = 9;
function getDayStart(): Date {
  const now = new Date();
  const dayStart = new Date(now);
  dayStart.setUTCHours(RESET_HOUR_UTC, 0, 0, 0);
  if (now < dayStart) dayStart.setUTCDate(dayStart.getUTCDate() - 1);
  return dayStart;
}

export interface AITutorSettings {
  enabled: boolean;
  systemPrompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export function useAITutorSettings() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["ai-tutor-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("platform_settings")
        .select("key, value")
        .in("key", [
          "ai_tutor_enabled",
          "ai_tutor_system_prompt",
          "ai_tutor_model",
          "ai_tutor_temperature",
          "ai_tutor_max_tokens",
        ]);

      if (error) {
        console.error("Error fetching AI tutor settings:", error);
        return {
          enabled: true,
          systemPrompt: "",
          model: "google/gemini-3-flash-preview",
          temperature: 0.7,
          maxTokens: 1024,
        };
      }

      const settingsMap = data.reduce((acc, { key, value }) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, unknown>);

      return {
        enabled: settingsMap.ai_tutor_enabled as boolean ?? true,
        systemPrompt: settingsMap.ai_tutor_system_prompt as string ?? "",
        model: settingsMap.ai_tutor_model as string ?? "google/gemini-3-flash-preview",
        temperature: settingsMap.ai_tutor_temperature as number ?? 0.7,
        maxTokens: settingsMap.ai_tutor_max_tokens as number ?? 1024,
      };
    },
    staleTime: 60000,
  });

  return {
    settings: settings ?? {
      enabled: true,
      systemPrompt: "",
      model: "google/gemini-3-flash-preview",
      temperature: 0.7,
      maxTokens: 1024,
    },
    isLoading,
  };
}

export function useAITutorUsage(chapterId: string | undefined) {
  const { user } = useAuth();

  const { data: usage = 0, isLoading } = useQuery({
    queryKey: ["ai-tutor-usage", user?.id, chapterId],
    queryFn: async () => {
      if (!user || !chapterId) return 0;

      const { count, error } = await supabase
        .from("ai_tutor_usage")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("chapter_id", chapterId)
        .gte("created_at", getDayStart().toISOString());

      if (error) {
        console.error("Error fetching AI tutor usage:", error);
        return 0;
      }

      return count ?? 0;
    },
    enabled: !!user && !!chapterId,
    staleTime: 30000,
  });

  return {
    used: usage,
    remaining: Math.max(0, AI_TUTOR_LIMIT_PER_CHAPTER - usage),
    limit: AI_TUTOR_LIMIT_PER_CHAPTER,
    isLoading,
    canUseAI: usage < AI_TUTOR_LIMIT_PER_CHAPTER,
  };
}

export function useAITutorReply() {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();

  const generateReply = useMutation({
    mutationFn: async (params: {
      discussionId: string;
      chapterId: string;
      videoTimestampSeconds?: number;
      userMessage: string;
    }) => {
      const { data, error } = await supabase.functions.invoke("ai-discussion-reply", {
        body: {
          discussion_id: params.discussionId,
          chapter_id: params.chapterId,
          video_timestamp_seconds: params.videoTimestampSeconds,
          user_message: params.userMessage,
          language: i18n.language,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["discussion-replies", variables.discussionId] });
      queryClient.invalidateQueries({ queryKey: ["discussions"] });
      queryClient.invalidateQueries({ queryKey: ["ai-tutor-usage"] });
    },
  });

  return {
    generateReply,
    isGenerating: generateReply.isPending,
  };
}
