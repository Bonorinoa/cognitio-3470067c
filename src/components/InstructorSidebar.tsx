import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  BarChart3,
  Settings,
  Sparkles,
} from "lucide-react";
import { LayoutGroup } from "framer-motion";
import { SidebarHeader, SidebarUserDropdown, SidebarNavItem, SidebarCollapseButton } from "@/components/sidebar";

interface InstructorSidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const InstructorSidebar = ({ collapsed = false, onCollapsedChange }: InstructorSidebarProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [internalCollapsed, setInternalCollapsed] = useState(collapsed);
  
  const isCollapsed = onCollapsedChange ? collapsed : internalCollapsed;
  const setIsCollapsed = onCollapsedChange || setInternalCollapsed;

  const menuItems = [
    { icon: LayoutDashboard, label: t("instructorSidebar.dashboard"), href: "/instructor" },
    { icon: BookOpen, label: t("instructorSidebar.courses"), href: "/instructor/courses" },
    { icon: PlusCircle, label: t("instructorSidebar.createCourse"), href: "/instructor/create" },
    { icon: BarChart3, label: t("instructorSidebar.analytics"), href: "/instructor/analytics" },
    { icon: Settings, label: t("instructorSidebar.settings"), href: "/instructor/settings" },
  ];

  const aiStudioLink = { icon: Sparkles, label: t("instructorSidebar.aiStudio"), href: "/ai-studio" };

  return (
    <div className={cn(
      "flex h-full flex-col border-r border-border bg-sidebar transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header with Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm shrink-0">
            <span className="text-lg font-bold text-primary-foreground">C</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-lg font-bold text-foreground leading-tight">Cognitio</span>
              <span className="text-xs text-muted-foreground leading-tight truncate">
                {t("instructorSidebar.portal")}
              </span>
            </div>
          )}
        </Link>
        <SidebarCollapseButton
          collapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
          className={cn("ml-auto", isCollapsed && "mx-auto")}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 pt-4 pb-2 overflow-y-auto">
        <LayoutGroup id="instructor-sidebar-nav">
          <div className="space-y-0.5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <SidebarNavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  isActive={isActive}
                  layoutId="instructor-sidebar-indicator"
                  collapsed={isCollapsed}
                />
              );
            })}
          </div>
        </LayoutGroup>

        {/* AI Studio Link - visually separated */}
        <div className="pt-4 mt-4 border-t border-border">
          <Link
            to={aiStudioLink.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors",
              isCollapsed && "justify-center px-2"
            )}
          >
            <aiStudioLink.icon className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span className="font-medium">{aiStudioLink.label}</span>}
          </Link>
        </div>
      </nav>

      {/* User section with dropdown */}
      <div className="border-t border-border p-3 bg-muted/30">
        <SidebarUserDropdown collapsed={isCollapsed} />
      </div>
    </div>
  );
};

export default InstructorSidebar;
