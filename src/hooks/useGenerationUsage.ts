import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const DAILY_LIMIT = 15;
const RESET_HOUR_UTC = 9; // 6am Argentina = 09:00 UTC

function getDayStart(): Date {
  const now = new Date();
  const dayStart = new Date(now);
  dayStart.setUTCHours(RESET_HOUR_UTC, 0, 0, 0);
  dayStart.setUTCMinutes(0);
  dayStart.setUTCSeconds(0);
  dayStart.setUTCMilliseconds(0);
  
  // If we haven't reached reset hour today, use yesterday's reset
  if (now < dayStart) {
    dayStart.setUTCDate(dayStart.getUTCDate() - 1);
  }
  
  return dayStart;
}

export function useGenerationUsage() {
  const { user } = useAuth();

  // Count today's AI calls from ai_usage_logs
  const { data: todayCount = 0, isLoading } = useQuery({
    queryKey: ["generation-usage", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;

      const dayStart = getDayStart();

      // Count from ai_usage_logs table (actual AI calls)
      const { count, error } = await supabase
        .from("ai_usage_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", dayStart.toISOString());

      if (error) {
        console.error("Error fetching generation usage:", error);
        return 0;
      }

      return count ?? 0;
    },
    enabled: !!user?.id,
    staleTime: 30000, // Cache for 30 seconds
    refetchInterval: 60000, // Refresh every minute for accuracy
  });

  // Total all-time AI calls (from ai_usage_logs)
  const { data: totalCount = 0 } = useQuery({
    queryKey: ["generation-total", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;

      const { count, error } = await supabase
        .from("ai_usage_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching total generations:", error);
        return 0;
      }

      return count ?? 0;
    },
    enabled: !!user?.id,
    staleTime: 60000, // Cache for 1 minute
  });

  return {
    used: todayCount,
    remaining: Math.max(0, DAILY_LIMIT - todayCount),
    limit: DAILY_LIMIT,
    totalCount,
    isLoading,
  };
}
