import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertCircle } from "lucide-react";
import { estimateTokens, formatTokenCount, TOKEN_LIMITS } from "@/lib/tokenUtils";
import type { 
  DocumentFormData, 
  DocumentType, 
  ContextRole,
  KnowledgeBaseDocument 
} from "@/types/aiStudio";
import { DOCUMENT_TYPE_OPTIONS, CONTEXT_ROLE_OPTIONS } from "@/types/aiStudio";

interface DocumentEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document?: KnowledgeBaseDocument | null;
  onSave: (data: DocumentFormData) => Promise<void>;
  isSaving: boolean;
}

const DEFAULT_FORM: DocumentFormData = {
  title: "",
  document_type: "other",
  context_role: "background_context",
  content: "",
  tags: [],
};

// Get default context role based on document type
function getDefaultContextRole(docType: DocumentType): ContextRole {
  const option = DOCUMENT_TYPE_OPTIONS.find(o => o.value === docType);
  return option?.defaultContextRole || "background_context";
}

export default function DocumentEditor({
  open,
  onOpenChange,
  document,
  onSave,
  isSaving,
}: DocumentEditorProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<DocumentFormData>(DEFAULT_FORM);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!document;
  const tokenCount = estimateTokens(formData.content);
  const isOverLimit = tokenCount > TOKEN_LIMITS.MAX_DOCUMENT_TOKENS;

  // Load document data when editing
  useEffect(() => {
    if (document) {
      setFormData({
        title: document.title,
        document_type: document.document_type,
        context_role: document.context_role,
        content: document.content,
        tags: document.tags,
      });
    } else {
      setFormData(DEFAULT_FORM);
    }
    setError(null);
  }, [document, open]);

  const handleDocumentTypeChange = (value: DocumentType) => {
    setFormData(prev => ({
      ...prev,
      document_type: value,
      // Auto-suggest context role based on document type
      context_role: isEditing ? prev.context_role : getDefaultContextRole(value),
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      setError(t("knowledgeBase.errorTitle"));
      return;
    }
    if (!formData.content.trim()) {
      setError(t("knowledgeBase.errorContent"));
      return;
    }
    if (isOverLimit) {
      setError(t("knowledgeBase.errorTokenLimit"));
      return;
    }

    setError(null);
    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (err) {
      setError(t("knowledgeBase.errorSave"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("knowledgeBase.editDocument") : t("knowledgeBase.addDocument")}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? t("knowledgeBase.editDesc") : t("knowledgeBase.addDesc")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="doc-title">{t("knowledgeBase.docTitle")}</Label>
            <Input
              id="doc-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder={t("knowledgeBase.docTitlePlaceholder")}
              maxLength={200}
            />
          </div>

          {/* Document Type & Context Role - side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("knowledgeBase.docType")}</Label>
              <Select
                value={formData.document_type}
                onValueChange={(v) => handleDocumentTypeChange(v as DocumentType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span>{t(`knowledgeBase.docTypes.${option.value}`)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {DOCUMENT_TYPE_OPTIONS.find(o => o.value === formData.document_type)?.description}
              </p>
            </div>

            <div className="space-y-2">
              <Label>{t("knowledgeBase.contextRole")}</Label>
              <Select
                value={formData.context_role}
                onValueChange={(v) => setFormData(prev => ({ ...prev, context_role: v as ContextRole }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTEXT_ROLE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {t(`knowledgeBase.contextRoles.${option.value}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {CONTEXT_ROLE_OPTIONS.find(o => o.value === formData.context_role)?.description}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="doc-content">{t("knowledgeBase.content")}</Label>
              <span className={`text-xs ${isOverLimit ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                {formatTokenCount(tokenCount)} / {formatTokenCount(TOKEN_LIMITS.MAX_DOCUMENT_TOKENS)} tokens
              </span>
            </div>
            <Textarea
              id="doc-content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder={t("knowledgeBase.contentPlaceholder")}
              rows={12}
              className="resize-none font-mono text-sm"
            />
            {isOverLimit && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {t("knowledgeBase.tokenWarning")}
              </p>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            {t("knowledgeBase.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving || isOverLimit}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("knowledgeBase.saving")}
              </>
            ) : isEditing ? (
              t("knowledgeBase.updateDocument")
            ) : (
              t("knowledgeBase.createDocument")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
