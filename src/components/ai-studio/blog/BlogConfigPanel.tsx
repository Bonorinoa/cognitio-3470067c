import { useTranslation } from "react-i18next";
import { FileText, RefreshCw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState } from "@/components/EmptyState";
import { HelpTooltip } from "@/components/ui/help-tooltip";

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("aiStudio.topicTitle", "Topic & Instructions")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="topic">{t("aiStudio.topic", "Topic")} *</Label>
              <HelpTooltip content={t("aiStudio.topicHelp", "Be specific about your topic. Include the angle or perspective you want to explore.")} />
            </div>
            <Input
              id="topic"
              placeholder={t("aiStudio.topicPlaceholder", "e.g., The future of AI in education")}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isGenerating}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="instructions">{t("aiStudio.additionalInstructions", "Additional Instructions")}</Label>
              <HelpTooltip content={t("aiStudio.instructionsHelp", "Add specific requirements: target audience, tone, key points to include, or things to avoid.")} />
            </div>
            <Textarea
              id="instructions"
              placeholder={t("aiStudio.instructionsPlaceholder", "Any specific points to cover, tone adjustments, etc.")}
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              disabled={isGenerating}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t("aiStudio.selectDocuments", "Context Documents")}
          </CardTitle>
          <CardDescription>{t("aiStudio.selectDocsDesc", "Select documents to include as context for generation")}</CardDescription>
        </CardHeader>
        <CardContent>
          {activeDocuments.length === 0 ? (
            <EmptyState
              icon={FileText}
              title={t("aiStudio.noDocuments", "No documents in your knowledge base yet.")}
              description={t("aiStudio.noDocumentsDescription", "Agrega documentos a tu base de conocimiento para usarlos como contexto en la generación de contenido.")}
              action={{ label: t("aiStudio.addDocuments", "Add Documents"), onClick: onAddDocuments }}
            />
          ) : (
            <ScrollArea className="h-[200px] pr-4">
              <div className="space-y-2">
                {activeDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                      selectedDocIds.includes(doc.id) ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => onToggleDoc(doc.id)}
                  >
                    <Checkbox
                      checked={selectedDocIds.includes(doc.id)}
                      onCheckedChange={() => onToggleDoc(doc.id)}
                      disabled={isGenerating}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.context_role.replace("_", " ")} • {doc.content_tokens} tokens
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={onGenerate} disabled={isGenerating || !topic.trim()} className="flex-1" size="lg">
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              {t("aiStudio.generating", "Generating...")}
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              {t("aiStudio.generate", "Generate Content")}
            </>
          )}
        </Button>
        {hasContent && (
          <Button variant="outline" onClick={onReset} size="lg">
            {t("aiStudio.reset", "Reset")}
          </Button>
        )}
      </div>
    </div>
  );
}
