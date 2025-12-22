import * as React from "react";
import { Lock, PlayCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Chapter {
  id: string;
  title: string;
  duration: string;
  isPreview: boolean;
  isCompleted?: boolean;
  isLocked?: boolean;
}

interface ChapterListProps {
  chapters: Chapter[];
  currentChapterId?: string;
  onSelectChapter: (chapterId: string) => void;
  hasAccess: boolean;
}

const ChapterList = React.forwardRef<HTMLDivElement, ChapterListProps>(
  ({ chapters, currentChapterId, onSelectChapter, hasAccess }, ref) => {
    return (
      <div ref={ref} className="space-y-2">
        {chapters.map((chapter, index) => {
          const isAccessible = hasAccess || chapter.isPreview;
          const isCurrent = chapter.id === currentChapterId;

          return (
            <button
              key={chapter.id}
              onClick={() => isAccessible && onSelectChapter(chapter.id)}
              disabled={!isAccessible}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all",
                isCurrent
                  ? "border-primary bg-primary/10"
                  : isAccessible
                  ? "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
                  : "border-border bg-muted/30 cursor-not-allowed opacity-60"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                  chapter.isCompleted
                    ? "bg-accent text-accent-foreground"
                    : isCurrent
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {chapter.isCompleted ? (
                  <CheckCircle className="h-4 w-4" />
                ) : !isAccessible ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "font-medium truncate",
                    isCurrent ? "text-primary" : "text-foreground"
                  )}
                >
                  {chapter.title}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{chapter.duration}</span>
                  {chapter.isPreview && !hasAccess && (
                    <span className="text-accent">Free Preview</span>
                  )}
                </div>
              </div>
              {isAccessible && (
                <PlayCircle
                  className={cn(
                    "h-5 w-5",
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    );
  }
);
ChapterList.displayName = "ChapterList";

export default ChapterList;
