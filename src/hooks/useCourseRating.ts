import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface CourseRating {
  id: string;
  course_id: string;
  user_id: string;
  rating: number;
  review: string | null;
  created_at: string;
  updated_at: string;
}

interface CourseReviewWithProfile extends CourseRating {
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export function useCourseRating(courseId: string | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get user's rating for this course
  const { data: userRating, isLoading: isLoadingUserRating } = useQuery({
    queryKey: ["course-rating", courseId, user?.id],
    queryFn: async () => {
      if (!courseId || !user) return null;

      const { data, error } = await supabase
        .from("course_ratings")
        .select("*")
        .eq("course_id", courseId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user rating:", error);
        return null;
      }

      return data as CourseRating | null;
    },
    enabled: !!courseId && !!user,
  });

  // Get all reviews for this course
  const { data: allReviews = [], isLoading: isLoadingReviews } = useQuery({
    queryKey: ["course-reviews", courseId],
    queryFn: async () => {
      if (!courseId) return [];

      // First get the ratings
      const { data: ratings, error: ratingsError } = await supabase
        .from("course_ratings")
        .select("*")
        .eq("course_id", courseId)
        .order("created_at", { ascending: false });

      if (ratingsError) {
        console.error("Error fetching reviews:", ratingsError);
        return [];
      }

      // Then get the profiles for each rating
      const userIds = ratings.map(r => r.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", userIds);

      // Combine them
      return ratings.map(rating => ({
        ...rating,
        profiles: profiles?.find(p => p.id === rating.user_id) || null,
      })) as CourseReviewWithProfile[];
    },
    enabled: !!courseId,
  });

  // Submit or update rating
  const submitRating = useMutation({
    mutationFn: async ({ rating, review }: { rating: number; review?: string }) => {
      if (!courseId || !user) throw new Error("Must be logged in");

      const { data, error } = await supabase
        .from("course_ratings")
        .upsert(
          {
            course_id: courseId,
            user_id: user.id,
            rating,
            review: review || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "course_id,user_id" }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-rating", courseId] });
      queryClient.invalidateQueries({ queryKey: ["course-reviews", courseId] });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    },
  });

  // Delete rating
  const deleteRating = useMutation({
    mutationFn: async () => {
      if (!courseId || !user) throw new Error("Must be logged in");

      const { error } = await supabase
        .from("course_ratings")
        .delete()
        .eq("course_id", courseId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-rating", courseId] });
      queryClient.invalidateQueries({ queryKey: ["course-reviews", courseId] });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    },
  });

  return {
    userRating,
    isLoadingUserRating,
    allReviews,
    isLoadingReviews,
    submitRating,
    deleteRating,
  };
}
