import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import ChapterResourceManager from "@/components/ChapterResourceManager";

const VideoUpload = lazy(() => import("@/components/VideoUpload"));
const VideoUploadFallback = () => <div className="h-10 w-full bg-muted rounded animate-pulse" />;

export interface ChapterDraft {
  id: string;
  title: string;
  videoUrl: string;
  isFreePreview: boolean;
  muxPlaybackId?: string;
  muxAssetId?: string;
  isNew?: boolean;
}

interface CourseChaptersEditorProps {
  chapters: ChapterDraft[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof ChapterDraft, value: string | boolean) => void;
  onVideoUploaded: (id: string, playbackId: string, assetId: string) => void;
}

export function CourseChaptersEditor({
  chapters,
  onAdd,
  onRemove,
  onUpdate,
  onVideoUploaded,
}: CourseChaptersEditorProps) {
  const { t } = useTranslation();

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <CardTitle className="text-foreground">Capítulos del Curso</CardTitle>
              <CardDescription>Gestioná el contenido de tu curso</CardDescription>
            </div>
            <HelpTooltip content={t("help.courseEditing.chaptersDesc")} />
          </div>
          <Button variant="outline" size="sm" onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Capítulo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {chapters.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Todavía no hay capítulos. Agregá el primero con el botón de arriba.
          </div>
        ) : (
          chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className="flex gap-3 p-4 rounded-lg border border-border bg-muted/30"
            >
              <div className="flex items-center">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                <HelpTooltip content={t("help.courseEditing.reorderDesc")} side="right" />
              </div>
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Capítulo {index + 1}
                  </span>
                  {chapter.isNew && (
                    <Badge variant="secondary" className="text-xs">
                      Nuevo
                    </Badge>
                  )}
                  <div className="flex items-center gap-2 ml-auto">
                    <Label htmlFor={`preview-${chapter.id}`} className="text-xs text-muted-foreground">
                      Vista Previa Gratis
                    </Label>
                    <HelpTooltip content={t("help.courseEditing.freePreviewDesc")} />
                    <Switch
                      id={`preview-${chapter.id}`}
                      checked={chapter.isFreePreview}
                      onCheckedChange={(checked) => onUpdate(chapter.id, "isFreePreview", checked)}
                    />
                  </div>
                </div>
                <Input
                  placeholder="Título del capítulo"
                  value={chapter.title}
                  onChange={(e) => onUpdate(chapter.id, "title", e.target.value)}
                  className="bg-background border-border"
                />
                <Suspense fallback={<VideoUploadFallback />}>
                  <VideoUpload
                    chapterId={chapter.id}
                    onUploadComplete={(playbackId, assetId) =>
                      onVideoUploaded(chapter.id, playbackId, assetId)
                    }
                    currentPlaybackId={chapter.muxPlaybackId}
                  />
                </Suspense>
                <ChapterResourceManager
                  chapterId={chapter.id}
                  chapterTitle={chapter.title || `Capítulo ${index + 1}`}
                  isNewChapter={chapter.isNew}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => onRemove(chapter.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
