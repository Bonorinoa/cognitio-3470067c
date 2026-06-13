import { AlertTriangle, type LucideIcon } from "lucide-react";
import { EmptyState } from "./EmptyState";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: LucideIcon;
}

/**
 * Standard error placeholder. Voseo Spanish defaults.
 */
export function ErrorState({
  title = "Algo salió mal",
  description = "No pudimos cargar esta sección. Probá de nuevo en un momento.",
  onRetry,
  retryLabel = "Reintentar",
  icon = AlertTriangle,
}: ErrorStateProps) {
  return (
    <EmptyState
      variant="error"
      icon={icon}
      title={title}
      description={description}
      action={onRetry ? { label: retryLabel, onClick: onRetry } : undefined}
    />
  );
}
