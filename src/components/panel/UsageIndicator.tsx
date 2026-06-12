import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useGenerationUsage } from "@/hooks/useGenerationUsage";
import { Zap } from "lucide-react";

/**
 * Compact "generations remaining today" indicator for the AI Studio topbar.
 * Renders nothing when the user is signed out.
 */
export default function UsageIndicator() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { remaining, limit, isLoading } = useGenerationUsage();

  if (!user) return null;

  const pct = limit > 0 ? Math.max(0, Math.min(100, (remaining / limit) * 100)) : 0;

  return (
    <div className="flex items-center gap-2.5 text-xs">
      <Zap className="h-3 w-3 text-primary" strokeWidth={2} />
      <span className="hidden sm:inline uppercase tracking-[0.15em] font-semibold text-muted-foreground">
        {t("aiStudioNav.generationsLeft", "Restantes")}
      </span>
      <span className="font-light text-foreground tabular-nums">
        {isLoading ? "…" : `${remaining}/${limit}`}
      </span>
      {!isLoading && (
        <div className="h-px w-16 overflow-hidden bg-border hidden md:block">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}
