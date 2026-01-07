import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { Loader2, FileText, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TranscriptEntry {
  start: number;
  end: number;
  text: string;
}

interface TranscriptTabProps {
  chapterId: string;
  courseId: string;
  onSeekVideo?: (seconds: number) => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function TranscriptTab({ chapterId, courseId, onSeekVideo }: TranscriptTabProps) {
  const { t } = useTranslation();

  const { data: transcript, isLoading, error } = useQuery({
    queryKey: ["chapter-transcript", chapterId],
    queryFn: async () => {
      // First check if course allows transcripts
      const { data: course } = await supabase
        .from("courses")
        .select("show_transcript")
        .eq("id", courseId)
        .single();

      if (!course?.show_transcript) {
        return { disabled: true };
      }

      const { data, error } = await supabase
        .from("chapter_transcripts")
        .select("*")
        .eq("chapter_id", chapterId)
        .eq("status", "ready")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!chapterId && !!courseId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-8 w-8 text-destructive mb-2" />
        <p className="text-sm text-muted-foreground">{t("transcript.errorLoading")}</p>
      </div>
    );
  }

  if (transcript && "disabled" in transcript) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">{t("transcript.disabled")}</p>
      </div>
    );
  }

  // Type guard to ensure we have the full transcript object
  const hasTranscriptJson = transcript && "transcript_json" in transcript && transcript.transcript_json;

  if (!hasTranscriptJson) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">{t("transcript.notAvailable")}</p>
        <p className="text-xs text-muted-foreground mt-1">{t("transcript.notAvailableHint")}</p>
      </div>
    );
  }

  const entries = transcript.transcript_json as unknown as TranscriptEntry[];

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-3">
        {entries.map((entry, index) => (
          <div
            key={index}
            className="flex gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
            onClick={() => onSeekVideo?.(entry.start)}
          >
            <span className="text-xs text-primary font-mono min-w-[48px] pt-0.5 group-hover:underline">
              {formatTime(entry.start)}
            </span>
            <p className="text-sm text-foreground leading-relaxed flex-1">
              {entry.text}
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
