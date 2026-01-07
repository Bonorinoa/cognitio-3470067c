import * as React from "react";
import { Info, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface HelpTooltipProps {
  content: React.ReactNode;
  icon?: "info" | "help";
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
  iconClassName?: string;
}

/**
 * A lightweight inline tooltip for quick explanations.
 * Use for brief, single-line help text next to form fields or metrics.
 */
export const HelpTooltip = ({
  content,
  icon = "info",
  side = "top",
  className,
  iconClassName,
}: HelpTooltipProps) => {
  const Icon = icon === "info" ? Info : HelpCircle;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center rounded-full p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              className
            )}
            aria-label="Help"
          >
            <Icon className={cn("h-4 w-4", iconClassName)} />
          </button>
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs text-sm">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HelpTooltip;
