import * as React from "react";
import { HelpCircle, ExternalLink, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HelpPopoverProps {
  title: string;
  children: React.ReactNode;
  learnMoreUrl?: string;
  learnMoreLabel?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
  triggerClassName?: string;
  /** If provided, shows a "Got it" button that calls this function */
  onDismiss?: () => void;
  dismissLabel?: string;
}

/**
 * A richer help card for detailed explanations.
 * Use for multi-line help with optional bullet points and external links.
 */
export const HelpPopover = ({
  title,
  children,
  learnMoreUrl,
  learnMoreLabel = "Learn more",
  side = "bottom",
  align = "start",
  className,
  triggerClassName,
  onDismiss,
  dismissLabel = "Got it",
}: HelpPopoverProps) => {
  const [open, setOpen] = React.useState(false);

  const handleDismiss = () => {
    setOpen(false);
    onDismiss?.();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center justify-center rounded-full h-5 w-5 bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            triggerClassName
          )}
          aria-label="Help"
        >
          <HelpCircle className="h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        className={cn("w-80 p-0", className)}
      >
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-semibold text-sm text-foreground">{title}</h4>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors -mt-1 -mr-1"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            {children}
          </div>
          {(learnMoreUrl || onDismiss) && (
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              {learnMoreUrl && (
                <a
                  href={learnMoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                >
                  {learnMoreLabel}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {onDismiss && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="ml-auto text-xs h-7"
                >
                  {dismissLabel}
                </Button>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default HelpPopover;
