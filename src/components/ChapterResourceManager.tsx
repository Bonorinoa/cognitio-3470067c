import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown, FolderOpen, Loader2, Plus, Upload,
} from "lucide-react";
import { toast } from "sonner";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { ChapterResource } from "@/components/chapters/resources/types";
import { useChapterResources } from "@/components/chapters/resources/useChapterResources";
import { useResourceUpload } from "@/components/chapters/resources/useResourceUpload";
import { ResourceList } from "@/components/chapters/resources/ResourceList";
import { ResourceFormDialog } from "@/components/chapters/resources/ResourceFormDialog";

interface ChapterResourceManagerProps {
  chapterId: string;
  chapterTitle: string;
  isNewChapter?: boolean;
}

export default function ChapterResourceManager({
  chapterId,
  chapterTitle,
  isNewChapter = false,
}: ChapterResourceManagerProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<ChapterResource | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [resourceType, setResourceType] = useState("link");
  const [url, setUrl] = useState("");
  const [isUploadedFile, setIsUploadedFile] = useState(false);

  const { resources, isLoading, addResource, updateResource, deleteResource, moveUp, moveDown } =
    useChapterResources(chapterId, !isNewChapter);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setResourceType("link");
    setUrl("");
    setEditingResource(null);
    setIsUploadedFile(false);
  };

  const { fileInputRef, isUploading, handleFileUpload } = useResourceUpload({
    chapterId,
    onUploaded: ({ title, url, resourceType }) => {
      setTitle(title);
      setUrl(url);
      setResourceType(resourceType);
      setIsUploadedFile(true);
      setDialogOpen(true);
    },
  });

  const openDialog = (resource?: ChapterResource) => {
    if (resource) {
      setEditingResource(resource);
      setTitle(resource.title);
      setDescription(resource.description || "");
      setResourceType(resource.resource_type);
      setUrl(resource.url);
      setIsUploadedFile(resource.url.includes("supabase.co/storage"));
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!title.trim() || !url.trim()) {
      toast.error(t("resources.titleUrlRequired"));
      return;
    }
    const data = {
      title: title.trim(),
      description: description.trim() || null,
      resource_type: resourceType,
      url: url.trim(),
    };
    if (editingResource) {
      updateResource.mutate(
        { id: editingResource.id, ...data },
        { onSuccess: () => { resetForm(); setDialogOpen(false); } }
      );
    } else {
      addResource.mutate(
        { ...data, order_index: resources.length },
        { onSuccess: () => { resetForm(); setDialogOpen(false); } }
      );
    }
  };

  const isMutating = addResource.isPending || updateResource.isPending;

  if (isNewChapter) {
    return (
      <div className="text-xs text-muted-foreground italic pl-1">
        {t("resources.saveChapterFirst")}
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between h-8 px-2 text-muted-foreground hover:text-foreground"
        >
          <span className="flex items-center gap-2">
            <FolderOpen className="h-3.5 w-3.5" />
            <span className="text-xs">Recursos ({resources.length})</span>
            <HelpTooltip content={t("guide.sections.resources.helpTooltip")} />
          </span>
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <ResourceList
              resources={resources}
              onEdit={openDialog}
              onDelete={(id) => deleteResource.mutate(id)}
              onMoveUp={moveUp}
              onMoveDown={moveDown}
            />

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.ipynb,.py,.js,.ts,.txt,.md,.mp4,.webm,.mov"
              onChange={handleFileUpload}
            />

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Upload className="h-3 w-3 mr-1" />
                )}
                {t("resources.uploadFile")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs"
                onClick={() => openDialog()}
              >
                <Plus className="h-3 w-3 mr-1" />
                {t("resources.addLink")}
              </Button>
            </div>

            <ResourceFormDialog
              open={dialogOpen}
              onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) resetForm();
              }}
              isEditing={!!editingResource}
              isMutating={isMutating}
              chapterTitle={chapterTitle}
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              resourceType={resourceType}
              setResourceType={setResourceType}
              url={url}
              setUrl={setUrl}
              isUploadedFile={isUploadedFile}
              onSubmit={handleSubmit}
            />
          </>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
