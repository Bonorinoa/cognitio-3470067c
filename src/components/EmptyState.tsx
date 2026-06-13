import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  /** Visual tone. "error" uses destructive colors. */
  variant?: "default" | "error";
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  variant = "default",
  className,
}: EmptyStateProps) {
  const isError = variant === "error";
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className,
      )}
    >
      <div
        className={cn(
          "rounded-full p-4 mb-4",
          isError ? "bg-destructive/10" : "bg-primary/10",
        )}
      >
        <Icon
          className={cn(
            "h-8 w-8",
            isError ? "text-destructive" : "text-primary",
          )}
        />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <div className="text-muted-foreground max-w-sm mb-4 text-sm leading-relaxed">
        {description}
      </div>
      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {action && (
            <Button
              onClick={action.onClick}
              variant={isError ? "destructive" : "default"}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
