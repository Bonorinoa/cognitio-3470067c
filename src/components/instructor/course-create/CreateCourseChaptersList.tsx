import { useTranslation } from "react-i18next";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import VideoUpload from "@/components/VideoUpload";
import ChapterResourceManager from "@/components/ChapterResourceManager";

export interface NewChapter {
  id: string;
  title: string;
  videoUrl: string;
  isFreePreview: boolean;
  muxPlaybackId?: string;
  muxAssetId?: string;
  language?: "es" | "en";
}

interface CreateCourseChaptersListProps {
  chapters: NewChapter[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof NewChapter, value: string | boolean) => void;
  onVideoUploaded: (id: string, playbackId: string, assetId: string, language?: "es" | "en") => void;
}

export function CreateCourseChaptersList({
  chapters,
  onAdd,
  onRemove,
  onUpdate,
  onVideoUploaded,
}: CreateCourseChaptersListProps) {
  const { t } = useTranslation();

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">{t("createCourse.chapters")}</CardTitle>
            <CardDescription>{t("createCourse.chaptersDesc")}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" />
            {t("createCourse.addChapter")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {chapters.map((chapter, index) => (
          <div
            key={chapter.id}
            className="flex gap-3 p-4 rounded-lg border border-border bg-muted/30"
          >
            <div className="flex items-center">
              <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">
                  {t("createCourse.chapter")} {index + 1}
                </span>
                <div className="flex items-center gap-2 ml-auto">
                  <Label htmlFor={`preview-${chapter.id}`} className="text-sm text-muted-foreground">
                    {t("createCourse.freePreview")}
                  </Label>
                  <Switch
                    id={`preview-${chapter.id}`}
                    checked={chapter.isFreePreview}
                    onCheckedChange={(checked) =>
                      onUpdate(chapter.id, "isFreePreview", checked)
                    }
                  />
                </div>
              </div>
              <Input
                placeholder={t("createCourse.chapterTitlePlaceholder")}
                value={chapter.title}
                onChange={(e) => onUpdate(chapter.id, "title", e.target.value)}
                className="bg-background border-border"
              />
              <VideoUpload
                chapterId={chapter.id}
                currentPlaybackId={chapter.muxPlaybackId}
                onUploadComplete={(playbackId, assetId, language) =>
                  onVideoUploaded(chapter.id, playbackId, assetId, language)
                }
              />
              <ChapterResourceManager
                chapterId={chapter.id}
                chapterTitle={chapter.title || `${t("createCourse.chapter")} ${index + 1}`}
                isNewChapter={true}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(chapter.id)}
              disabled={chapters.length === 1}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
