import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Bot, Loader2, Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ReplyComposerProps {
  onSubmit: (content: string, mentionsAI: boolean) => Promise<void>;
  isSubmitting: boolean;
  aiEnabled: boolean;
  aiRemaining: number;
  aiUsed: number;
}

export default function ReplyComposer({
  onSubmit,
  isSubmitting,
  aiEnabled,
  aiRemaining,
  aiUsed,
}: ReplyComposerProps) {
  const { t } = useTranslation();
  const [content, setContent] = useState("");
  const [mentionsAI, setMentionsAI] = useState(false);

  // Detect @CognitioAI mention
  useEffect(() => {
    const hasMention = /@cognitioai/i.test(content);
    setMentionsAI(hasMention);
  }, [content]);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    await onSubmit(content.trim(), mentionsAI && aiEnabled && aiRemaining > 0);
    setContent("");
  };

  const canSubmit = content.trim().length > 0;
  const aiWillRespond = mentionsAI && aiEnabled && aiRemaining > 0;

  return (
    <div className="space-y-3">
      {/* AI status banner */}
      {!aiEnabled && (
        <Alert variant="default">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{t("discussion.aiTutorDisabled")}</AlertDescription>
        </Alert>
      )}

      <div className="border rounded-lg p-3 space-y-3">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            aiEnabled
              ? t("discussion.replyPlaceholderAI")
              : t("discussion.replyPlaceholder")
          }
          rows={3}
          className="border-0 p-0 focus-visible:ring-0 resize-none"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {aiEnabled && (
              <Badge variant={aiRemaining > 0 ? "outline" : "secondary"} className="gap-1">
                <Bot className="h-3 w-3" />
                {t("discussion.aiCallsRemaining", { count: aiRemaining })}
              </Badge>
            )}

            {mentionsAI && aiEnabled && (
              <Badge variant={aiWillRespond ? "default" : "destructive"} className="gap-1">
                {aiWillRespond ? (
                  <>
                    <Bot className="h-3 w-3" />
                    {t("discussion.aiWillRespond")}
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3" />
                    {t("discussion.aiLimitReached")}
                  </>
                )}
              </Badge>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            size="sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {mentionsAI && aiWillRespond
                  ? t("discussion.generatingAI")
                  : t("discussion.posting")}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {t("discussion.reply")}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
