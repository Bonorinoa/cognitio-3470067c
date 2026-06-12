import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useKnowledgeBase } from "@/hooks/useKnowledgeBase";
import { useContentGeneration } from "@/hooks/useContentGeneration";
import { useStyleProfile } from "@/hooks/useStyleProfile";
import { useGenerationHistory, GenerationHistoryItem } from "@/hooks/useGenerationHistory";
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
  const { history, saveGeneration, updateGeneration } = useGenerationHistory();
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
    toast.success(t("aiStudio.loadedFromHistory", "Borrador cargado"));
  }, [t]);

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
      toast.error(t("aiStudio.loginRequired", "Inicie sesión para usar el generador"));
      navigate("/auth");
      return;
    }
    if (!topic.trim()) {
      toast.error(t("aiStudio.topicRequired", "El tema es obligatorio"));
      return;
    }
    try {
      await generate({
        content_type: "blog",
        topic: topic.trim(),
        additional_instructions: additionalInstructions.trim() || undefined,
        selected_document_ids: selectedDocIds,
      });
      toast.success(t("aiStudio.generated", "Contenido generado"));
    } catch {
      toast.error(error || t("aiStudio.error", "Falló la generación"));
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editableContent || generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(t("aiStudio.copied", "Copiado al portapapeles"));
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
        toast.success(t("aiStudio.savedToHistory", "Guardado en borradores"));
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("aiStudio.saveFailed", "No se pudo guardar"));
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
      toast.success(t("aiStudio.changesSaved", "Cambios guardados"));
    } catch {
      toast.error(t("aiStudio.updateFailed", "No se pudo actualizar"));
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
    toast.success(t("aiStudio.refined", "Texto refinado"));
    refine.closeDialog();
  };

  const isLoading = docsLoading || styleLoading;
  const hasContent = Boolean(editableContent || generatedContent);

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Editorial header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-border">
        <div className="space-y-3">
          <div className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
            {t("aiStudio.blogEyebrow", "Blog · Divulgación")}
          </div>
          <h1 className="text-3xl md:text-4xl font-light text-foreground">
            {t("aiStudio.blogTitleLead", "Generador ")}
            <span className="italic font-serif">{t("aiStudio.blogTitleAccent", "editorial.")}</span>
          </h1>
          <p className="text-muted-foreground font-light max-w-xl">
            {t(
              "aiStudio.blogSubtitle",
              "Artículos desde su base de conocimiento, con su voz editorial."
            )}
          </p>
        </div>
        <Link
          to="/ai-studio/drafts"
          className="text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors font-semibold self-start md:self-end"
        >
          {t("aiStudio.viewAllDrafts", "Ver todos los borradores →")}
        </Link>
      </div>

      {/* Setup-required hairline strip */}
      {!isLoading && !hasCompletedSetup && (
        <div className="flex items-start gap-3 border border-primary/30 bg-primary/[0.03] rounded-sm px-5 py-4">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-light text-foreground">
              {t("aiStudio.setupRequired", "Complete su voz editorial para contenido personalizado.")}
            </p>
            <Link to="/ai-studio/settings">
              <Button variant="link" className="h-auto p-0 text-primary text-xs uppercase tracking-[0.15em] font-semibold">
                {t("aiStudio.goToSetup", "Configurar voz editorial")}
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
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
          onAddDocuments={() => navigate("/ai-studio/knowledge")}
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
  );
}
