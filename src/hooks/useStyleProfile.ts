import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { 
  InstructorStyleProfile, 
  StyleProfileFormData,
  WritingTone,
  LengthPreference,
  LanguagePreference 
} from "@/types/aiStudio";

// Map database row to typed interface
function mapRowToStyleProfile(row: Record<string, unknown>): InstructorStyleProfile {
  return {
    id: row.id as string,
    instructor_id: row.instructor_id as string,
    tone: row.tone as WritingTone,
    target_audience: row.target_audience as string | null,
    preferred_length: row.preferred_length as LengthPreference,
    language_preference: row.language_preference as LanguagePreference,
    include_citations: row.include_citations as boolean,
    use_examples: row.use_examples as boolean,
    include_call_to_action: row.include_call_to_action as boolean,
    custom_instructions: row.custom_instructions as string | null,
    setup_completed: row.setup_completed as boolean,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export function useStyleProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: styleProfile, isLoading, error } = useQuery({
    queryKey: ["instructor-style-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("instructor_style_profile")
        .select("*")
        .eq("instructor_id", user.id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      
      return mapRowToStyleProfile(data);
    },
    enabled: !!user,
  });

  const upsertMutation = useMutation({
    mutationFn: async (formData: StyleProfileFormData) => {
      if (!user) throw new Error("Not authenticated");

      // Check if profile exists
      const { data: existing } = await supabase
        .from("instructor_style_profile")
        .select("id")
        .eq("instructor_id", user.id)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from("instructor_style_profile")
          .update({
            tone: formData.tone,
            target_audience: formData.target_audience || null,
            preferred_length: formData.preferred_length,
            language_preference: formData.language_preference,
            include_citations: formData.include_citations,
            use_examples: formData.use_examples,
            include_call_to_action: formData.include_call_to_action,
            custom_instructions: formData.custom_instructions || null,
            setup_completed: true,
          })
          .eq("instructor_id", user.id)
          .select()
          .single();

        if (error) throw error;
        return mapRowToStyleProfile(data);
      } else {
        // Insert new
        const { data, error } = await supabase
          .from("instructor_style_profile")
          .insert({
            instructor_id: user.id,
            tone: formData.tone,
            target_audience: formData.target_audience || null,
            preferred_length: formData.preferred_length,
            language_preference: formData.language_preference,
            include_citations: formData.include_citations,
            use_examples: formData.use_examples,
            include_call_to_action: formData.include_call_to_action,
            custom_instructions: formData.custom_instructions || null,
            setup_completed: true,
          })
          .select()
          .single();

        if (error) throw error;
        return mapRowToStyleProfile(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor-style-profile", user?.id] });
    },
  });

  return {
    styleProfile,
    isLoading,
    error,
    hasCompletedSetup: styleProfile?.setup_completed ?? false,
    saveStyleProfile: upsertMutation.mutateAsync,
    isSaving: upsertMutation.isPending,
  };
}
