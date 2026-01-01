import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  BarChart3,
  Settings,
  LogOut,
  GraduationCap,
  Home,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutGroup } from "framer-motion";
import { SlidingPillIndicator } from "@/components/ui/sliding-pill-indicator";

const InstructorSidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: t("instructorSidebar.dashboard"), href: "/instructor" },
    { icon: BookOpen, label: t("instructorSidebar.courses"), href: "/instructor/courses" },
    { icon: PlusCircle, label: t("instructorSidebar.createCourse"), href: "/instructor/create" },
    { icon: BarChart3, label: t("instructorSidebar.analytics"), href: "/instructor/analytics" },
    { icon: Settings, label: t("instructorSidebar.settings"), href: "/instructor/settings" },
  ];

  // Link to AI Studio (external to this layout)
  const aiStudioLink = { icon: Sparkles, label: t("instructorSidebar.aiStudio"), href: "/ai-studio" };

  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const email = user?.email || '';
  const initials = fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-foreground leading-tight">Cognitio</span>
          <span className="text-xs text-muted-foreground leading-tight">{t("instructorSidebar.portal")}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 pt-4 pb-2">
        {/* Back to Site - visually separated */}
        <Link
          to="/"
          className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4" />
          <span className="text-xs">{t("instructorSidebar.backToSite")}</span>
        </Link>
        
        {/* Divider with label */}
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Menu</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <LayoutGroup id="instructor-sidebar-nav">
          <div className="space-y-0.5 pt-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <SlidingPillIndicator
                      layoutId="instructor-sidebar-indicator"
                      borderRadius="rounded-lg"
                    />
                  )}
                <item.icon className="h-5 w-5 relative z-10" />
                <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </LayoutGroup>

        {/* AI Studio Link - visually separated */}
        <div className="pt-2 mt-2 border-t border-border">
          <Link
            to={aiStudioLink.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <aiStudioLink.icon className="h-5 w-5" />
            <span className="font-medium">{aiStudioLink.label}</span>
          </Link>
        </div>
      </nav>

      {/* User section */}
      <div className="border-t border-border p-4 bg-muted/30">
        <div className="mb-3 flex items-center gap-3 px-1">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shadow-sm ring-2 ring-primary/10">
            <span className="text-sm font-semibold text-primary">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{fullName}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted" 
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("instructorSidebar.signOut")}
        </Button>
      </div>
    </div>
  );
};

export default InstructorSidebar;
