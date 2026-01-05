import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const logStep = (step: string, details?: Record<string, unknown>) => {
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
    const webhookSecretRaw = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    if (!webhookSecretRaw) throw new Error("STRIPE_WEBHOOK_SECRET is not set");

    // Support multiple secrets (comma or newline separated)
    const webhookSecrets = webhookSecretRaw
      .split(/[,\n]/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    logStep("Webhook secrets parsed", { count: webhookSecrets.length });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Read RAW request body bytes for signature verification
    const bodyBytes = new Uint8Array(await req.arrayBuffer());
    const signature = req.headers.get("stripe-signature");

    logStep("Webhook payload received", { 
      bytes: bodyBytes.byteLength, 
      hasSignature: Boolean(signature),
      signaturePrefix: signature ? signature.substring(0, 20) + "..." : null
    });

    if (!signature) {
      logStep("ERROR: No stripe-signature header");
      return new Response("No signature", { status: 400 });
    }

    // Try each webhook secret until one works
    let event: Stripe.Event | null = null;
    let lastError: string = "";
    
    for (let i = 0; i < webhookSecrets.length; i++) {
      try {
        event = await stripe.webhooks.constructEventAsync(bodyBytes, signature, webhookSecrets[i]);
        logStep("Signature verified", { type: event.type, secretIndex: i });
        break;
      } catch (err) {
        lastError = err instanceof Error ? err.message : "Unknown error";
        logStep(`Secret ${i + 1}/${webhookSecrets.length} failed`, { message: lastError.substring(0, 100) });
      }
    }

    if (!event) {
      logStep("ERROR: All signature verifications failed", { 
        secretsAttempted: webhookSecrets.length,
        lastError: lastError.substring(0, 150)
      });
      return new Response(`Webhook signature verification failed`, { status: 400 });
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Handle events based on type
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Processing checkout.session.completed", { sessionId: session.id });

        const userId = session.metadata?.userId;
        const courseId = session.metadata?.courseId;
        const bundle = session.metadata?.bundle;

        // This is a course purchase (existing flow)
        if (courseId && userId) {
          const amountTotal = session.amount_total;
          logStep("Course purchase detected", { userId, courseId, amountTotal });

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
          const amount = amountTotal ? amountTotal / 100 : 0;
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
        } 
        // This is an AI subscription checkout (new flow)
        else if (bundle && userId) {
          logStep("AI subscription checkout detected", { userId, bundle });
          // Subscription will be created by customer.subscription.created event
          // We just log here for tracking
        } else {
          logStep("Checkout session without courseId or bundle", { metadata: session.metadata });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep(`Processing ${event.type}`, { 
          subscriptionId: subscription.id,
          status: subscription.status 
        });

        // Get metadata from subscription
        const userId = subscription.metadata?.userId;
        const bundle = subscription.metadata?.bundle as "marketing" | "academic" | "pro" | undefined;

        if (!userId || !bundle) {
          logStep("Subscription missing required metadata", { 
            userId, 
            bundle,
            metadata: subscription.metadata 
          });
          // Don't fail - might be a subscription from elsewhere
          break;
        }

        // Map Stripe status to our status enum
        const statusMap: Record<string, string> = {
          active: "active",
          trialing: "trialing",
          past_due: "past_due",
          canceled: "canceled",
          unpaid: "past_due",
          incomplete: "past_due",
          incomplete_expired: "canceled",
          paused: "canceled",
        };

        const mappedStatus = statusMap[subscription.status] || "canceled";

        // Upsert subscription record
        const { error: upsertError } = await supabaseAdmin
          .from("ai_subscriptions")
          .upsert({
            user_id: userId,
            bundle: bundle,
            status: mappedStatus,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: subscription.customer as string,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: "user_id",
          });

        if (upsertError) {
          logStep("ERROR: Failed to upsert subscription", { error: upsertError.message });
          return new Response(`Failed to record subscription: ${upsertError.message}`, { status: 500 });
        }

        logStep("Subscription recorded successfully", { userId, bundle, status: mappedStatus });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Processing customer.subscription.deleted", { subscriptionId: subscription.id });

        const userId = subscription.metadata?.userId;

        if (userId) {
          const { error: updateError } = await supabaseAdmin
            .from("ai_subscriptions")
            .update({ 
              status: "canceled",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subscription.id);

          if (updateError) {
            logStep("ERROR: Failed to mark subscription as canceled", { error: updateError.message });
          } else {
            logStep("Subscription marked as canceled", { userId, subscriptionId: subscription.id });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Processing invoice.payment_failed", { invoiceId: invoice.id });

        if (invoice.subscription) {
          const { error: updateError } = await supabaseAdmin
            .from("ai_subscriptions")
            .update({ 
              status: "past_due",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", invoice.subscription as string);

          if (updateError) {
            logStep("ERROR: Failed to mark subscription as past_due", { error: updateError.message });
          } else {
            logStep("Subscription marked as past_due", { subscriptionId: invoice.subscription });
          }
        }
        break;
      }

      default:
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
