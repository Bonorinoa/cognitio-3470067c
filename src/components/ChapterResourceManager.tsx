import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
  FolderOpen
} from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorUtils";

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
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<ChapterResource | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [resourceType, setResourceType] = useState("link");
  const [url, setUrl] = useState("");

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
      toast.success("Resource added");
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
      toast.success("Resource updated");
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
      toast.success("Resource deleted");
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
  };

  const handleOpenDialog = (resource?: ChapterResource) => {
    if (resource) {
      setEditingResource(resource);
      setTitle(resource.title);
      setDescription(resource.description || "");
      setResourceType(resource.resource_type);
      setUrl(resource.url);
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!title.trim() || !url.trim()) {
      toast.error("Title and URL are required");
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
        Save chapter to add resources
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
                  className="flex items-center gap-2 p-2 rounded border border-border bg-background/50 text-sm group"
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
                  <span className="flex-1 truncate">{resource.title}</span>
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

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full h-8 text-xs"
                  onClick={() => handleOpenDialog()}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Resource
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingResource ? "Edit Resource" : "Add Resource"}
                  </DialogTitle>
                  <DialogDescription>
                    Add supplementary materials for "{chapterTitle}"
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="resource-title">Title</Label>
                    <Input
                      id="resource-title"
                      placeholder="e.g., Lecture Slides"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resource-type">Type</Label>
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
                  <div className="space-y-2">
                    <Label htmlFor="resource-url">URL</Label>
                    <Input
                      id="resource-url"
                      placeholder="https://..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resource-description">Description (optional)</Label>
                    <Textarea
                      id="resource-description"
                      placeholder="Brief description of this resource"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={isMutating}>
                    {isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingResource ? "Save Changes" : "Add Resource"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
