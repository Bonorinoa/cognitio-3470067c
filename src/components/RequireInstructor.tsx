import { forwardRef } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { Loader2 } from "lucide-react";

interface RequireInstructorProps {
  children: React.ReactNode;
}

const RequireInstructor = forwardRef<HTMLDivElement, RequireInstructorProps>(({ children }, ref) => {
  const { user, isLoading: authLoading } = useAuth();
  const { isInstructor, isLoading: roleLoading } = useUserRole();

  // Show loading while checking auth and roles
  if (authLoading || roleLoading) {
    return (
      <div ref={ref} className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to dashboard if not an instructor
  if (!isInstructor) {
    return <Navigate to="/dashboard" replace />;
  }

  return <div ref={ref}>{children}</div>;
});

RequireInstructor.displayName = "RequireInstructor";

export default RequireInstructor;
