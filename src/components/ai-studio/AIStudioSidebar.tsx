import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { SlidingPillIndicator } from "@/components/ui/sliding-pill-indicator";
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
import {
  Database,
  FileEdit,
  Mail,
  Home,
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
}

export default function AIStudioSidebar({ onLoadHistory, onDeleteHistory }: AIStudioSidebarProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const { remaining, limit, isLoading } = useGenerationUsage();
  const { history, isLoading: historyLoading, deleteGeneration } = useGenerationHistory();
  
  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: t("aiStudioNav.overview", "Overview"),
      href: "/ai-studio",
    },
    {
      icon: Database,
      label: t("aiStudioNav.knowledge", "Knowledge Base"),
      href: "/ai-studio/knowledge",
    },
    {
      icon: Settings2,
      label: t("aiStudioNav.settings", "Settings"),
      href: "/ai-studio/settings",
    },
  ];

  const marketingItems = [
    {
      icon: FileEdit,
      label: t("aiStudioNav.blog", "Blog Posts"),
      href: "/ai-studio/marketing/blog",
      available: true,
    },
    {
      icon: Linkedin,
      label: t("aiStudioNav.linkedin", "LinkedIn"),
      href: "/ai-studio/marketing/linkedin",
      available: false,
    },
    {
      icon: Twitter,
      label: t("aiStudioNav.twitter", "X/Twitter"),
      href: "/ai-studio/marketing/twitter",
      available: false,
    },
    {
      icon: Mail,
      label: t("aiStudioNav.newsletter", "Newsletter"),
      href: "/ai-studio/marketing/newsletter",
      available: false,
    },
  ];

  const academicItems = [
    {
      icon: GraduationCap,
      label: t("aiStudioNav.literatureReview", "Literature Review"),
      href: "/ai-studio/academic/literature-review",
      available: false,
    },
    {
      icon: FileEdit,
      label: t("aiStudioNav.paperFormatter", "Paper Formatter"),
      href: "/ai-studio/academic/paper-formatter",
      available: false,
    },
    {
      icon: FileEdit,
      label: t("aiStudioNav.paperEditor", "Paper Editor"),
      href: "/ai-studio/academic/paper-editor",
      available: false,
    },
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
      if (onDeleteHistory) {
        onDeleteHistory(pendingDeleteId);
      }
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setPendingDeleteId(null);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 z-30 border-r border-border bg-card">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold text-foreground">Cognitio</span>
          </Link>
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold">AI Studio</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <LayoutGroup id="ai-studio-desktop">
            {menuItems.map((item) => {
              // Dashboard uses exact match, others use startsWith for subroutes
              const isActive = item.href === "/ai-studio" 
                ? location.pathname === "/ai-studio"
                : location.pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {isActive && (
                    <SlidingPillIndicator
                      layoutId="ai-studio-desktop-pill"
                      borderRadius="rounded-lg"
                    />
                  )}
                  <Icon className="h-5 w-5 relative z-10" />
                  <span className="font-medium relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </LayoutGroup>

          {/* Marketing Bundle Section */}
          <div className="pt-4 border-t border-border/50">
            <div className="px-3 py-2 flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t("aiStudioNav.marketing", "Marketing")}
              </span>
            </div>
            <div className="space-y-1">
              {marketingItems.map((item) => {
                const isActive = location.pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      !item.available
                        ? "text-muted-foreground/50 cursor-pointer"
                        : isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="h-5 w-5 relative z-10" />
                    <span className="font-medium relative z-10">{item.label}</span>
                    {!item.available && (
                      <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded relative z-10">
                        {t("common.soon", "Soon")}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Academic Bundle Section */}
          <div className="pt-4 border-t border-border/50 opacity-60">
            <div className="px-3 py-2 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t("aiStudioNav.academic", "Academic")}
              </span>
              <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">
                {t("common.soon", "Soon")}
              </span>
            </div>
            <div className="space-y-1">
              {academicItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground/50 cursor-pointer transition-colors hover:text-muted-foreground/70"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* History Section */}
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
                  <div
                    key={item.id}
                    className="group flex items-center gap-1 rounded-lg hover:bg-muted/50"
                  >
                    <button
                      onClick={() => onLoadHistory?.(item)}
                      className="flex-1 text-left px-3 py-2 text-xs min-w-0"
                    >
                      <span className="font-medium block truncate">{item.topic}</span>
                      <span className="text-muted-foreground text-[10px]">
                        {formatRelativeTime(item.created_at)}
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(item.id);
                      }}
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
        </nav>

        {/* Generations Left */}
        <div className="p-4 border-t border-border space-y-2">
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
        </div>

        {/* Back to Home */}
        <div className="p-4 border-t border-border">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Home className="h-4 w-4" />
              {t("aiStudioNav.backToHome", "Back to Home")}
            </Button>
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
        {/* Top row: Logo and back button */}
        <div className="h-14 flex items-center px-4 gap-3">
          <Link to="/" className="font-bold text-lg">
            Cognitio
          </Link>
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
                    <DropdownMenuItem
                      key={item.id}
                      onClick={() => onLoadHistory?.(item)}
                      className="flex justify-between"
                    >
                      <span className="truncate flex-1">{item.topic}</span>
                      <span className="text-muted-foreground text-xs ml-2">
                        {formatRelativeTime(item.created_at)}
                      </span>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-2">
              {!isLoading && (
                <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(remaining / limit) * 100}%` }}
                  />
                </div>
              )}
              <span className="text-xs text-muted-foreground">
                {isLoading ? "..." : `${remaining}/${limit}`}
              </span>
            </div>
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                <Home className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("aiStudioNav.backToHome", "Home")}</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Bottom row: Navigation tabs with pill effect */}
        <div className="h-12 flex items-center px-2 gap-1 overflow-x-auto">
          <LayoutGroup id="ai-studio-mobile">
            {menuItems.map((item) => {
              // Dashboard uses exact match, others use startsWith for subroutes
              const isActive = item.href === "/ai-studio" 
                ? location.pathname === "/ai-studio"
                : location.pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <SlidingPillIndicator
                      layoutId="ai-studio-mobile-pill"
                      borderRadius="rounded-lg"
                    />
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
            <AlertDialogCancel disabled={isDeleting}>
              {t("common.cancel", "Cancel")}
            </AlertDialogCancel>
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
