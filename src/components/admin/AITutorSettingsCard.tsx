import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bot, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

const DEFAULT_SYSTEM_PROMPT = `You are CognitioAI, a Socratic learning assistant for the Cognitio platform. Your role is to help students understand course material by guiding them to discover answers themselves rather than giving direct answers.

Guidelines:
- Ask clarifying questions to understand what the student is struggling with
- Break down complex concepts into simpler parts
- Use analogies and examples relevant to the course content
- Reference the video transcript when helpful
- Encourage critical thinking
- Be supportive and patient
- Keep responses concise and focused`;

const AI_MODELS = [
  { value: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash (Recommended)" },
  { value: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  { value: "google/gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite" },
  { value: "openai/gpt-5-mini", label: "GPT-5 Mini" },
  { value: "openai/gpt-5-nano", label: "GPT-5 Nano" },
];

export function AITutorSettingsCard() {
  const queryClient = useQueryClient();
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiSystemPrompt, setAiSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [aiModel, setAiModel] = useState("google/gemini-2.5-flash");
  const [aiTemperature, setAiTemperature] = useState(0.7);
  const [aiMaxTokens, setAiMaxTokens] = useState(1024);

  const { isLoading } = useQuery({
    queryKey: ["ai-tutor-settings-admin"],
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
      if (error) throw error;
      const map = data.reduce((acc, { key, value }) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, unknown>);
      setAiEnabled((map.ai_tutor_enabled as boolean) ?? true);
      setAiSystemPrompt((map.ai_tutor_system_prompt as string) ?? DEFAULT_SYSTEM_PROMPT);
      setAiModel((map.ai_tutor_model as string) ?? "google/gemini-2.5-flash");
      setAiTemperature((map.ai_tutor_temperature as number) ?? 0.7);
      setAiMaxTokens((map.ai_tutor_max_tokens as number) ?? 1024);
      return map;
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const settings = [
        { key: "ai_tutor_enabled", value: aiEnabled },
        { key: "ai_tutor_system_prompt", value: aiSystemPrompt },
        { key: "ai_tutor_model", value: aiModel },
        { key: "ai_tutor_temperature", value: aiTemperature },
        { key: "ai_tutor_max_tokens", value: aiMaxTokens },
      ];
      for (const setting of settings) {
        const { error } = await supabase
          .from("platform_settings")
          .upsert(
            {
              key: setting.key,
              value: setting.value as unknown as Database["public"]["Tables"]["platform_settings"]["Insert"]["value"],
            },
            { onConflict: "key" }
          );
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-tutor-settings"] });
      toast({ title: "AI Tutor settings saved successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to save settings", description: error.message, variant: "destructive" });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Tutor Settings
        </CardTitle>
        <CardDescription>
          Configure the AI tutor that helps students in course discussions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/50">
              <div>
                <Label htmlFor="ai-enabled" className="text-base font-medium">
                  AI Tutor Enabled
                </Label>
                <p className="text-sm text-muted-foreground">
                  When disabled, students cannot use @CognitioAI in discussions
                </p>
              </div>
              <Switch id="ai-enabled" checked={aiEnabled} onCheckedChange={setAiEnabled} />
            </div>

            {!aiEnabled && (
              <div className="p-4 rounded-lg border border-destructive bg-destructive/10 text-destructive">
                ⚠️ AI Tutor is currently disabled for all users
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="system-prompt">System Prompt</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAiSystemPrompt(DEFAULT_SYSTEM_PROMPT)}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset to Default
                </Button>
              </div>
              <Textarea
                id="system-prompt"
                value={aiSystemPrompt}
                onChange={(e) => setAiSystemPrompt(e.target.value)}
                rows={8}
                placeholder="Enter the system prompt for the AI tutor..."
              />
              <p className="text-xs text-muted-foreground">
                This prompt defines how the AI tutor behaves and responds to students
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ai-model">AI Model</Label>
                <Select value={aiModel} onValueChange={setAiModel}>
                  <SelectTrigger id="ai-model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_MODELS.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature">
                  Temperature: {aiTemperature.toFixed(1)}
                </Label>
                <Input
                  id="temperature"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={aiTemperature}
                  onChange={(e) => setAiTemperature(parseFloat(e.target.value))}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Lower = more focused, Higher = more creative
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-tokens">Max Tokens</Label>
                <Input
                  id="max-tokens"
                  type="number"
                  min="256"
                  max="4096"
                  step="256"
                  value={aiMaxTokens}
                  onChange={(e) => setAiMaxTokens(parseInt(e.target.value) || 1024)}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum response length (256-4096)
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => save.mutate()} disabled={save.isPending}>
                {save.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save AI Settings"
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
