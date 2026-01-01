import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Sparkles, FileText, Send, RefreshCw, Copy, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useKnowledgeBase } from "@/hooks/useKnowledgeBase";
import { useContentGeneration } from "@/hooks/useContentGeneration";
import { useStyleProfile } from "@/hooks/useStyleProfile";
import type { ContentType } from "@/types/aiStudio";
import { CONTENT_TYPE_OPTIONS } from "@/types/aiStudio";

export default function InstructorAIStudio() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const { activeDocuments, isLoading: docsLoading } = useKnowledgeBase();
  const { styleProfile, isLoading: styleLoading } = useStyleProfile();
  const { generate, reset, isGenerating, generatedContent, error } = useContentGeneration();

  const [contentType, setContentType] = useState<ContentType>("blog");
  const [topic, setTopic] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const handleDocToggle = (docId: string) => {
    setSelectedDocIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: t("aiStudio.topicRequired", "Topic required"),
        description: t("aiStudio.enterTopic", "Please enter a topic for your content."),
        variant: "destructive",
      });
      return;
    }

    try {
      await generate({
        content_type: contentType,
        topic: topic.trim(),
        additional_instructions: additionalInstructions.trim() || undefined,
        selected_document_ids: selectedDocIds,
      });
      toast({
        title: t("aiStudio.generated", "Content generated"),
        description: t("aiStudio.generatedDesc", "Your content is ready!"),
      });
    } catch {
      toast({
        title: t("aiStudio.error", "Generation failed"),
        description: error || t("aiStudio.errorDesc", "Please try again."),
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: t("aiStudio.copied", "Copied to clipboard"),
    });
  };

  const handleReset = () => {
    reset();
    setTopic("");
    setAdditionalInstructions("");
    setSelectedDocIds([]);
  };

  const isLoading = docsLoading || styleLoading;
  const hasStyleProfile = styleProfile?.setup_completed;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t("aiStudio.title", "AI Studio")}</h1>
          <p className="text-muted-foreground">
            {t("aiStudio.subtitle", "Generate blog posts and newsletters from your knowledge base")}
          </p>
        </div>
      </div>

      {/* Setup Warning */}
      {!isLoading && !hasStyleProfile && (
        <Alert className="flex items-start gap-3">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <AlertDescription>
            {t("aiStudio.setupRequired", "Complete your Style Profile in Settings to get personalized content.")}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Configuration */}
        <div className="space-y-6">
          {/* Content Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("aiStudio.contentType", "Content Type")}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={contentType}
                onValueChange={(v) => setContentType(v as ContentType)}
                className="space-y-3"
              >
                {CONTENT_TYPE_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                      contentType === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => setContentType(option.value)}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <div className="flex-1">
                      <Label htmlFor={option.value} className="font-medium cursor-pointer">
                        {option.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Topic & Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("aiStudio.topicTitle", "Topic & Instructions")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">{t("aiStudio.topic", "Topic")} *</Label>
                <Input
                  id="topic"
                  placeholder={t("aiStudio.topicPlaceholder", "e.g., The future of AI in education")}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isGenerating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructions">
                  {t("aiStudio.additionalInstructions", "Additional Instructions")}
                </Label>
                <Textarea
                  id="instructions"
                  placeholder={t(
                    "aiStudio.instructionsPlaceholder",
                    "Any specific points to cover, tone adjustments, etc."
                  )}
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  disabled={isGenerating}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Document Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t("aiStudio.selectDocuments", "Context Documents")}
              </CardTitle>
              <CardDescription>
                {t("aiStudio.selectDocsDesc", "Select documents to include as context for generation")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeDocuments.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  {t("aiStudio.noDocuments", "No documents in your knowledge base yet.")}
                </p>
              ) : (
                <ScrollArea className="h-[200px] pr-4">
                  <div className="space-y-2">
                    {activeDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                          selectedDocIds.includes(doc.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/50"
                        }`}
                        onClick={() => handleDocToggle(doc.id)}
                      >
                        <Checkbox
                          checked={selectedDocIds.includes(doc.id)}
                          onCheckedChange={() => handleDocToggle(doc.id)}
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

          {/* Generate Button */}
          <div className="flex gap-3">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
              className="flex-1"
              size="lg"
            >
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
            {generatedContent && (
              <Button variant="outline" onClick={handleReset} size="lg">
                {t("aiStudio.reset", "Reset")}
              </Button>
            )}
          </div>
        </div>

        {/* Right: Output */}
        <Card className="lg:sticky lg:top-6 h-fit">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">{t("aiStudio.output", "Generated Content")}</CardTitle>
              <CardDescription>
                {generatedContent
                  ? t("aiStudio.outputReady", "Your content is ready to copy")
                  : t("aiStudio.outputEmpty", "Content will appear here")}
              </CardDescription>
            </div>
            {generatedContent && (
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    {t("aiStudio.copied", "Copied")}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    {t("aiStudio.copy", "Copy")}
                  </>
                )}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Alert variant="destructive" className="flex items-start gap-3">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              ) : generatedContent ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ScrollArea className="h-[500px]">
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                      {generatedContent}
                    </div>
                  </ScrollArea>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-[500px] flex items-center justify-center"
                >
                  <div className="text-center text-muted-foreground">
                    <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>{t("aiStudio.startPrompt", "Enter a topic and click Generate to create content")}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
