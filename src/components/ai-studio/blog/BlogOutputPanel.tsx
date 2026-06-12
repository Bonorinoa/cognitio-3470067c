import { RefObject } from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle, Check, Copy, Download, Eye, FileCode, FileText, Pencil, RefreshCw, Save, Sparkles, Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface BlogOutputPanelProps {
  textareaRef: RefObject<HTMLTextAreaElement>;
  editableContent: string;
  generatedContent: string;
  error: string | null;
  isEditMode: boolean;
  setIsEditMode: (v: boolean) => void;
  hasContent: boolean;
  hasUnsavedChanges: boolean;
  loadedHistoryId: string | null;
  copied: boolean;
  isSaving: boolean;
  showRefineButton: boolean;
  onContentChange: (v: string) => void;
  onSelectionChange: () => void;
  onCopy: () => void;
  onSave: () => void;
  onUpdate: () => void;
  onExportTxt: () => void;
  onExportMd: () => void;
  onOpenRefine: () => void;
  onResetSelection: () => void;
}

export function BlogOutputPanel({
  textareaRef,
  editableContent,
  generatedContent,
  error,
  isEditMode,
  setIsEditMode,
  hasContent,
  hasUnsavedChanges,
  loadedHistoryId,
  copied,
  isSaving,
  showRefineButton,
  onContentChange,
  onSelectionChange,
  onCopy,
  onSave,
  onUpdate,
  onExportTxt,
  onExportMd,
  onOpenRefine,
  onResetSelection,
}: BlogOutputPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="lg:sticky lg:top-6 h-fit border border-border rounded-sm bg-card/30">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 p-6 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">
              {t("aiStudio.output", "Resultado")}
            </span>
            {hasContent && (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold">
                <Sparkles className="h-2.5 w-2.5" />
                {loadedHistoryId ? t("aiStudio.saved", "Guardado") : t("aiStudio.aiDraft", "Borrador IA")}
              </span>
            )}
            {hasUnsavedChanges && loadedHistoryId && (
              <span className="text-[10px] uppercase tracking-[0.15em] text-destructive font-semibold">
                {t("aiStudio.unsaved", "Sin guardar")}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-light">
            {hasContent
              ? t("aiStudio.outputReady", "Su contenido está listo para revisar.")
              : t("aiStudio.outputEmpty", "El contenido aparecerá aquí.")}
          </p>
        </div>
        {hasContent && (
          <div className="flex gap-1.5 flex-wrap">
            {loadedHistoryId ? (
              <Button variant="outline" size="sm" className="rounded-sm h-8" onClick={onUpdate} disabled={!hasUnsavedChanges || isSaving}>
                {isSaving ? <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Save className="h-3.5 w-3.5 mr-1" />}
                {t("aiStudio.update", "Actualizar")}
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="rounded-sm h-8" onClick={onSave} disabled={isSaving}>
                {isSaving ? <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Save className="h-3.5 w-3.5 mr-1" />}
                {t("aiStudio.saveToHistory", "Guardar")}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="rounded-sm h-8"
              onClick={() => {
                setIsEditMode(!isEditMode);
                onResetSelection();
              }}
            >
              {isEditMode ? (
                <><Eye className="h-3.5 w-3.5 mr-1" />{t("aiStudio.preview", "Vista")}</>
              ) : (
                <><Pencil className="h-3.5 w-3.5 mr-1" />{t("aiStudio.edit", "Editar")}</>
              )}
            </Button>
            <Button variant="outline" size="sm" className="rounded-sm h-8" onClick={onCopy}>
              {copied ? (
                <><Check className="h-3.5 w-3.5 mr-1" />{t("aiStudio.copied", "Copiado")}</>
              ) : (
                <><Copy className="h-3.5 w-3.5 mr-1" />{t("aiStudio.copy", "Copiar")}</>
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-sm h-8">
                  <Download className="h-3.5 w-3.5 mr-1" />
                  {t("aiStudio.export", "Exportar")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onExportTxt}>
                  <FileText className="h-4 w-4 mr-2" />
                  {t("aiStudio.exportTxt", "Texto plano (.txt)")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onExportMd}>
                  <FileCode className="h-4 w-4 mr-2" />
                  {t("aiStudio.exportMd", "Markdown (.md)")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Alert variant="destructive" className="flex items-start gap-3 rounded-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          ) : hasContent ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
              {showRefineButton && isEditMode && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-2 left-1/2 -translate-x-1/2 z-10"
                >
                  <Button size="sm" onClick={onOpenRefine} className="shadow-lg rounded-sm">
                    <Wand2 className="h-3.5 w-3.5 mr-1" />
                    {t("aiStudio.refineWithAI", "Refinar con IA")}
                  </Button>
                </motion.div>
              )}

              {isEditMode ? (
                <Textarea
                  ref={textareaRef}
                  value={editableContent}
                  onChange={(e) => onContentChange(e.target.value)}
                  onMouseUp={onSelectionChange}
                  onKeyUp={onSelectionChange}
                  className="h-[500px] font-mono text-sm resize-none rounded-sm border-border bg-transparent"
                  placeholder={t("aiStudio.editPlaceholder", "Edite su contenido aquí…")}
                />
              ) : (
                <ScrollArea className="h-[500px]">
                  <article className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown components={{ p: ({ children }) => <p>{children}</p> }}>
                      {editableContent || generatedContent}
                    </ReactMarkdown>
                  </article>
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
              <div className="text-center text-muted-foreground space-y-3">
                <Sparkles className="h-8 w-8 mx-auto opacity-30" strokeWidth={1.5} />
                <p className="font-light text-sm max-w-xs">
                  {t("aiStudio.startPrompt", "Ingrese un tema y haga clic en Generar para crear contenido.")}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
