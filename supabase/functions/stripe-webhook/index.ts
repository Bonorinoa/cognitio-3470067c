import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Read RAW request body bytes for signature verification (avoid any re-encoding issues)
    const bodyBytes = new Uint8Array(await req.arrayBuffer());
    const signature = req.headers.get("stripe-signature");

    logStep("Webhook payload received", { bytes: bodyBytes.byteLength, hasSignature: Boolean(signature) });

    if (!signature) {
      logStep("ERROR: No stripe-signature header");
      return new Response("No signature", { status: 400 });
    }

    // Verify webhook signature (must use async version in Deno runtime)
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(bodyBytes, signature, webhookSecret);
      logStep("Signature verified", { type: event.type });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      logStep("ERROR: Signature verification failed", { message });
      return new Response(`Webhook signature verification failed: ${message}`, { status: 400 });
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      logStep("Processing checkout.session.completed", { sessionId: session.id });

      const userId = session.metadata?.userId;
      const courseId = session.metadata?.courseId;
      const amountTotal = session.amount_total;

      if (!userId || !courseId) {
        logStep("ERROR: Missing metadata", { userId, courseId });
        return new Response("Missing metadata", { status: 400 });
      }

      logStep("Extracted metadata", { userId, courseId, amountTotal });

      // Create Supabase admin client
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );

      // Check if purchase already exists (idempotency)
      const { data: existingPurchase } = await supabaseAdmin
        .from("purchases")
        .select("id")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .maybeSingle();

      if (existingPurchase) {
        logStep("Purchase already exists, skipping", { purchaseId: existingPurchase.id });
        return new Response(JSON.stringify({ received: true, status: "already_recorded" }), {
          headers: { "Content-Type": "application/json" },
          status: 200,
        });
      }

      // Insert purchase record
      const amount = amountTotal ? amountTotal / 100 : 0; // Convert cents to dollars
      const { error: insertError } = await supabaseAdmin
        .from("purchases")
        .insert({
          user_id: userId,
          course_id: courseId,
          amount,
          stripe_payment_id: session.payment_intent as string,
        });

      if (insertError) {
        logStep("ERROR: Failed to insert purchase", { error: insertError.message });
        return new Response(`Failed to record purchase: ${insertError.message}`, { status: 500 });
      }

      logStep("Purchase recorded successfully", { userId, courseId, amount });
    } else {
      logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in stripe-webhook", { message: errorMessage });
    return new Response(`Webhook error: ${errorMessage}`, { status: 500 });
  }
});
