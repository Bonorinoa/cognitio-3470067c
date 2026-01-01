import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { SlidingPillIndicator } from "@/components/ui/sliding-pill-indicator";
import {
  Database,
  FileEdit,
  Mail,
  LogOut,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export default function AIStudioSidebar() {
  const { t } = useTranslation();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: Database,
      label: t("aiStudioNav.knowledge", "Knowledge Base"),
      href: "/ai-studio",
    },
    {
      icon: FileEdit,
      label: t("aiStudioNav.blog", "Blog Generator"),
      href: "/ai-studio/blog",
    },
    {
      icon: Mail,
      label: t("aiStudioNav.newsletter", "Newsletter"),
      href: "/ai-studio/newsletter",
      disabled: true,
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
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
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            if (item.disabled) {
              return (
                <div
                  key={item.href}
                  className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground/50 cursor-not-allowed"
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">
                    {t("common.soon", "Soon")}
                  </span>
                </div>
              );
            }

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
                    layoutId="ai-studio-sidebar"
                    borderRadius="rounded-lg"
                  />
                )}
                <Icon className="h-5 w-5 relative" />
                <span className="font-medium relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Generations Left placeholder */}
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground flex justify-between items-center">
            <span>{t("aiStudioNav.generationsLeft", "Generations Left")}</span>
            <span className="text-foreground font-medium">∞</span>
          </div>
        </div>

        {/* Back to Instructor Panel */}
        <div className="p-4 border-t border-border">
          <Link to="/instructor">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("aiStudioNav.backToInstructor", "Back to Instructor Panel")}
            </Button>
          </Link>
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
              {getUserInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
        {/* Top row: Logo and user */}
        <div className="h-14 flex items-center px-4 gap-3">
          <Link to="/" className="font-bold text-lg">
            Cognitio
          </Link>
          <div className="flex items-center gap-1.5 text-primary">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">AI Studio</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/instructor">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("aiStudioNav.backToInstructor", "Back")}</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="h-8 w-8"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Bottom row: Navigation tabs */}
        <div className="h-12 flex items-center px-2 gap-1 overflow-x-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            if (item.disabled) {
              return (
                <div
                  key={item.href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-muted-foreground/50 whitespace-nowrap"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">
                    {t("common.soon", "Soon")}
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </header>
    </>
  );
}
