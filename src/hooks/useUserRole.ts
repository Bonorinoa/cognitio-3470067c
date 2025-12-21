import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "teacher" | "student";

interface UseUserRoleResult {
  roles: AppRole[];
  isTeacher: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  isLoading: boolean;
  hasRole: (role: AppRole) => boolean;
}

export const useUserRole = (): UseUserRoleResult => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      if (!user) {
        setRoles([]);
        setIsLoading(false);
        return;
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
  }, [user]);

  const hasRole = (role: AppRole): boolean => roles.includes(role);

  return {
    roles,
    isTeacher: hasRole("teacher") || hasRole("admin"),
    isAdmin: hasRole("admin"),
    isStudent: hasRole("student") || roles.length === 0, // Default to student if no roles
    isLoading,
    hasRole,
  };
};
