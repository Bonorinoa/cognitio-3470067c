import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "npm:@supabase/supabase-js@2";
import { getOrCreateStripeCustomerId } from "../_shared/stripeCustomer.ts";

// CORS origin patterns - allows all Lovable preview/production domains
const allowedOriginPatterns = [
  /^https:\/\/[a-z0-9-]+\.lovable\.app$/,
  /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/,
  /^http:\/\/localhost:(5173|8080|3000)$/,
];

const isOriginAllowed = (origin: string | null): boolean => {
  if (!origin) return false;
  return allowedOriginPatterns.some(pattern => pattern.test(origin));
};

const getCorsHeaders = (origin: string | null) => {
  const isAllowed = isOriginAllowed(origin);
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin! : "",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-COURSE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);
  
  // Validate origin for non-OPTIONS requests
  if (req.method !== "OPTIONS" && origin && !isOriginAllowed(origin)) {
    logStep("BLOCKED - Origin not allowed", { origin });
    return new Response(JSON.stringify({ error: "Origin not allowed" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Create Supabase clients
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    // Authenticate user
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Parse request body
    const { courseId } = await req.json();
    logStep("Request parsed", { courseId });

    if (typeof courseId !== "string" || !courseId) {
      return new Response(JSON.stringify({ error: "Course ID is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch course details from database
    const { data: course, error: courseError } = await supabaseAdmin
      .from("courses")
      .select("id, title, description, price, stripe_product_id, stripe_price_id, is_published, visibility")
      .eq("id", courseId)
      .maybeSingle();

    if (courseError || !course) {
      return new Response(JSON.stringify({ error: "Course not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const price = Number(course.price);
    if (course.is_published !== true || course.visibility !== "public" || !Number.isFinite(price) || price <= 0) {
      logStep("Refused checkout: course not purchasable", { courseId });
      return new Response(JSON.stringify({ error: "Course is not available for purchase" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    logStep("Course fetched", { title: course.title, price });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Resolve Stripe customer by stored id / metadata.user_id (never by email)
    const customerId = await getOrCreateStripeCustomerId(stripe, supabaseAdmin, user.id, user.email);
    logStep("Resolved Stripe customer", { customerId });

    const origin = req.headers.get("origin") || "https://preview--hlnvfkturjctxbiikfoe.lovable.app";
    
    let priceId = course.stripe_price_id;
    
    // If no Stripe price exists, create product and price
    if (!priceId) {
      logStep("No Stripe price found, creating product and price");
      
      let productId = course.stripe_product_id;
      
      // Create product if needed
      if (!productId) {
        const product = await stripe.products.create({
          name: course.title,
          description: course.description || undefined,
          metadata: { courseId: course.id },
        });
        productId = product.id;
        logStep("Created Stripe product", { productId });
      }
      
      // Create price
      const price = await stripe.prices.create({
        product: productId,
        currency: "usd",
        unit_amount: Math.round(Number(course.price) * 100), // Convert to cents
      });
      priceId = price.id;
      logStep("Created Stripe price", { priceId });
      
      // Update course with Stripe IDs
      const { error: updateError } = await supabaseAdmin
        .from("courses")
        .update({
          stripe_product_id: productId,
          stripe_price_id: priceId,
        })
        .eq("id", courseId);
      
      if (updateError) {
        logStep("Warning: Failed to update course with Stripe IDs", { error: updateError.message });
      } else {
        logStep("Updated course with Stripe IDs");
      }
    }

    const successUrl = `${origin}/course/${courseId}?payment=success`;
    const cancelUrl = `${origin}/course/${courseId}?payment=canceled`;
    
    logStep("Creating checkout session", { origin, successUrl, cancelUrl, priceId });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        courseId,
        userId: user.id,
      },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-course-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});