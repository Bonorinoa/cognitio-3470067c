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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const TeacherSidebar = () => {
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
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <span className="text-lg font-bold text-foreground">Cognitio</span>
          <span className="block text-xs text-muted-foreground">{t("instructorSidebar.portal")}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        <Link
          to="/"
          className="mb-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Home className="h-5 w-5" />
          {t("instructorSidebar.backToSite")}
        </Link>
        <div className="my-3 border-t border-border" />
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{fullName}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          {t("instructorSidebar.signOut")}
        </Button>
      </div>
    </div>
  );
};

export default TeacherSidebar;
