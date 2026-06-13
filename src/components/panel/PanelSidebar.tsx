import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutGroup, AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowLeft, ChevronDown, Clock } from "lucide-react";
import {
  SidebarNavItem,
  SidebarUserDropdown,
  SidebarCollapseButton,
} from "@/components/sidebar";
import type { PanelNavConfig } from "@/config/panelNav";

interface PanelSidebarProps {
  nav: PanelNavConfig;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export default function PanelSidebar({
  nav,
  collapsed: collapsedProp,
  onCollapsedChange,
}: PanelSidebarProps) {
  const location = useLocation();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [expandedComingSoon, setExpandedComingSoon] = useState<Record<number, boolean>>({});
  const isCollapsed = onCollapsedChange ? collapsedProp ?? false : internalCollapsed;
  const setIsCollapsed = onCollapsedChange ?? setInternalCollapsed;

  const isItemActive = (href: string, exact?: boolean) =>
    exact ? location.pathname === href : location.pathname.startsWith(href);

  const isAIStudio = nav.layoutId === "ai-studio-panel-indicator";

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r border-border transition-all duration-300",
        isAIStudio ? "bg-background" : "bg-sidebar",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-border",
          isCollapsed ? "justify-center px-2" : "gap-3 px-4"
        )}
      >
        {isCollapsed ? (
          <SidebarCollapseButton
            collapsed={isCollapsed}
            onToggle={() => setIsCollapsed(!isCollapsed)}
          />
        ) : (
          <>
            <Link
              to="/"
              className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-80"
            >
              <div className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center shadow-sm",
                isAIStudio ? "bg-primary rounded-sm" : "bg-primary rounded-lg"
              )}>
                <span className="text-lg font-bold text-primary-foreground">C</span>
              </div>
              <div className="flex min-w-0 flex-col">
                <span className={cn(
                  "leading-tight text-foreground",
                  isAIStudio ? "text-lg font-light" : "text-lg font-bold"
                )}>
                  Cognitio
                </span>
                <span className={cn(
                  "truncate text-xs leading-tight",
                  isAIStudio
                    ? "text-primary uppercase tracking-[0.15em] font-semibold"
                    : "text-muted-foreground"
                )}>
                  {nav.roleLabel}
                </span>
              </div>
            </Link>
            <SidebarCollapseButton
              collapsed={isCollapsed}
              onToggle={() => setIsCollapsed(!isCollapsed)}
              className="ml-auto"
            />
          </>
        )}
      </div>

      {/* Back to site */}
      {!isCollapsed && (
        <Link
          to="/"
          className="mx-3 mt-3 flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver al sitio
        </Link>
      )}

      {/* Nav sections */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-2 pt-4">
        <LayoutGroup id={nav.layoutId}>
          {nav.sections.map((section, sectionIdx) => {
            const activeItems = section.items.filter((i) => !i.comingSoon);
            const comingSoonItems = section.items.filter((i) => i.comingSoon);
            const isExpanded = expandedComingSoon[sectionIdx] ?? false;
            return (
              <div key={section.label ?? `section-${sectionIdx}`} className="space-y-1">
                {section.label && !isCollapsed && (
                  <p className={cn(
                    "px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.15em]",
                    isAIStudio ? "text-primary/70" : "text-muted-foreground/70"
                  )}>
                    {section.label}
                  </p>
                )}
                <div className="space-y-0.5">
                  {activeItems.map((item) => (
                    <SidebarNavItem
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      label={item.label}
                      isActive={isItemActive(item.href, item.exact)}
                      layoutId={nav.layoutId}
                      collapsed={isCollapsed}
                      badge={item.badge}
                    />
                  ))}

                  {comingSoonItems.length > 0 && !isCollapsed && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedComingSoon((prev) => ({
                            ...prev,
                            [sectionIdx]: !isExpanded,
                          }))
                        }
                        className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                        aria-expanded={isExpanded}
                      >
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        <span>Próximamente ({comingSoonItems.length})</span>
                        <ChevronDown
                          className={cn(
                            "ml-auto h-3.5 w-3.5 transition-transform",
                            isExpanded && "rotate-180"
                          )}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            key="coming-soon"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-0.5 pt-0.5">
                              {comingSoonItems.map((item) => (
                                <SidebarNavItem
                                  key={item.href}
                                  href={item.href}
                                  icon={item.icon}
                                  label={item.label}
                                  isActive={false}
                                  layoutId={nav.layoutId}
                                  collapsed={isCollapsed}
                                  disabled
                                  badge={item.badge ?? "Pronto"}
                                />
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}

                  {/* When sidebar is icon-collapsed, still render coming-soon items as disabled icons */}
                  {comingSoonItems.length > 0 && isCollapsed &&
                    comingSoonItems.map((item) => (
                      <SidebarNavItem
                        key={item.href}
                        href={item.href}
                        icon={item.icon}
                        label={item.label}
                        isActive={false}
                        layoutId={nav.layoutId}
                        collapsed={isCollapsed}
                        disabled
                      />
                    ))}
                </div>
              </div>
            );
          })}
        </LayoutGroup>

        {nav.footer && nav.footer.length > 0 && (
          <div className="mt-4 space-y-0.5 border-t border-border pt-4">
            {nav.footer.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isCollapsed && "justify-center px-2",
                  item.variant === "accent"
                    ? "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* User dropdown */}
      <div className="border-t border-border bg-muted/30 p-3">
        <SidebarUserDropdown collapsed={isCollapsed} />
      </div>
    </div>
  );
}
