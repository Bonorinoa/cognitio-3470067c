import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useGenerationUsage } from "@/hooks/useGenerationUsage";
import { Zap, Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * Compact "generations remaining today" indicator for the AI Studio topbar.
 * Click → popover with detailed breakdown (tier, daily/per-minute limits, totals).
 * Renders nothing when the user is signed out.
 */
export default function UsageIndicator() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { remaining, used, limit, tier, totalCount, isLoading } = useGenerationUsage();

  if (!user) return null;

  const pct = limit > 0 ? Math.max(0, Math.min(100, (remaining / limit) * 100)) : 0;
  const rpmByTier: Record<string, number> = {
    free: 3, instructor: 10, marketing: 15, academic: 15, pro: 20,
  };
  const rpm = rpmByTier[tier] ?? 3;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="group flex items-center gap-2 rounded-sm px-2 py-1 text-xs transition-colors hover:bg-muted/60"
          aria-label="Ver detalle de uso de IA"
        >
          <Zap className="h-3 w-3 text-primary" strokeWidth={2} />
          <span className="font-light text-foreground tabular-nums">
            {isLoading ? "…" : `${remaining}/${limit}`}
          </span>
          <span className="hidden text-muted-foreground md:inline">
            {t("aiStudioNav.generationsLeft", "generaciones")}
          </span>
          {!isLoading && (
            <div className="hidden h-px w-16 overflow-hidden bg-border md:block">
              <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
            </div>
          )}
          <Info className="h-3 w-3 text-muted-foreground/60 opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-4">
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tu plan</p>
            <p className="mt-1 font-light capitalize text-foreground">{tier}</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Hoy</span>
              <span className="tabular-nums text-foreground">{used} / {limit}</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary" style={{ width: `${Math.max(0, Math.min(100, (used / Math.max(1, limit)) * 100))}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-border pt-3 text-xs">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Por minuto</p>
              <p className="mt-1 tabular-nums text-foreground">{rpm}/min</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total histórico</p>
              <p className="mt-1 tabular-nums text-foreground">{totalCount.toLocaleString("es-AR")}</p>
            </div>
          </div>

          <p className="border-t border-border pt-3 text-xs text-muted-foreground">
            El límite diario se reinicia a las 6 AM hora Argentina. Si llegás al límite por minuto,
            esperá unos segundos antes de reintentar.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
