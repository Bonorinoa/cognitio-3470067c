import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const AI_TUTOR_LIMIT_PER_CHAPTER = 5;

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
          model: "google/gemini-2.5-flash",
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
        model: settingsMap.ai_tutor_model as string ?? "google/gemini-2.5-flash",
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
      model: "google/gemini-2.5-flash",
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
        .eq("chapter_id", chapterId);

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

export interface StreamingState {
  isStreaming: boolean;
  streamingContent: string;
  promptReplyId: string | null;
}

export function useAITutorReply() {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const [streamingState, setStreamingState] = useState<StreamingState>({
    isStreaming: false,
    streamingContent: "",
    promptReplyId: null,
  });

  const generateReplyStreaming = useCallback(async (params: {
    discussionId: string;
    chapterId: string;
    videoTimestampSeconds?: number;
    userMessage: string;
  }) => {
    setStreamingState({
      isStreaming: true,
      streamingContent: "",
      promptReplyId: null,
    });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-discussion-reply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            discussion_id: params.discussionId,
            chapter_id: params.chapterId,
            video_timestamp_seconds: params.videoTimestampSeconds,
            user_message: params.userMessage,
            stream: true,
            language: i18n.language,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate AI response");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let result = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              
              if (parsed.type === "start") {
                setStreamingState(prev => ({
                  ...prev,
                  promptReplyId: parsed.promptReplyId,
                }));
              } else if (parsed.type === "delta") {
                setStreamingState(prev => ({
                  ...prev,
                  streamingContent: prev.streamingContent + parsed.content,
                }));
              } else if (parsed.type === "done") {
                result = parsed;
              } else if (parsed.type === "error") {
                throw new Error(parsed.error);
              }
            } catch (e) {
              // Skip invalid JSON
              if (e instanceof Error && e.message !== "Unexpected end of JSON input") {
                console.error("Parse error:", e);
              }
            }
          }
        }
      }

      // Invalidate queries to refresh the replies list
      queryClient.invalidateQueries({ queryKey: ["discussion-replies", params.discussionId] });
      queryClient.invalidateQueries({ queryKey: ["discussions"] });
      queryClient.invalidateQueries({ queryKey: ["ai-tutor-usage"] });

      return result;
    } finally {
      setStreamingState({
        isStreaming: false,
        streamingContent: "",
        promptReplyId: null,
      });
    }
  }, [queryClient, i18n.language]);

  // Keep the non-streaming version as fallback
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
    generateReplyStreaming,
    streamingState,
    isGenerating: generateReply.isPending || streamingState.isStreaming,
  };
}
