import { useTranslation } from "react-i18next";
import { FileText, RefreshCw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState } from "@/components/EmptyState";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { cn } from "@/lib/utils";

interface DocItem {
  id: string;
  title: string;
  context_role: string;
  content_tokens: number;
}

interface BlogConfigPanelProps {
  topic: string;
  setTopic: (v: string) => void;
  additionalInstructions: string;
  setAdditionalInstructions: (v: string) => void;
  selectedDocIds: string[];
  onToggleDoc: (id: string) => void;
  activeDocuments: DocItem[];
  isGenerating: boolean;
  hasContent: boolean;
  onGenerate: () => void;
  onReset: () => void;
  onAddDocuments: () => void;
}

export function BlogConfigPanel({
  topic,
  setTopic,
  additionalInstructions,
  setAdditionalInstructions,
  selectedDocIds,
  onToggleDoc,
  activeDocuments,
  isGenerating,
  hasContent,
  onGenerate,
  onReset,
  onAddDocuments,
}: BlogConfigPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      {/* Topic & instructions */}
      <section className="space-y-5 border border-border rounded-sm p-6 bg-card/30">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">
            {t("aiStudio.topicTitle", "Tema e instrucciones")}
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="topic" className="text-xs uppercase tracking-wider text-foreground/70 font-semibold">
              {t("aiStudio.topic", "Tema")} *
            </Label>
            <HelpTooltip content={t("aiStudio.topicHelp", "Sea específico. Incluya el ángulo o perspectiva que quiere explorar.")} />
          </div>
          <Input
            id="topic"
            placeholder={t("aiStudio.topicPlaceholder", "ej. El futuro de la IA en la educación")}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isGenerating}
            className="rounded-sm border-border bg-transparent font-light"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="instructions" className="text-xs uppercase tracking-wider text-foreground/70 font-semibold">
              {t("aiStudio.additionalInstructions", "Instrucciones adicionales")}
            </Label>
            <HelpTooltip content={t("aiStudio.instructionsHelp", "Audiencia, tono, puntos clave o cosas a evitar.")} />
          </div>
          <Textarea
            id="instructions"
            placeholder={t("aiStudio.instructionsPlaceholder", "Puntos específicos a cubrir, ajustes de tono, etc.")}
            value={additionalInstructions}
            onChange={(e) => setAdditionalInstructions(e.target.value)}
            disabled={isGenerating}
            rows={3}
            className="rounded-sm border-border bg-transparent font-light resize-none"
          />
        </div>
      </section>

      {/* Context documents */}
      <section className="space-y-5 border border-border rounded-sm p-6 bg-card/30">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">
            {t("aiStudio.selectDocuments", "Contexto")}
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <p className="text-xs text-muted-foreground font-light -mt-3">
          {t("aiStudio.selectDocsDesc", "Documentos de su base de conocimiento usados como contexto.")}
        </p>

        {activeDocuments.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={t("aiStudio.noDocuments", "No hay documentos activos.")}
            description={t("aiStudio.noDocumentsDescription", "Agregue documentos a su base de conocimiento para usarlos como contexto.")}
            action={{ label: t("aiStudio.addDocuments", "Agregar documentos"), onClick: onAddDocuments }}
          />
        ) : (
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-1.5">
              {activeDocuments.map((doc) => {
                const selected = selectedDocIds.includes(doc.id);
                return (
                  <div
                    key={doc.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-sm border transition-colors cursor-pointer",
                      selected
                        ? "border-primary/60 bg-primary/[0.04]"
                        : "border-border hover:border-primary/30"
                    )}
                    onClick={() => onToggleDoc(doc.id)}
                  >
                    <Checkbox
                      checked={selected}
                      onCheckedChange={() => onToggleDoc(doc.id)}
                      disabled={isGenerating}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-light truncate text-foreground">{doc.title}</p>
                      <p className="text-xs text-muted-foreground font-light uppercase tracking-[0.1em] mt-0.5">
                        {doc.context_role.replace("_", " ")} · {doc.content_tokens} tokens
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </section>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={onGenerate}
          disabled={isGenerating || !topic.trim()}
          className="flex-1 rounded-sm"
          size="lg"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              {t("aiStudio.generating", "Generando…")}
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              {t("aiStudio.generate", "Generar contenido")}
            </>
          )}
        </Button>
        {hasContent && (
          <Button variant="outline" onClick={onReset} size="lg" className="rounded-sm">
            {t("aiStudio.reset", "Reiniciar")}
          </Button>
        )}
      </div>
    </div>
  );
}
