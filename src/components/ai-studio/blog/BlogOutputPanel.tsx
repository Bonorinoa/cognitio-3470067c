import { RefObject } from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle, Check, Copy, Download, Eye, FileCode, FileText, Pencil, RefreshCw, Save, Sparkles, Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
            {loadedHistoryId ? (
              <Button variant="outline" size="sm" onClick={onUpdate} disabled={!hasUnsavedChanges || isSaving}>
                {isSaving ? <RefreshCw className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                {t("aiStudio.update", "Update")}
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={onSave} disabled={isSaving}>
                {isSaving ? <RefreshCw className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                {t("aiStudio.saveToHistory", "Save")}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsEditMode(!isEditMode);
                onResetSelection();
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
            <Button variant="outline" size="sm" onClick={onCopy}>
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
                <DropdownMenuItem onClick={onExportTxt}>
                  <FileText className="h-4 w-4 mr-2" />
                  {t("aiStudio.exportTxt", "Plain Text (.txt)")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onExportMd}>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Alert variant="destructive" className="flex items-start gap-3">
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
                  <Button size="sm" onClick={onOpenRefine} className="shadow-lg">
                    <Wand2 className="h-4 w-4 mr-1" />
                    {t("aiStudio.refineWithAI", "Refine with AI")}
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
                  className="h-[500px] font-mono text-sm resize-none"
                  placeholder="Edit your content here..."
                />
              ) : (
                <ScrollArea className="h-[500px]">
                  <article className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p>{children}</p>,
                      }}
                    >
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
              <div className="text-center text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>{t("aiStudio.startPrompt", "Enter a topic and click Generate to create content")}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
