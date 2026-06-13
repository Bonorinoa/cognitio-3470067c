import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SlidingPillIndicator } from "@/components/ui/sliding-pill-indicator";
import { LucideIcon } from "lucide-react";

interface SidebarNavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  layoutId: string;
  collapsed?: boolean;
  badge?: string;
  disabled?: boolean;
}

export function SidebarNavItem({
  href,
  icon: Icon,
  label,
  isActive,
  layoutId,
  collapsed = false,
  badge,
  disabled = false,
}: SidebarNavItemProps) {
  const content = (
    <>
      {isActive && (
        <SlidingPillIndicator layoutId={layoutId} borderRadius="rounded-lg" />
      )}
      <Icon className={cn("h-5 w-5 relative z-10 shrink-0", disabled && "opacity-50")} />
      {!collapsed && (
        <>
          <span className={cn("font-medium relative z-10", disabled && "opacity-50")}>
            {label}
          </span>
          {badge && (
            <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded relative z-10">
              {badge}
            </span>
          )}
        </>
      )}
    </>
  );

  const className = cn(
    "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
    isActive
      ? "text-foreground"
      : disabled
      ? "text-muted-foreground/70 cursor-default"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
    collapsed && "justify-center px-2"
  );

  if (disabled) {
    return (
      <div className={className}>
        {content}
      </div>
    );
  }

  return (
    <Link to={href} className={className}>
      {content}
    </Link>
  );
}
