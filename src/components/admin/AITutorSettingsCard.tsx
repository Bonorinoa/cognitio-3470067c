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

const DEFAULT_SYSTEM_PROMPT = `Eres CognitioAI, un asistente de aprendizaje Socrático para la plataforma Cognitio. Tu rol es ayudar a los estudiantes a entender el material del curso guiándolos a descubrir las respuestas por sí mismos en lugar de dárselas directamente.

Lineamientos:
- Hacé preguntas aclaratorias para entender en qué está trabado el estudiante
- Descomponé los conceptos complejos en partes más simples
- Usá analogías y ejemplos relacionados con el contenido del curso
- Hacé referencia a la transcripción del video cuando ayude
- Fomentá el pensamiento crítico
- Sé respetuoso y paciente
- Mantené las respuestas concisas y enfocadas`;

const AI_MODELS = [
  { value: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash (Recomendado)" },
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
      toast({ title: "Configuración del AI Tutor guardada" });
    },
    onError: (error: Error) => {
      toast({ title: "Error al guardar la configuración", description: error.message, variant: "destructive" });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Configuración del AI Tutor
        </CardTitle>
        <CardDescription>
          Configurá el tutor de IA que acompaña a los estudiantes en las discusiones de cada curso
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
                  AI Tutor activado
                </Label>
                <p className="text-sm text-muted-foreground">
                  Cuando está desactivado, los estudiantes no pueden invocar @CognitioAI en las discusiones
                </p>
              </div>
              <Switch id="ai-enabled" checked={aiEnabled} onCheckedChange={setAiEnabled} />
            </div>

            {!aiEnabled && (
              <div className="p-4 rounded-lg border border-destructive bg-destructive/10 text-destructive">
                ⚠️ El AI Tutor está desactivado para todos los usuarios
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="system-prompt">Prompt del sistema</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAiSystemPrompt(DEFAULT_SYSTEM_PROMPT)}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Restaurar predeterminado
                </Button>
              </div>
              <Textarea
                id="system-prompt"
                value={aiSystemPrompt}
                onChange={(e) => setAiSystemPrompt(e.target.value)}
                rows={8}
                placeholder="Ingresá el prompt base del tutor de IA..."
              />
              <p className="text-xs text-muted-foreground">
                Este prompt define cómo se comporta y responde el tutor de IA a los estudiantes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ai-model">Modelo de IA</Label>
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
                  Temperatura: {aiTemperature.toFixed(1)}
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
                  Más bajo = más enfocado · Más alto = más creativo
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-tokens">Tokens máximos</Label>
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
                  Longitud máxima de respuesta (256-4096)
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => save.mutate()} disabled={save.isPending}>
                {save.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar configuración"
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
