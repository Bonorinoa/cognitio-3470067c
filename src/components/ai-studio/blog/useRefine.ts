import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export interface SelectionRange {
  start: number;
  end: number;
}

export function useRefine() {
  const { t } = useTranslation();
  const [selectedText, setSelectedText] = useState("");
  const [selectionRange, setSelectionRange] = useState<SelectionRange | null>(null);
  const [showRefineButton, setShowRefineButton] = useState(false);
  const [refineDialogOpen, setRefineDialogOpen] = useState(false);
  const [refineInstruction, setRefineInstruction] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [refinedText, setRefinedText] = useState<string | null>(null);
  const [showDiffView, setShowDiffView] = useState(false);

  const captureSelection = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    if (selected.trim().length > 10) {
      setSelectedText(selected);
      setSelectionRange({ start, end });
      setShowRefineButton(true);
    } else {
      setShowRefineButton(false);
      setSelectedText("");
      setSelectionRange(null);
    }
  };

  const runRefine = async () => {
    if (!selectedText || !selectionRange || !refineInstruction.trim()) return;
    setIsRefining(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/refine-content`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            selected_text: selectedText,
            instruction: refineInstruction.trim(),
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Refinement failed");
      }
      const { refined_text } = await response.json();
      setRefinedText(refined_text);
      setShowDiffView(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("aiStudio.refineFailed", "Refinement failed"));
    } finally {
      setIsRefining(false);
    }
  };

  const closeDialog = () => {
    setRefineDialogOpen(false);
    setRefineInstruction("");
    setSelectedText("");
    setSelectionRange(null);
    setShowRefineButton(false);
    setRefinedText(null);
    setShowDiffView(false);
  };

  const rejectRefinement = () => {
    setRefinedText(null);
    setShowDiffView(false);
  };

  const resetSelection = () => {
    setShowRefineButton(false);
    setSelectedText("");
    setSelectionRange(null);
  };

  return {
    selectedText,
    selectionRange,
    showRefineButton,
    refineDialogOpen,
    setRefineDialogOpen,
    refineInstruction,
    setRefineInstruction,
    isRefining,
    refinedText,
    showDiffView,
    captureSelection,
    runRefine,
    closeDialog,
    rejectRefinement,
    resetSelection,
  };
}
