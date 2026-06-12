import { useTranslation } from "react-i18next";
import { Check, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface RefineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedText: string;
  refineInstruction: string;
  setRefineInstruction: (v: string) => void;
  isRefining: boolean;
  refinedText: string | null;
  showDiffView: boolean;
  onRefine: () => void;
  onAccept: () => void;
  onReject: () => void;
}

export function RefineDialog({
  open,
  onOpenChange,
  selectedText,
  refineInstruction,
  setRefineInstruction,
  isRefining,
  refinedText,
  showDiffView,
  onRefine,
  onAccept,
  onReject,
}: RefineDialogProps) {
  const { t } = useTranslation();
  const setQuick = (action: string) => setRefineInstruction(action);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {showDiffView
              ? t("aiStudio.reviewChanges", "Review Changes")
              : t("aiStudio.refineTitle", "Refine Selection")}
          </DialogTitle>
          <DialogDescription>
            {showDiffView
              ? t("aiStudio.reviewChangesDesc", "Compare the original and refined text, then accept or reject the changes")
              : t("aiStudio.refineDesc", "Tell the AI how to improve the selected text")}
          </DialogDescription>
        </DialogHeader>

        {showDiffView && refinedText ? (
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-destructive/50"></span>
                  {t("aiStudio.original", "Original")}
                </Label>
                <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-md text-sm max-h-40 overflow-auto">
                  <p className="whitespace-pre-wrap">{selectedText}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                  {t("aiStudio.refined", "Refined")}
                </Label>
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-md text-sm max-h-40 overflow-auto">
                  <p className="whitespace-pre-wrap">{refinedText}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-md text-sm max-h-32 overflow-auto">
              <p className="text-muted-foreground text-xs mb-1">
                {t("aiStudio.selectedText", "Selected text:")}
              </p>
              <p className="italic">
                "{selectedText.length > 200 ? selectedText.slice(0, 200) + "..." : selectedText}"
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setQuick("Make it more concise and shorter")}>
                {t("aiStudio.shorten", "Shorten")}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setQuick("Make it more detailed and expand on the ideas")}>
                {t("aiStudio.expand", "Expand")}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setQuick("Use simpler language and make it easier to understand")}>
                {t("aiStudio.simplify", "Simplify")}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setQuick("Make it more formal and professional")}>
                {t("aiStudio.formalize", "Formalize")}
              </Button>
            </div>
            <Textarea
              placeholder={t("aiStudio.customInstruction", "Or type custom instructions...")}
              value={refineInstruction}
              onChange={(e) => setRefineInstruction(e.target.value)}
              rows={2}
            />
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {showDiffView ? (
            <>
              <Button variant="outline" onClick={onReject}>
                {t("aiStudio.tryAgain", "Try Again")}
              </Button>
              <Button onClick={onAccept}>
                <Check className="h-4 w-4 mr-1" />
                {t("aiStudio.acceptChanges", "Accept Changes")}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {t("common.cancel", "Cancel")}
              </Button>
              <Button onClick={onRefine} disabled={isRefining || !refineInstruction.trim()}>
                {isRefining ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    {t("aiStudio.refining", "Refining...")}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-1" />
                    {t("aiStudio.refine", "Refine")}
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
