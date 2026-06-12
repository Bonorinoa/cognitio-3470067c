import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useKnowledgeBase } from "@/hooks/useKnowledgeBase";
import { useAuth } from "@/contexts/AuthContext";
import { EmptyState } from "@/components/EmptyState";
import DocumentEditor from "@/components/ai-studio/DocumentEditor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Plus, 
  FileText, 
  Loader2, 
  Pencil, 
  Trash2, 
  Eye, 
  EyeOff,
  Database,
  BookOpen,
  Lightbulb,
  GraduationCap,
  FileQuestion,
  ScrollText,
  FileUser,
} from "lucide-react";
import { toast } from "sonner";
import { formatTokenCount, getBudgetDisplayInfo } from "@/lib/tokenUtils";
import { HelpPopover } from "@/components/ui/help-popover";
import type { KnowledgeBaseDocument, DocumentFormData, DocumentType, ContextRole } from "@/types/aiStudio";

// Icons for document types
const DOC_TYPE_ICONS: Record<DocumentType, React.ElementType> = {
  academic_paper: ScrollText,
  cv_bio: FileUser,
  methodology: Lightbulb,
  writing_sample: BookOpen,
  syllabus: GraduationCap,
  other: FileQuestion,
};

// Neutral hairline pill styles for context roles (coral accent dot)
const CONTEXT_ROLE_COLORS: Record<ContextRole, string> = {
  style_reference: "border-primary/40 text-foreground/70 bg-transparent",
  topic_source: "border-foreground/20 text-foreground/70 bg-transparent",
  background_context: "border-muted-foreground/30 text-muted-foreground bg-transparent",
};

export default function AIStudioKnowledge() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    documents,
    activeDocuments,
    totalTokens,
    isLoading,
    createDocument,
    updateDocument,
    toggleActive,
    deleteDocument,
    isCreating,
    isUpdating,
    isDeleting,
  } = useKnowledgeBase();

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<KnowledgeBaseDocument | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<KnowledgeBaseDocument | null>(null);

  const budgetInfo = getBudgetDisplayInfo(totalTokens);

  const handleAdd = () => {
    if (!user) {
      toast.error(t("aiStudio.loginRequired", "Login Required"));
      navigate("/auth");
      return;
    }
    setEditingDocument(null);
    setEditorOpen(true);
  };

  const handleEdit = (doc: KnowledgeBaseDocument) => {
    setEditingDocument(doc);
    setEditorOpen(true);
  };

  const handleSave = async (formData: DocumentFormData) => {
    if (editingDocument) {
      await updateDocument({ id: editingDocument.id, formData });
      toast.success(t("knowledgeBase.updated"));
    } else {
      await createDocument(formData);
      toast.success(t("knowledgeBase.created"));
    }
  };

  const handleToggleActive = async (doc: KnowledgeBaseDocument) => {
    await toggleActive({ id: doc.id, isActive: !doc.is_active });
    toast.success(doc.is_active ? t("knowledgeBase.deactivated") : t("knowledgeBase.activated"));
  };

  const handleDeleteClick = (doc: KnowledgeBaseDocument) => {
    setDocumentToDelete(doc);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;
    await deleteDocument(documentToDelete.id);
    toast.success(t("knowledgeBase.deleted"));
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Database className="h-7 w-7 text-primary" />
            {t("knowledgeBase.title")}
          </h1>
          <p className="text-muted-foreground">{t("knowledgeBase.subtitle")}</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          {t("knowledgeBase.addDocument")}
        </Button>
      </div>

      {/* Token Budget Indicator */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{t("knowledgeBase.tokenBudget")}</span>
              <HelpPopover title={t("help.aiStudio.tokenBudgetTitle")}>
                <p>{t("help.aiStudio.tokenBudgetDesc")}</p>
              </HelpPopover>
            </div>
            <span className={`text-sm ${budgetInfo.statusColor}`}>
              {formatTokenCount(totalTokens)} / {formatTokenCount(budgetInfo.totalBudget)} tokens
            </span>
          </div>
          <Progress 
            value={budgetInfo.percentUsed} 
            className="h-2"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {t("knowledgeBase.budgetHint", { count: activeDocuments.length })}
          </p>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      {documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={t("knowledgeBase.noDocuments")}
          description={t("knowledgeBase.noDocumentsHint")}
          action={{
            label: t("knowledgeBase.addFirst"),
            onClick: handleAdd
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => {
            const Icon = DOC_TYPE_ICONS[doc.document_type] || FileText;
            return (
              <Card 
                key={doc.id} 
                className={`transition-opacity ${!doc.is_active ? "opacity-60" : ""}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                      <CardTitle className="text-base truncate">{doc.title}</CardTitle>
                    </div>
                    {!doc.is_active && (
                      <Badge variant="secondary" className="shrink-0">
                        {t("knowledgeBase.inactive")}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {t(`knowledgeBase.docTypes.${doc.document_type}`)}
                    </Badge>
                    <Badge className={`text-xs ${CONTEXT_ROLE_COLORS[doc.context_role]}`}>
                      {t(`knowledgeBase.contextRoles.${doc.context_role}`)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-2 mb-3 text-xs">
                    {doc.content.slice(0, 150)}...
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {formatTokenCount(doc.content_tokens)} tokens
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleToggleActive(doc)}
                        title={doc.is_active ? t("knowledgeBase.deactivate") : t("knowledgeBase.activate")}
                      >
                        {doc.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(doc)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClick(doc)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Document Editor Modal */}
      <DocumentEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        document={editingDocument}
        onSave={handleSave}
        isSaving={isCreating || isUpdating}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("knowledgeBase.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("knowledgeBase.deleteDesc", { title: documentToDelete?.title })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("knowledgeBase.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t("knowledgeBase.delete")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
