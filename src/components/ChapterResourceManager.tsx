import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  Plus, 
  FileText, 
  Link as LinkIcon, 
  Code, 
  Video, 
  File, 
  Trash2, 
  GripVertical, 
  ChevronDown, 
  Pencil,
  Loader2,
  FolderOpen,
  Upload
} from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorUtils";
import { TruncatedText } from "@/components/ui/truncated-text";

interface ChapterResourceManagerProps {
  chapterId: string;
  chapterTitle: string;
  isNewChapter?: boolean;
}

interface ChapterResource {
  id: string;
  chapter_id: string;
  title: string;
  description: string | null;
  resource_type: string;
  url: string;
  order_index: number;
  created_at: string;
}

const resourceTypes = [
  { value: "pdf", label: "PDF", icon: FileText },
  { value: "link", label: "Link", icon: LinkIcon },
  { value: "notebook", label: "Notebook", icon: Code },
  { value: "video", label: "Video", icon: Video },
  { value: "other", label: "Other", icon: File },
];

const resourceIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  link: LinkIcon,
  notebook: Code,
  video: Video,
  other: File,
};

export default function ChapterResourceManager({ 
  chapterId, 
  chapterTitle,
  isNewChapter = false 
}: ChapterResourceManagerProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<ChapterResource | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [resourceType, setResourceType] = useState("link");
  const [url, setUrl] = useState("");
  const [isUploadedFile, setIsUploadedFile] = useState(false);

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["chapter-resources", chapterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapter_resources")
        .select("*")
        .eq("chapter_id", chapterId)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as ChapterResource[];
    },
    enabled: !!chapterId && !isNewChapter,
  });

  const addResourceMutation = useMutation({
    mutationFn: async (newResource: { 
      title: string; 
      description: string | null; 
      resource_type: string; 
      url: string;
      order_index: number;
    }) => {
      const { data, error } = await supabase
        .from("chapter_resources")
        .insert({
          chapter_id: chapterId,
          ...newResource,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapter-resources", chapterId] });
      toast.success(t("resources.resourceAdded"));
      resetForm();
      setDialogOpen(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const updateResourceMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { 
      id: string;
      title: string; 
      description: string | null; 
      resource_type: string; 
      url: string;
    }) => {
      const { data, error } = await supabase
        .from("chapter_resources")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapter-resources", chapterId] });
      toast.success(t("resources.resourceUpdated"));
      resetForm();
      setDialogOpen(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const deleteResourceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("chapter_resources")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapter-resources", chapterId] });
      toast.success(t("resources.resourceDeleted"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ id, newIndex }: { id: string; newIndex: number }) => {
      const { error } = await supabase
        .from("chapter_resources")
        .update({ order_index: newIndex })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapter-resources", chapterId] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setResourceType("link");
    setUrl("");
    setEditingResource(null);
    setIsUploadedFile(false);
  };

  const handleOpenDialog = (resource?: ChapterResource) => {
    if (resource) {
      setEditingResource(resource);
      setTitle(resource.title);
      setDescription(resource.description || "");
      setResourceType(resource.resource_type);
      setUrl(resource.url);
      // Detect if it's an uploaded file by checking if URL contains storage domain
      const isStorageUrl = resource.url.includes('supabase.co/storage');
      setIsUploadedFile(isStorageUrl);
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast.error(t("resources.fileSizeError"));
      return;
    }

    setIsUploading(true);
    try {
      // Generate unique file path
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${chapterId}/${Date.now()}.${fileExt}`;

      // Upload to resources bucket
      const { error: uploadError } = await supabase.storage
        .from("resources")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("resources")
        .getPublicUrl(fileName);

      // Auto-detect resource type
      let detectedType = "other";
      if (fileExt?.toLowerCase() === "pdf") detectedType = "pdf";
      else if (["ipynb", "py", "js", "ts"].includes(fileExt?.toLowerCase() || "")) detectedType = "notebook";
      else if (["mp4", "webm", "mov"].includes(fileExt?.toLowerCase() || "")) detectedType = "video";

      // Pre-fill form with uploaded file info
      setTitle(file.name.replace(/\.[^/.]+$/, "")); // Remove extension for title
      setUrl(urlData.publicUrl);
      setResourceType(detectedType);
      setIsUploadedFile(true);
      setDialogOpen(true);
      
      toast.success(t("resources.fileUploaded"));
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !url.trim()) {
      toast.error(t("resources.titleUrlRequired"));
      return;
    }

    const resourceData = {
      title: title.trim(),
      description: description.trim() || null,
      resource_type: resourceType,
      url: url.trim(),
    };

    if (editingResource) {
      updateResourceMutation.mutate({ id: editingResource.id, ...resourceData });
    } else {
      addResourceMutation.mutate({ 
        ...resourceData, 
        order_index: resources.length 
      });
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const resource = resources[index];
    const prevResource = resources[index - 1];
    
    // Swap order indices
    reorderMutation.mutate({ id: resource.id, newIndex: prevResource.order_index });
    reorderMutation.mutate({ id: prevResource.id, newIndex: resource.order_index });
  };

  const handleMoveDown = (index: number) => {
    if (index === resources.length - 1) return;
    const resource = resources[index];
    const nextResource = resources[index + 1];
    
    // Swap order indices
    reorderMutation.mutate({ id: resource.id, newIndex: nextResource.order_index });
    reorderMutation.mutate({ id: nextResource.id, newIndex: resource.order_index });
  };

  const isMutating = addResourceMutation.isPending || updateResourceMutation.isPending;

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
        <Button variant="ghost" size="sm" className="w-full justify-between h-8 px-2 text-muted-foreground hover:text-foreground">
          <span className="flex items-center gap-2">
            <FolderOpen className="h-3.5 w-3.5" />
            <span className="text-xs">Resources ({resources.length})</span>
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
            {resources.map((resource, index) => {
              const Icon = resourceIcons[resource.resource_type] || File;
              return (
                <div
                  key={resource.id}
                  className="flex items-center gap-2 p-2 rounded border border-border bg-background/50 text-sm group min-w-0 overflow-hidden"
                >
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <GripVertical className="h-3 w-3 rotate-90" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === resources.length - 1}
                      className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <GripVertical className="h-3 w-3 rotate-90" />
                    </button>
                  </div>
                  <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                  <TruncatedText className="flex-1 text-sm">{resource.title}</TruncatedText>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleOpenDialog(resource)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:bg-destructive/10"
                      onClick={() => deleteResourceMutation.mutate(resource.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.ipynb,.py,.js,.ts,.txt,.md,.mp4,.webm,.mov"
              onChange={handleFileUpload}
            />

            {/* Action buttons */}
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
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-8 text-xs"
                    onClick={() => handleOpenDialog()}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {t("resources.addLink")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingResource ? t("resources.editResource") : t("resources.addResource")}
                    </DialogTitle>
                    <DialogDescription>
                      {t("resources.addMaterials")} "{chapterTitle}"
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="resource-title">{t("resources.title")}</Label>
                      <Input
                        id="resource-title"
                        placeholder={t("resources.titlePlaceholder")}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resource-type">{t("resources.type")}</Label>
                      <Select value={resourceType} onValueChange={setResourceType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {resourceTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <span className="flex items-center gap-2">
                                <type.icon className="h-4 w-4" />
                                {type.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {isUploadedFile ? (
                      <div className="space-y-2">
                        <Label>{t("resources.file")}</Label>
                        <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50 border text-sm text-muted-foreground">
                          <FileText className="h-4 w-4 text-primary" />
                          <span>{t("resources.fileUploadedSuccess")}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="resource-url">{t("resources.url")}</Label>
                        <Input
                          id="resource-url"
                          placeholder="https://..."
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="resource-description">{t("resources.description")}</Label>
                      <Textarea
                        id="resource-description"
                        placeholder={t("resources.descriptionPlaceholder")}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      {t("resources.cancel")}
                    </Button>
                    <Button onClick={handleSubmit} disabled={isMutating}>
                      {isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editingResource ? t("resources.save") : t("resources.addResource")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
