import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "teacher" | "student" | "instructor";

interface UseUserRoleResult {
  roles: AppRole[];
  isInstructor: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  isLoading: boolean;
  hasRole: (role: AppRole) => boolean;
}

export const useUserRole = (): UseUserRoleResult => {
  const { user, isLoading: authLoading } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const previousUserId = useRef<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      // If auth is still loading, wait
      if (authLoading) {
        return;
      }

      // If no user, clear roles and stop loading
      if (!user) {
        setRoles([]);
        setIsLoading(false);
        previousUserId.current = null;
        return;
      }

      // If user changed, reset loading state
      if (previousUserId.current !== user.id) {
        setIsLoading(true);
        previousUserId.current = user.id;
      }

      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching user roles:", error);
          setRoles([]);
        } else {
          setRoles((data || []).map((r) => r.role as AppRole));
        }
      } catch (err) {
        console.error("Error fetching user roles:", err);
        setRoles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, [user, authLoading]);

  const hasRole = (role: AppRole): boolean => roles.includes(role);

  const isInstructor = hasRole("teacher") || hasRole("instructor") || hasRole("admin");

  return {
    roles,
    isInstructor,
    isAdmin: hasRole("admin"),
    isStudent: hasRole("student") || roles.length === 0, // Default to student if no roles
    isLoading,
    hasRole,
  };
};
