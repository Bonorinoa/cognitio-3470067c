import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const FOUNDER_IDS_KEY = "founder_user_ids";

/**
 * Returns the ordered list of founder user IDs from `platform_settings`.
 * Used to (a) flag instructors as founders in the catalog and (b) keep
 * them pinned to the top of the instructors page in a stable order.
 */
export const useFounderIds = () => {
  return useQuery({
    queryKey: ["platform_settings", FOUNDER_IDS_KEY],
    staleTime: 10 * 60 * 1000,
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from("platform_settings")
        .select("value")
        .eq("key", FOUNDER_IDS_KEY)
        .maybeSingle();

      if (error) throw error;
      const raw = data?.value;
      if (Array.isArray(raw)) return raw.filter((v): v is string => typeof v === "string");
      return [];
    },
  });
};
