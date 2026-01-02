import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const DAILY_LIMIT = 10;

export function useGenerationUsage() {
  const { user } = useAuth();

  const { data: todayCount = 0, isLoading } = useQuery({
    queryKey: ["generation-usage", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Count ALL generations today (regardless of is_active status)
      // This ensures accurate daily usage tracking even after history cleanup
      const { count, error } = await supabase
        .from("ai_generation_history")
        .select("*", { count: "exact", head: true })
        .eq("instructor_id", user.id)
        .eq("status", "completed")
        .gte("created_at", today.toISOString());

      if (error) {
        console.error("Error fetching generation usage:", error);
        return 0;
      }

      return count ?? 0;
    },
    enabled: !!user?.id,
    staleTime: 30000, // Cache for 30 seconds
  });

  return {
    used: todayCount,
    remaining: Math.max(0, DAILY_LIMIT - todayCount),
    limit: DAILY_LIMIT,
    isLoading,
  };
}
