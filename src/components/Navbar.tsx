import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserRole } from "@/hooks/useUserRole";

const Navbar = () => {
  const { t } = useTranslation();
  const { user, signOut, isLoading } = useAuth();
  const { isInstructor } = useUserRole();

  const handleSignOut = async () => {
    await signOut();
  };

  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-foreground tracking-tight">Cognitio</span>
        </Link>

        {/* Main Navigation */}
        <div className="flex items-center gap-8">
          <Link 
            to="/" 
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            {t('nav.home')}
          </Link>
          <Link 
            to="/courses" 
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            {t('nav.courses')}
          </Link>
          <Link 
            to="/about" 
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            {t('nav.about')}
          </Link>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {t('nav.myLearning')}
                  </Link>
                </DropdownMenuItem>
                {isInstructor && (
                  <DropdownMenuItem asChild>
                    <Link to="/instructor" className="cursor-pointer">
                      <BookOpen className="mr-2 h-4 w-4" />
                      {t('nav.instructorPanel')}
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('nav.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="font-medium">
                {t('nav.login')}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
