import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "npm:@supabase/supabase-js@2";
import { getOrCreateStripeCustomerId } from "../_shared/stripeCustomer.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Hardcoded price IDs from Stripe (created via tools)
const PRICE_IDS = {
  marketing: "price_1SmKe1LvNA5IgKa6HZV3julI",
  academic: "price_1SmKgDLvNA5IgKa6NPgbPOAE",
  pro: "price_1SmKh8LvNA5IgKa6klVVHLEx",
} as const;

type Bundle = keyof typeof PRICE_IDS;

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CREATE-AI-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Parse request body
    const { bundle, action } = await req.json() as { bundle?: Bundle; action: "checkout" | "portal" };
    logStep("Request parsed", { bundle, action });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Find or create Stripe customer by stored id / metadata.user_id (never by email)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    const customerId = await getOrCreateStripeCustomerId(stripe, supabaseAdmin, user.id, user.email);
    logStep("Resolved customer", { customerId });

    // Handle portal action
    if (action === "portal") {
      const origin = req.headers.get("origin") || "https://lovable.dev";
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${origin}/ai-studio/settings`,
      });
      logStep("Portal session created", { url: portalSession.url });

      return new Response(JSON.stringify({ url: portalSession.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Handle checkout action
    if (action === "checkout") {
      if (!bundle || !PRICE_IDS[bundle]) {
        throw new Error(`Invalid bundle: ${bundle}. Must be one of: marketing, academic, pro`);
      }

      // Check for existing active subscription
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
      });

      if (subscriptions.data.length > 0) {
        logStep("User already has active subscription", { 
          subscriptionId: subscriptions.data[0].id 
        });
        throw new Error("You already have an active subscription. Please manage it from your settings.");
      }

      const origin = req.headers.get("origin") || "https://lovable.dev";
      const priceId = PRICE_IDS[bundle];

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        subscription_data: {
          trial_period_days: 7,
          metadata: {
            userId: user.id,
            bundle: bundle,
          },
        },
        success_url: `${origin}/ai-studio/settings?subscription=success`,
        cancel_url: `${origin}/ai-studio/settings?subscription=cancelled`,
        metadata: {
          userId: user.id,
          bundle: bundle,
        },
      });

      logStep("Checkout session created", { sessionId: session.id, bundle, priceId });

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    throw new Error(`Invalid action: ${action}. Must be 'checkout' or 'portal'`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
