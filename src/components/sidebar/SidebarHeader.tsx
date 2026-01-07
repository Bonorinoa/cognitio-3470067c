import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

interface SidebarHeaderProps {
  subtitle?: string;
  icon?: React.ReactNode;
}

export function SidebarHeader({ subtitle, icon }: SidebarHeaderProps) {
  return (
    <div className="flex h-16 items-center gap-3 border-b border-border px-6">
      <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-foreground leading-tight">Cognitio</span>
          {subtitle && (
            <span className="text-xs text-muted-foreground leading-tight">{subtitle}</span>
          )}
        </div>
      </Link>
      {icon && <div className="ml-auto">{icon}</div>}
    </div>
  );
}
