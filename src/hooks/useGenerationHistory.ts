/**
 * Back-compat shim. New code should import from `@/hooks/useDrafts`.
 * Kept so existing call sites (Blog generator, etc.) keep working.
 */
import { useDrafts, formatRelativeTime as _formatRelativeTime, type Draft, type SaveDraftParams } from "@/hooks/useDrafts";

export type GenerationHistoryItem = Draft;

export const formatRelativeTime = _formatRelativeTime;

export function useGenerationHistory() {
  const { drafts, isLoading, saveDraft, updateDraft, deleteDraft, invalidate } = useDrafts({ limit: 10 });
  return {
    history: drafts,
    isLoading,
    saveGeneration: (p: SaveDraftParams) => saveDraft(p),
    updateGeneration: updateDraft,
    deleteGeneration: deleteDraft,
    invalidate,
  };
}
