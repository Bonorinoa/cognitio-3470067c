import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarCollapseButtonProps {
  collapsed: boolean;
  onToggle: () => void;
  className?: string;
}

export function SidebarCollapseButton({ collapsed, onToggle, className }: SidebarCollapseButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className={cn("h-8 w-8 shrink-0", className)}
      title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {collapsed ? (
        <PanelLeft className="h-4 w-4" />
      ) : (
        <PanelLeftClose className="h-4 w-4" />
      )}
    </Button>
  );
}
