import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { 
  Sparkles, FileText, Send, RefreshCw, Copy, Check, AlertCircle, 
  FileEdit, Download, FileCode, Eye, Pencil, Wand2, Save 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/EmptyState";
import { useToast } from "@/hooks/use-toast";
import { useKnowledgeBase } from "@/hooks/useKnowledgeBase";
import { useContentGeneration } from "@/hooks/useContentGeneration";
import { useStyleProfile } from "@/hooks/useStyleProfile";
import { useGenerationHistory, GenerationHistoryItem } from "@/hooks/useGenerationHistory";
import { useAIStudioContext } from "@/components/AIStudioLayout";
import { supabase } from "@/integrations/supabase/client";

export default function AIStudioBlog() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const aiStudioContext = useAIStudioContext();
  const { activeDocuments, isLoading: docsLoading } = useKnowledgeBase();
  const { isLoading: styleLoading, hasCompletedSetup } = useStyleProfile();
  const { generate, reset, isGenerating, generatedContent, error } = useContentGeneration();
  const { history, saveGeneration, updateGeneration, deleteGeneration } = useGenerationHistory();

  const [topic, setTopic] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableContent, setEditableContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // History state
  const [loadedHistoryId, setLoadedHistoryId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Refine state
  const [selectedText, setSelectedText] = useState("");
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);
  const [showRefineButton, setShowRefineButton] = useState(false);
  const [refineDialogOpen, setRefineDialogOpen] = useState(false);
  const [refineInstruction, setRefineInstruction] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [refinedText, setRefinedText] = useState<string | null>(null);
  const [showDiffView, setShowDiffView] = useState(false);

  // Sync generated content to editable content
  // Register handlers with context for sidebar communication
  useEffect(() => {
    if (aiStudioContext) {
      aiStudioContext.setHandlers({
        onLoadHistory: handleLoadHistory,
        onDeleteHistory: handleDeleteHistory,
      });
    }
  });

  // Sync generated content to editable content
  useEffect(() => {
    if (generatedContent && !isGenerating) {
      setEditableContent(generatedContent);
      // New generation, not from history
      setLoadedHistoryId(null);
      setHasUnsavedChanges(false);
    }
  }, [generatedContent, isGenerating]);

  // Load from history via URL param
  useEffect(() => {
    const loadId = searchParams.get("load");
    if (loadId && history.length > 0) {
      const item = history.find(h => h.id === loadId);
      if (item) {
        handleLoadHistory(item);
        // Clear the URL param after loading
        setSearchParams({}, { replace: true });
      }
    }
  }, [searchParams, history]);

  const handleDocToggle = (docId: string) => {
    setSelectedDocIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleContentChange = (value: string) => {
    setEditableContent(value);
    setHasUnsavedChanges(true);
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
        content_type: "blog",
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
    await navigator.clipboard.writeText(editableContent || generatedContent);
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
    setEditableContent("");
    setIsEditMode(false);
    setShowRefineButton(false);
    setSelectedText("");
    setSelectionRange(null);
    setLoadedHistoryId(null);
    setHasUnsavedChanges(false);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportTxt = () => {
    const contentToExport = editableContent || generatedContent;
    const plainText = contentToExport
      .replace(/^#+\s*/gm, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    const slug = topic.toLowerCase().replace(/\s+/g, "-").slice(0, 30);
    downloadFile(plainText, `${slug}.txt`, "text/plain");
    toast({ title: t("aiStudio.exported", "Exported as TXT") });
  };

  const handleExportMd = () => {
    const contentToExport = editableContent || generatedContent;
    const slug = topic.toLowerCase().replace(/\s+/g, "-").slice(0, 30);
    downloadFile(contentToExport, `${slug}.md`, "text/markdown");
    toast({ title: t("aiStudio.exported", "Exported as Markdown") });
  };

  // History handlers
  const handleLoadHistory = (item: GenerationHistoryItem) => {
    setTopic(item.topic);
    setEditableContent(item.generated_content);
    setLoadedHistoryId(item.id);
    setHasUnsavedChanges(false);
    setIsEditMode(true);
    toast({ title: t("aiStudio.loadedFromHistory", "Loaded from history") });
  };

  const handleSaveToHistory = async () => {
    if (!topic.trim() || !editableContent) return;

    setIsSaving(true);
    try {
      const id = await saveGeneration({
        content_type: "blog",
        topic: topic.trim(),
        generated_content: editableContent,
        additional_instructions: additionalInstructions || undefined,
        selected_document_ids: selectedDocIds,
      });

      if (id) {
        setLoadedHistoryId(id);
        setHasUnsavedChanges(false);
        toast({ title: t("aiStudio.savedToHistory", "Saved to history") });
      }
    } catch (err) {
      toast({
        title: t("aiStudio.saveFailed", "Failed to save"),
        description: err instanceof Error ? err.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateHistory = async () => {
    if (!loadedHistoryId || !editableContent) return;

    setIsSaving(true);
    try {
      await updateGeneration(loadedHistoryId, editableContent);
      setHasUnsavedChanges(false);
      toast({ title: t("aiStudio.changesSaved", "Changes saved") });
    } catch {
      toast({
        title: t("aiStudio.updateFailed", "Failed to update"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteHistory = async (id: string) => {
    if (id === loadedHistoryId) {
      setLoadedHistoryId(null);
      setEditableContent("");
      setTopic("");
      setHasUnsavedChanges(false);
    }

    try {
      await deleteGeneration(id);
      toast({ title: t("aiStudio.deletedFromHistory", "Deleted from history") });
    } catch {
      toast({ title: t("aiStudio.deleteFailed", "Failed to delete"), variant: "destructive" });
    }
  };

  // Selection handling for refine feature
  const handleTextSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);

    if (selected.trim().length > 10) {
      setSelectedText(selected);
      setSelectionRange({ start, end });
      setShowRefineButton(true);
    } else {
      setShowRefineButton(false);
      setSelectedText("");
      setSelectionRange(null);
    }
  };

  const handleRefine = async () => {
    if (!selectedText || !selectionRange || !refineInstruction.trim()) return;

    setIsRefining(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/refine-content`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            selected_text: selectedText,
            instruction: refineInstruction.trim(),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Refinement failed");
      }

      const { refined_text } = await response.json();
      
      // Show diff view instead of auto-replacing
      setRefinedText(refined_text);
      setShowDiffView(true);

    } catch (err) {
      toast({
        title: t("aiStudio.refineFailed", "Refinement failed"),
        description: err instanceof Error ? err.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsRefining(false);
    }
  };

  const handleAcceptRefinement = () => {
    if (!refinedText || !selectionRange) return;
    
    // Replace selection with refined text
    const before = editableContent.slice(0, selectionRange.start);
    const after = editableContent.slice(selectionRange.end);
    setEditableContent(before + refinedText + after);
    setHasUnsavedChanges(true);

    toast({
      title: t("aiStudio.refined", "Text refined"),
      description: t("aiStudio.refinedDesc", "The selected text has been updated"),
    });

    // Reset refine state
    handleCloseRefineDialog();
  };

  const handleRejectRefinement = () => {
    // Go back to instruction view to try again
    setRefinedText(null);
    setShowDiffView(false);
  };

  const handleCloseRefineDialog = () => {
    setRefineDialogOpen(false);
    setRefineInstruction("");
    setSelectedText("");
    setSelectionRange(null);
    setShowRefineButton(false);
    setRefinedText(null);
    setShowDiffView(false);
  };

  const setQuickRefineAction = (action: string) => {
    setRefineInstruction(action);
  };

  const isLoading = docsLoading || styleLoading;
  const hasContent = editableContent || generatedContent;

  // Expose handlers for sidebar
  (window as any).__aiStudioBlogHandlers = {
    onLoadHistory: handleLoadHistory,
    onDeleteHistory: handleDeleteHistory,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <FileEdit className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t("aiStudio.blogTitle", "Blog Generator")}</h1>
          <p className="text-muted-foreground">
            {t("aiStudio.blogSubtitle", "Generate blog posts and articles from your knowledge base")}
          </p>
        </div>
      </div>

      {/* Setup Warning */}
      {!isLoading && !hasCompletedSetup && (
        <Alert className="flex items-start gap-3 border-primary/50 bg-primary/5">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
          <div className="flex-1">
            <AlertDescription>
              {t("aiStudio.setupRequired", "Complete your Style Profile to get personalized content.")}
            </AlertDescription>
            <Link to="/ai-studio">
              <Button variant="link" className="h-auto p-0 mt-1 text-primary">
                {t("aiStudio.goToSetup", "Configure Style Profile →")}
              </Button>
            </Link>
          </div>
        </Alert>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Configuration */}
        <div className="space-y-6">
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
                <EmptyState
                  icon={FileText}
                  title={t("aiStudio.noDocuments", "No documents in your knowledge base yet.")}
                  description={t("aiStudio.noDocumentsDescription", "Agrega documentos a tu base de conocimiento para usarlos como contexto en la generación de contenido.")}
                  action={{
                    label: t("aiStudio.addDocuments", "Add Documents"),
                    onClick: () => navigate("/ai-studio")
                  }}
                />
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
            {hasContent && (
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
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-lg">{t("aiStudio.output", "Generated Content")}</CardTitle>
                {hasContent && (
                  <Badge variant="secondary" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {loadedHistoryId ? t("aiStudio.saved", "Saved") : t("aiStudio.aiDraft", "AI Draft")}
                  </Badge>
                )}
                {hasUnsavedChanges && loadedHistoryId && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    {t("aiStudio.unsaved", "Unsaved")}
                  </Badge>
                )}
              </div>
              <CardDescription>
                {hasContent
                  ? t("aiStudio.outputReady", "Your content is ready to copy")
                  : t("aiStudio.outputEmpty", "Content will appear here")}
              </CardDescription>
            </div>
            {hasContent && (
              <div className="flex gap-2 flex-wrap">
                {/* Save/Update Button */}
                {loadedHistoryId ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUpdateHistory}
                    disabled={!hasUnsavedChanges || isSaving}
                  >
                    {isSaving ? (
                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-1" />
                    )}
                    {t("aiStudio.update", "Update")}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveToHistory}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-1" />
                    )}
                    {t("aiStudio.saveToHistory", "Save")}
                  </Button>
                )}
                {/* Edit/Preview Toggle */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setIsEditMode(!isEditMode);
                    setShowRefineButton(false);
                    setSelectedText("");
                    setSelectionRange(null);
                  }}
                >
                  {isEditMode ? (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      {t("aiStudio.preview", "Preview")}
                    </>
                  ) : (
                    <>
                      <Pencil className="h-4 w-4 mr-1" />
                      {t("aiStudio.edit", "Edit")}
                    </>
                  )}
                </Button>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      {t("aiStudio.export", "Export")}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleExportTxt}>
                      <FileText className="h-4 w-4 mr-2" />
                      {t("aiStudio.exportTxt", "Plain Text (.txt)")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportMd}>
                      <FileCode className="h-4 w-4 mr-2" />
                      {t("aiStudio.exportMd", "Markdown (.md)")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
              ) : hasContent ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative"
                >
                  {/* Floating Refine Button */}
                  {showRefineButton && isEditMode && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-2 left-1/2 -translate-x-1/2 z-10"
                    >
                      <Button
                        size="sm"
                        onClick={() => setRefineDialogOpen(true)}
                        className="shadow-lg"
                      >
                        <Wand2 className="h-4 w-4 mr-1" />
                        {t("aiStudio.refineWithAI", "Refine with AI")}
                      </Button>
                    </motion.div>
                  )}

                  {isEditMode ? (
                    <Textarea
                      ref={textareaRef}
                      value={editableContent}
                      onChange={(e) => handleContentChange(e.target.value)}
                      onMouseUp={handleTextSelection}
                      onKeyUp={handleTextSelection}
                      className="h-[500px] font-mono text-sm resize-none"
                      placeholder="Edit your content here..."
                    />
                  ) : (
                    <ScrollArea className="h-[500px]">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{editableContent || generatedContent}</ReactMarkdown>
                      </div>
                    </ScrollArea>
                  )}
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

      {/* Refine Dialog */}
      <Dialog open={refineDialogOpen} onOpenChange={(open) => !open && handleCloseRefineDialog()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {showDiffView 
                ? t("aiStudio.reviewChanges", "Review Changes")
                : t("aiStudio.refineTitle", "Refine Selection")
              }
            </DialogTitle>
            <DialogDescription>
              {showDiffView
                ? t("aiStudio.reviewChangesDesc", "Compare the original and refined text, then accept or reject the changes")
                : t("aiStudio.refineDesc", "Tell the AI how to improve the selected text")
              }
            </DialogDescription>
          </DialogHeader>

          {showDiffView && refinedText ? (
            // Diff View
            <div className="space-y-4">
              <div className="grid gap-4">
                {/* Original text */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-destructive/50"></span>
                    {t("aiStudio.original", "Original")}
                  </Label>
                  <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-md text-sm max-h-40 overflow-auto">
                    <p className="whitespace-pre-wrap">{selectedText}</p>
                  </div>
                </div>

                {/* Refined text */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                    {t("aiStudio.refined", "Refined")}
                  </Label>
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded-md text-sm max-h-40 overflow-auto">
                    <p className="whitespace-pre-wrap">{refinedText}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Instruction View
            <div className="space-y-4">
              {/* Selected text preview */}
              <div className="p-3 bg-muted rounded-md text-sm max-h-32 overflow-auto">
                <p className="text-muted-foreground text-xs mb-1">
                  {t("aiStudio.selectedText", "Selected text:")}
                </p>
                <p className="italic">
                  "{selectedText.length > 200 ? selectedText.slice(0, 200) + "..." : selectedText}"
                </p>
              </div>

              {/* Quick actions */}
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setQuickRefineAction("Make it more concise and shorter")}
                >
                  {t("aiStudio.shorten", "Shorten")}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setQuickRefineAction("Make it more detailed and expand on the ideas")}
                >
                  {t("aiStudio.expand", "Expand")}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setQuickRefineAction("Use simpler language and make it easier to understand")}
                >
                  {t("aiStudio.simplify", "Simplify")}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setQuickRefineAction("Make it more formal and professional")}
                >
                  {t("aiStudio.formalize", "Formalize")}
                </Button>
              </div>

              {/* Custom instruction */}
              <Textarea
                placeholder={t("aiStudio.customInstruction", "Or type custom instructions...")}
                value={refineInstruction}
                onChange={(e) => setRefineInstruction(e.target.value)}
                rows={2}
              />
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            {showDiffView ? (
              <>
                <Button variant="outline" onClick={handleRejectRefinement}>
                  {t("aiStudio.tryAgain", "Try Again")}
                </Button>
                <Button onClick={handleAcceptRefinement}>
                  <Check className="h-4 w-4 mr-1" />
                  {t("aiStudio.acceptChanges", "Accept Changes")}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleCloseRefineDialog}>
                  {t("common.cancel", "Cancel")}
                </Button>
                <Button onClick={handleRefine} disabled={isRefining || !refineInstruction.trim()}>
                  {isRefining ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                      {t("aiStudio.refining", "Refining...")}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-1" />
                      {t("aiStudio.refine", "Refine")}
                    </>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
