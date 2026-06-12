import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { AlertCircle, FileEdit, History, Trash2, Zap } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useKnowledgeBase } from "@/hooks/useKnowledgeBase";
import { useContentGeneration } from "@/hooks/useContentGeneration";
import { useStyleProfile } from "@/hooks/useStyleProfile";
import { useGenerationHistory, GenerationHistoryItem, formatRelativeTime } from "@/hooks/useGenerationHistory";
import { useGenerationUsage } from "@/hooks/useGenerationUsage";
import { useAuth } from "@/contexts/AuthContext";
import { BlogConfigPanel } from "@/components/ai-studio/blog/BlogConfigPanel";
import { BlogOutputPanel } from "@/components/ai-studio/blog/BlogOutputPanel";
import { RefineDialog } from "@/components/ai-studio/blog/RefineDialog";
import { useRefine } from "@/components/ai-studio/blog/useRefine";
import { useBlogExports } from "@/components/ai-studio/blog/useBlogExports";

export default function AIStudioBlog() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { activeDocuments, isLoading: docsLoading } = useKnowledgeBase();
  const { isLoading: styleLoading, hasCompletedSetup } = useStyleProfile();
  const { generate, reset, isGenerating, generatedContent, error } = useContentGeneration();
  const { history, isLoading: historyLoading, saveGeneration, updateGeneration, deleteGeneration } = useGenerationHistory();
  const { remaining, limit, isLoading: usageLoading } = useGenerationUsage();
  const refine = useRefine();

  const [topic, setTopic] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editableContent, setEditableContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [loadedHistoryId, setLoadedHistoryId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { exportTxt, exportMd } = useBlogExports(
    () => editableContent || generatedContent,
    () => topic
  );

  const handleLoadHistory = useCallback((item: GenerationHistoryItem) => {
    setTopic(item.topic);
    setEditableContent(item.generated_content);
    setLoadedHistoryId(item.id);
    setHasUnsavedChanges(false);
    setIsEditMode(true);
    toast.success(t("aiStudio.loadedFromHistory", "Loaded from history"));
  }, [t]);

  const handleDeleteHistory = useCallback(async (id: string) => {
    if (id === loadedHistoryId) {
      setLoadedHistoryId(null);
      setEditableContent("");
      setTopic("");
      setHasUnsavedChanges(false);
    }
    try {
      await deleteGeneration(id);
      toast.success(t("aiStudio.deletedFromHistory", "Deleted from history"));
    } catch {
      toast.error(t("aiStudio.deleteFailed", "Failed to delete"));
    }
  }, [loadedHistoryId, deleteGeneration, t]);

  // History handlers are wired directly into the in-page panel below — no context shuttling needed.

  useEffect(() => {
    if (generatedContent && !isGenerating) {
      setEditableContent(generatedContent);
      setLoadedHistoryId(null);
      setHasUnsavedChanges(false);
    }
  }, [generatedContent, isGenerating]);

  useEffect(() => {
    const loadId = searchParams.get("load");
    if (loadId && history.length > 0) {
      const item = history.find((h) => h.id === loadId);
      if (item) {
        handleLoadHistory(item);
        setSearchParams({}, { replace: true });
      }
    }
  }, [searchParams, history, handleLoadHistory, setSearchParams]);

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
    if (!user) {
      toast.error(t("aiStudio.loginRequired", "Please log in to use AI generation features"));
      navigate("/auth");
      return;
    }
    if (!topic.trim()) {
      toast.error(t("aiStudio.topicRequired", "Topic required"));
      return;
    }
    try {
      await generate({
        content_type: "blog",
        topic: topic.trim(),
        additional_instructions: additionalInstructions.trim() || undefined,
        selected_document_ids: selectedDocIds,
      });
      toast.success(t("aiStudio.generated", "Content generated"));
    } catch {
      toast.error(error || t("aiStudio.error", "Generation failed"));
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editableContent || generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(t("aiStudio.copied", "Copied to clipboard"));
  };

  const handleReset = () => {
    reset();
    setTopic("");
    setAdditionalInstructions("");
    setSelectedDocIds([]);
    setEditableContent("");
    setIsEditMode(false);
    refine.resetSelection();
    setLoadedHistoryId(null);
    setHasUnsavedChanges(false);
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
        toast.success(t("aiStudio.savedToHistory", "Saved to history"));
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("aiStudio.saveFailed", "Failed to save"));
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
      toast.success(t("aiStudio.changesSaved", "Changes saved"));
    } catch {
      toast.error(t("aiStudio.updateFailed", "Failed to update"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAcceptRefinement = () => {
    if (!refine.refinedText || !refine.selectionRange) return;
    const before = editableContent.slice(0, refine.selectionRange.start);
    const after = editableContent.slice(refine.selectionRange.end);
    setEditableContent(before + refine.refinedText + after);
    setHasUnsavedChanges(true);
    toast.success(t("aiStudio.refined", "Text refined"));
    refine.closeDialog();
  };

  const isLoading = docsLoading || styleLoading;
  const hasContent = Boolean(editableContent || generatedContent);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
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

        {/* Usage chip */}
        <div className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2">
          <Zap className="h-4 w-4 text-primary" />
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t("aiStudioNav.generationsLeft", "Generaciones restantes")}
            </span>
            <span className="text-sm font-medium text-foreground">
              {usageLoading ? "…" : `${remaining} / ${limit}`}
            </span>
          </div>
          {!usageLoading && (
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.max(0, Math.min(100, (remaining / limit) * 100))}%` }}
              />
            </div>
          )}
        </div>
      </div>

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
        <BlogConfigPanel
          topic={topic}
          setTopic={setTopic}
          additionalInstructions={additionalInstructions}
          setAdditionalInstructions={setAdditionalInstructions}
          selectedDocIds={selectedDocIds}
          onToggleDoc={handleDocToggle}
          activeDocuments={activeDocuments}
          isGenerating={isGenerating}
          hasContent={hasContent}
          onGenerate={handleGenerate}
          onReset={handleReset}
          onAddDocuments={() => navigate("/ai-studio")}
        />

        <BlogOutputPanel
          textareaRef={textareaRef}
          editableContent={editableContent}
          generatedContent={generatedContent}
          error={error}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          hasContent={hasContent}
          hasUnsavedChanges={hasUnsavedChanges}
          loadedHistoryId={loadedHistoryId}
          copied={copied}
          isSaving={isSaving}
          showRefineButton={refine.showRefineButton}
          onContentChange={handleContentChange}
          onSelectionChange={() => refine.captureSelection(textareaRef.current)}
          onCopy={handleCopy}
          onSave={handleSaveToHistory}
          onUpdate={handleUpdateHistory}
          onExportTxt={exportTxt}
          onExportMd={exportMd}
          onOpenRefine={() => refine.setRefineDialogOpen(true)}
          onResetSelection={refine.resetSelection}
        />
      </div>

      <RefineDialog
        open={refine.refineDialogOpen}
        onOpenChange={(open) => !open && refine.closeDialog()}
        selectedText={refine.selectedText}
        refineInstruction={refine.refineInstruction}
        setRefineInstruction={refine.setRefineInstruction}
        isRefining={refine.isRefining}
        refinedText={refine.refinedText}
        showDiffView={refine.showDiffView}
        onRefine={refine.runRefine}
        onAccept={handleAcceptRefinement}
        onReject={refine.rejectRefinement}
      />
      </div>

      {/* In-page generation history */}
      <Collapsible defaultOpen={history.length > 0}>
        <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-xl border border-border bg-card px-5 py-3 text-sm transition-colors hover:bg-muted/50">
          <span className="flex items-center gap-2 font-medium text-foreground">
            <History className="h-4 w-4 text-primary" />
            {t("aiStudioNav.recent", "Generaciones recientes")} ({history.length})
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          {historyLoading ? (
            <p className="px-5 py-4 text-sm text-muted-foreground">{t("common.loading", "Cargando…")}</p>
          ) : history.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border px-5 py-6 text-center text-sm text-muted-foreground">
              {t("aiStudioNav.noHistory", "Aún no hay generaciones guardadas. Guarda un borrador para verlo aquí.")}
            </p>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="group flex items-start justify-between gap-2 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/40"
                >
                  <button
                    type="button"
                    onClick={() => handleLoadHistory(item)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="block truncate text-sm font-medium text-foreground">
                      {item.topic}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(item.created_at)}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteHistory(item.id)}
                    className="rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                    aria-label={t("common.delete", "Eliminar")}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
