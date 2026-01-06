import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Clock, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateThreadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { title: string; content: string; videoTimestamp?: number }) => Promise<void>;
  isSubmitting: boolean;
  currentVideoTime?: number;
}

export default function CreateThreadModal({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  currentVideoTime,
}: CreateThreadModalProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [includeTimestamp, setIncludeTimestamp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    await onSubmit({
      title: title.trim(),
      content: content.trim(),
      videoTimestamp: includeTimestamp && currentVideoTime ? Math.floor(currentVideoTime) : undefined,
    });

    // Reset form
    setTitle("");
    setContent("");
    setIncludeTimestamp(false);
  };

  const formatTimestamp = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("discussion.askQuestion")}</DialogTitle>
            <DialogDescription>
              {t("discussion.askQuestionDesc")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t("discussion.threadTitle")}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("discussion.titlePlaceholder")}
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">{t("discussion.threadContent")}</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t("discussion.contentPlaceholder")}
                rows={5}
              />
            </div>

            {currentVideoTime !== undefined && currentVideoTime > 0 && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="timestamp"
                  checked={includeTimestamp}
                  onCheckedChange={(checked) => setIncludeTimestamp(checked === true)}
                />
                <Label htmlFor="timestamp" className="flex items-center gap-2 cursor-pointer">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {t("discussion.linkTimestamp")} ({formatTimestamp(currentVideoTime)})
                </Label>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("discussion.posting")}
                </>
              ) : (
                t("discussion.post")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
