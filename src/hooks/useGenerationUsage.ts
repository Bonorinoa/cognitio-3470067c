import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const RESET_HOUR_UTC = 9; // 6am Argentina = 09:00 UTC
const DEFAULT_LIMIT = 10; // Free tier default

function getDayStart(): Date {
  const now = new Date();
  const dayStart = new Date(now);
  dayStart.setUTCHours(RESET_HOUR_UTC, 0, 0, 0);
  
  if (now < dayStart) {
    dayStart.setUTCDate(dayStart.getUTCDate() - 1);
  }
  
  return dayStart;
}

export function useGenerationUsage() {
  const { user } = useAuth();

  // Fetch user's tier and dynamic limit
  const { data: tierData, isLoading: tierLoading } = useQuery({
    queryKey: ["user-tier", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("get-user-tier");
      if (error) {
        console.error("Error fetching user tier:", error.message || error);
        return { tier: "free", dailyLimit: DEFAULT_LIMIT };
      }
      return data as { tier: string; dailyLimit: number };
    },
    staleTime: 60000, // Cache for 1 minute
  });

  const limit = tierData?.dailyLimit || DEFAULT_LIMIT;
  const tier = tierData?.tier || "free";

  // Count today's AI calls from ai_usage_logs
  const { data: todayCount = 0, isLoading: usageLoading } = useQuery({
    queryKey: ["generation-usage", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;

      const dayStart = getDayStart();

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
    staleTime: 30000,
    refetchInterval: 60000,
  });

  // Total all-time AI calls
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
    staleTime: 60000,
  });

  return {
    used: todayCount,
    remaining: Math.max(0, limit - todayCount),
    limit,
    tier,
    totalCount,
    isLoading: tierLoading || usageLoading,
  };
}
