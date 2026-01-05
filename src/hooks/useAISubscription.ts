import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type AIBundle = "marketing" | "academic" | "pro";
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing";

interface AISubscription {
  id: string;
  user_id: string;
  bundle: AIBundle;
  status: SubscriptionStatus;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export function useAISubscription() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query active subscription
  const {
    data: subscription,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["ai-subscription", user?.id],
    queryFn: async (): Promise<AISubscription | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("ai_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["active", "trialing"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as AISubscription | null;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: true,
  });

  // Create checkout session mutation
  const checkoutMutation = useMutation({
    mutationFn: async (bundle: AIBundle) => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.access_token) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase.functions.invoke("create-ai-subscription", {
        body: { bundle, action: "checkout" },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (!data?.url) throw new Error("No checkout URL returned");

      return data.url as string;
    },
    onSuccess: (url) => {
      // Open checkout in new tab (consistent with course checkout)
      window.open(url, "_blank");
    },
    onError: (error) => {
      console.error("Checkout error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to start checkout");
    },
  });

  // Open customer portal mutation
  const portalMutation = useMutation({
    mutationFn: async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.access_token) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase.functions.invoke("create-ai-subscription", {
        body: { action: "portal" },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (!data?.url) throw new Error("No portal URL returned");

      return data.url as string;
    },
    onSuccess: (url) => {
      window.open(url, "_blank");
    },
    onError: (error) => {
      console.error("Portal error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to open subscription management");
    },
  });

  // Computed values
  const hasActiveSubscription = !!subscription && ["active", "trialing"].includes(subscription.status);
  const subscribedBundle = subscription?.bundle || null;
  const isTrialing = subscription?.status === "trialing";
  const willCancel = subscription?.cancel_at_period_end === true;

  // Check if user is subscribed to a specific bundle
  const isSubscribedTo = (bundle: AIBundle): boolean => {
    if (!hasActiveSubscription) return false;
    // Pro includes access to all bundles
    if (subscribedBundle === "pro") return true;
    return subscribedBundle === bundle;
  };

  // Invalidate subscription query (useful after successful payment)
  const invalidateSubscription = () => {
    queryClient.invalidateQueries({ queryKey: ["ai-subscription", user?.id] });
  };

  return {
    // Data
    subscription,
    hasActiveSubscription,
    subscribedBundle,
    isTrialing,
    willCancel,
    
    // Loading states
    isLoading,
    error,
    
    // Actions
    createCheckout: checkoutMutation.mutate,
    isCreatingCheckout: checkoutMutation.isPending,
    openPortal: portalMutation.mutate,
    isOpeningPortal: portalMutation.isPending,
    
    // Helpers
    isSubscribedTo,
    refetch,
    invalidateSubscription,
  };
}
