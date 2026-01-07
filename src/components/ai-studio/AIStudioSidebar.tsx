import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LayoutGroup } from "framer-motion";
import { useGenerationUsage } from "@/hooks/useGenerationUsage";
import { useGenerationHistory, formatRelativeTime, GenerationHistoryItem } from "@/hooks/useGenerationHistory";
import { SidebarUserDropdown, SidebarNavItem, SidebarCollapseButton } from "@/components/sidebar";
import {
  Database,
  FileEdit,
  Mail,
  Sparkles,
  History,
  ChevronDown,
  Trash2,
  LayoutDashboard,
  Settings2,
  Megaphone,
  GraduationCap,
  Linkedin,
  Twitter,
} from "lucide-react";

interface AIStudioSidebarProps {
  onLoadHistory?: (item: GenerationHistoryItem) => void;
  onDeleteHistory?: (id: string) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export default function AIStudioSidebar({ 
  onLoadHistory, 
  onDeleteHistory,
  collapsed = false,
  onCollapsedChange,
}: AIStudioSidebarProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const { remaining, limit, isLoading } = useGenerationUsage();
  const { history, isLoading: historyLoading, deleteGeneration } = useGenerationHistory();
  
  const [internalCollapsed, setInternalCollapsed] = useState(collapsed);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isCollapsed = onCollapsedChange ? collapsed : internalCollapsed;
  const setIsCollapsed = onCollapsedChange || setInternalCollapsed;

  const menuItems = [
    { icon: LayoutDashboard, label: t("aiStudioNav.overview", "Overview"), href: "/ai-studio" },
    { icon: Database, label: t("aiStudioNav.knowledge", "Knowledge Base"), href: "/ai-studio/knowledge" },
    { icon: Settings2, label: t("aiStudioNav.settings", "Settings"), href: "/ai-studio/settings" },
  ];

  const marketingItems = [
    { icon: FileEdit, label: t("aiStudioNav.blog", "Blog Posts"), href: "/ai-studio/marketing/blog", available: true },
    { icon: Linkedin, label: t("aiStudioNav.linkedin", "LinkedIn"), href: "/ai-studio/marketing/linkedin", available: false },
    { icon: Twitter, label: t("aiStudioNav.twitter", "X/Twitter"), href: "/ai-studio/marketing/twitter", available: false },
    { icon: Mail, label: t("aiStudioNav.newsletter", "Newsletter"), href: "/ai-studio/marketing/newsletter", available: false },
  ];

  const academicItems = [
    { icon: GraduationCap, label: t("aiStudioNav.literatureReview", "Literature Review"), href: "/ai-studio/academic/literature-review", available: false },
    { icon: FileEdit, label: t("aiStudioNav.paperFormatter", "Paper Formatter"), href: "/ai-studio/academic/paper-formatter", available: false },
    { icon: FileEdit, label: t("aiStudioNav.paperEditor", "Paper Editor"), href: "/ai-studio/academic/paper-editor", available: false },
  ];

  const handleDeleteClick = (id: string) => {
    setPendingDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    setIsDeleting(true);
    try {
      await deleteGeneration(pendingDeleteId);
      onDeleteHistory?.(pendingDeleteId);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setPendingDeleteId(null);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 border-r border-border bg-card transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Header */}
        <div className={cn(
          "flex h-16 items-center border-b border-border",
          isCollapsed ? "justify-center px-2" : "gap-3 px-4"
        )}>
          {isCollapsed ? (
            <SidebarCollapseButton
              collapsed={isCollapsed}
              onToggle={() => setIsCollapsed(!isCollapsed)}
            />
          ) : (
            <>
              <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm shrink-0">
                  <span className="text-lg font-bold text-primary-foreground">C</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-lg font-bold text-foreground leading-tight">Cognitio</span>
                  <div className="flex items-center gap-1 text-primary">
                    <Sparkles className="h-3 w-3" />
                    <span className="text-xs font-medium">AI Studio</span>
                  </div>
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

        {/* Navigation */}
        <nav className="flex-1 px-3 pt-4 space-y-1 overflow-y-auto">
          <LayoutGroup id="ai-studio-desktop">
            {menuItems.map((item) => {
              const isActive = item.href === "/ai-studio" 
                ? location.pathname === "/ai-studio"
                : location.pathname.startsWith(item.href);

              return (
                <SidebarNavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  isActive={isActive}
                  layoutId="ai-studio-desktop-pill"
                  collapsed={isCollapsed}
                />
              );
            })}
          </LayoutGroup>

          {/* Marketing Bundle Section */}
          <div className="pt-4 border-t border-border/50">
            {!isCollapsed && (
              <div className="px-3 py-2 flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t("aiStudioNav.marketing", "Marketing")}
                </span>
              </div>
            )}
            <div className="space-y-0.5">
              {marketingItems.map((item) => {
                const isActive = location.pathname.startsWith(item.href);
                return (
                  <SidebarNavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    isActive={isActive && item.available}
                    layoutId="ai-studio-marketing-pill"
                    collapsed={isCollapsed}
                    badge={!item.available ? t("common.soon", "Soon") : undefined}
                    disabled={!item.available}
                  />
                );
              })}
            </div>
          </div>

          {/* Academic Bundle Section */}
          <div className="pt-4 border-t border-border/50 opacity-60">
            {!isCollapsed && (
              <div className="px-3 py-2 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t("aiStudioNav.academic", "Academic")}
                </span>
                <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">
                  {t("common.soon", "Soon")}
                </span>
              </div>
            )}
            <div className="space-y-0.5">
              {academicItems.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  isActive={false}
                  layoutId="ai-studio-academic-pill"
                  collapsed={isCollapsed}
                  disabled
                />
              ))}
            </div>
          </div>

          {/* History Section - Only show when not collapsed */}
          {!isCollapsed && (
            <Collapsible defaultOpen className="mt-4 pt-4 border-t border-border/50">
              <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted/50 transition-colors group">
                <span className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground">
                  <History className="h-4 w-4" />
                  {t("aiStudioNav.recent", "Recent")} ({history.length}/10)
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 pt-2">
                {historyLoading ? (
                  <p className="text-xs text-muted-foreground py-2 px-3">Loading...</p>
                ) : history.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2 px-3">
                    {t("aiStudioNav.noHistory", "No saved generations yet")}
                  </p>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className="group flex items-center gap-1 rounded-lg hover:bg-muted/50">
                      <button onClick={() => onLoadHistory?.(item)} className="flex-1 text-left px-3 py-2 text-xs min-w-0">
                        <span className="font-medium block truncate">{item.topic}</span>
                        <span className="text-muted-foreground text-[10px]">{formatRelativeTime(item.created_at)}</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(item.id); }}
                        className="p-1.5 mr-1 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity rounded"
                        title={t("common.delete", "Delete")}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))
                )}
              </CollapsibleContent>
            </Collapsible>
          )}
        </nav>

        {/* Generations Left */}
        <div className={cn("p-4 border-t border-border space-y-2", isCollapsed && "px-2")}>
          {!isCollapsed ? (
            <>
              <div className="text-xs text-muted-foreground flex justify-between items-center">
                <span>{t("aiStudioNav.generationsLeft", "Generations Left")}</span>
                <span className="text-foreground font-medium">
                  {isLoading ? "..." : `${remaining} / ${limit}`}
                </span>
              </div>
              {!isLoading && (
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${(remaining / limit) * 100}%` }}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <span className="text-xs text-muted-foreground">
                {isLoading ? "..." : remaining}
              </span>
            </div>
          )}
        </div>

        {/* User section with dropdown */}
        <div className="border-t border-border p-3 bg-muted/30">
          <SidebarUserDropdown collapsed={isCollapsed} />
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="h-14 flex items-center px-4 gap-3">
          <Link to="/" className="font-bold text-lg">Cognitio</Link>
          <div className="flex items-center gap-1.5 text-primary">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">AI Studio</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {/* History Dropdown - Mobile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8">
                  <History className="h-4 w-4" />
                  {history.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                      {history.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>{t("aiStudioNav.recentGenerations", "Recent Generations")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {history.length === 0 ? (
                  <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                    {t("aiStudioNav.noHistory", "No saved generations")}
                  </div>
                ) : (
                  history.map((item) => (
                    <DropdownMenuItem key={item.id} onClick={() => onLoadHistory?.(item)} className="flex justify-between">
                      <span className="truncate flex-1">{item.topic}</span>
                      <span className="text-muted-foreground text-xs ml-2">{formatRelativeTime(item.created_at)}</span>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-2">
              {!isLoading && (
                <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(remaining / limit) * 100}%` }} />
                </div>
              )}
              <span className="text-xs text-muted-foreground">{isLoading ? "..." : `${remaining}/${limit}`}</span>
            </div>
          </div>
        </div>

        {/* Bottom row: Navigation tabs */}
        <div className="h-12 flex items-center px-2 gap-1 overflow-x-auto">
          <LayoutGroup id="ai-studio-mobile">
            {menuItems.map((item) => {
              const isActive = item.href === "/ai-studio" 
                ? location.pathname === "/ai-studio"
                : location.pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-muted rounded-lg" />
                  )}
                  <Icon className="h-4 w-4 relative z-10" />
                  <span className="text-sm relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </LayoutGroup>
        </div>
      </header>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("aiStudioNav.deleteConfirmTitle", "Delete from history?")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("aiStudioNav.deleteConfirmDesc", "This will permanently remove this generation from your history. This action cannot be undone.")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t("common.cancel", "Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? t("common.deleting", "Deleting...") : t("common.delete", "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
