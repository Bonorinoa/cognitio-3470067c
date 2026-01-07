import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, LogOut, BookOpen, Shield, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";

interface SidebarUserDropdownProps {
  collapsed?: boolean;
}

export function SidebarUserDropdown({ collapsed = false }: SidebarUserDropdownProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isInstructor, isAdmin } = useUserRole();

  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const email = user?.email || '';
  const initials = fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={`w-full justify-start gap-3 px-3 py-6 h-auto hover:bg-muted ${collapsed ? 'justify-center px-0' : ''}`}
        >
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-foreground truncate">{fullName}</p>
                <p className="text-xs text-muted-foreground truncate">{email}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-foreground truncate">{fullName}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            {t("nav.myLearning")}
          </Link>
        </DropdownMenuItem>
        {isInstructor && (
          <DropdownMenuItem asChild>
            <Link to="/instructor" className="cursor-pointer">
              <BookOpen className="mr-2 h-4 w-4" />
              {t("nav.instructorPanel")}
            </Link>
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin" className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              {t("nav.adminPanel")}
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          {t("nav.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
