import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface OnboardingProfile {
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  headline: string | null;
  onboarding_completed_at: string | null;
}

export const useInstructorOnboarding = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["instructor-onboarding", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<OnboardingProfile | null> => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, bio, headline, onboarding_completed_at")
        .eq("id", user.id)
        .maybeSingle();
      if (error) throw error;
      return (data as OnboardingProfile) ?? null;
    },
  });

  const complete = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const { error } = await supabase
        .from("profiles")
        .update({ onboarding_completed_at: new Date().toISOString() } as never)
        .eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["instructor-onboarding", user?.id] });
    },
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    shouldShow: !query.isLoading && !!query.data && !query.data.onboarding_completed_at,
    markComplete: complete.mutateAsync,
    refetch: query.refetch,
  };
};
