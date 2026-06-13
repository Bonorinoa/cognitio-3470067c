import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const allowedOriginPatterns = [
  /^https:\/\/[a-z0-9-]+\.lovable\.app$/,
  /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/,
  /^https:\/\/cognitio\.lovable\.app$/,
  /^http:\/\/localhost:(5173|8080|3000)$/,
];
const isOriginAllowed = (origin: string | null) =>
  !!origin && allowedOriginPatterns.some((p) => p.test(origin));
const buildCors = (origin: string | null) => ({
  "Access-Control-Allow-Origin": isOriginAllowed(origin) ? origin! : "",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Credentials": "true",
});

const RESET_HOUR_UTC = 9; // 6am Argentina = 09:00 UTC

function getDayStart(): Date {
  const now = new Date();
  const dayStart = new Date(now);
  dayStart.setUTCHours(RESET_HOUR_UTC, 0, 0, 0);
  dayStart.setUTCMinutes(0);
  dayStart.setUTCSeconds(0);
  dayStart.setUTCMilliseconds(0);
  
  if (now < dayStart) {
    dayStart.setUTCDate(dayStart.getUTCDate() - 1);
  }
  
  return dayStart;
}

// Helper to get user's tier and daily limit
async function getUserTierAndLimit(supabase: any, userId: string): Promise<{ tier: string; dailyLimit: number }> {
  // 1. Check for active subscription
  const { data: subscription } = await supabase
    .from("ai_subscriptions")
    .select("bundle, status")
    .eq("user_id", userId)
    .in("status", ["active", "trialing"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (subscription) {
    const tierName = subscription.bundle === "pro" ? "pro" : subscription.bundle;
    const { data: tierLimit } = await supabase
      .from("ai_tier_limits")
      .select("daily_limit")
      .eq("tier_name", tierName)
      .single();
    
    return { tier: tierName, dailyLimit: tierLimit?.daily_limit || 200 };
  }

  // 2. Check if user is an instructor
  const { data: hasInstructorRole } = await supabase
    .rpc("has_role", { _user_id: userId, _role: "instructor" });

  if (hasInstructorRole) {
    const { data: tierLimit } = await supabase
      .from("ai_tier_limits")
      .select("daily_limit")
      .eq("tier_name", "instructor")
      .single();
    
    return { tier: "instructor", dailyLimit: tierLimit?.daily_limit || 50 };
  }

  // 3. Default to free tier
  const { data: tierLimit } = await supabase
    .from("ai_tier_limits")
    .select("daily_limit")
    .eq("tier_name", "free")
    .single();
  
  return { tier: "free", dailyLimit: tierLimit?.daily_limit || 10 };
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = buildCors(origin);
  if (req.method !== "OPTIONS" && origin && !isOriginAllowed(origin)) {
    return new Response(JSON.stringify({ error: "Origin not allowed" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user's tier and dynamic limit
    const { tier, dailyLimit } = await getUserTierAndLimit(supabase, user.id);
    console.log("User tier:", tier, "Daily limit:", dailyLimit);

    // Check daily usage limit BEFORE processing
    const dayStart = getDayStart();
    const { count: todayUsage, error: usageError } = await supabase
      .from("ai_usage_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", dayStart.toISOString());

    if (usageError) {
      console.error("Error checking usage:", usageError);
    }

    if (todayUsage !== null && todayUsage >= dailyLimit) {
      console.log("Daily limit exceeded for user:", user.id);
      return new Response(
        JSON.stringify({ 
          error: `Daily AI limit reached (${dailyLimit}/day for ${tier} tier). Resets at 6am Argentina time.` 
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { selected_text, instruction } = await req.json();

    if (!selected_text || !instruction) {
      return new Response(JSON.stringify({ error: "Missing selected_text or instruction" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Input validation: cap to prevent token exhaustion
    const MAX_SELECTED_TEXT = 10000;
    const MAX_INSTRUCTION = 2000;
    if (typeof selected_text !== "string" || selected_text.length > MAX_SELECTED_TEXT) {
      return new Response(JSON.stringify({ error: `selected_text exceeds ${MAX_SELECTED_TEXT} characters` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (typeof instruction !== "string" || instruction.length > MAX_INSTRUCTION) {
      return new Response(JSON.stringify({ error: `instruction exceeds ${MAX_INSTRUCTION} characters` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Refining content for user:", user.id);
    console.log("Instruction:", instruction);
    console.log("Text length:", selected_text.length);

    const systemPrompt = `You are a professional editor. Your task is to refine the given text according to the user's instruction.

RULES:
- Output ONLY the refined text - no explanations, preambles, or meta-commentary
- Do NOT start with phrases like "Here's the refined text" or "Sure, here it is"
- Maintain the same language as the original text
- Keep the Markdown formatting style consistent
- Preserve the author's voice and intent while applying the requested changes
- Return ONLY the improved version of the text`;

    const userPrompt = `Refine this text:
"""
${selected_text}
"""

Instruction: ${instruction}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const refinedText = data.choices?.[0]?.message?.content || "";

    console.log("Refinement complete, output length:", refinedText.length);

    // Log this AI call for usage tracking - await to ensure it completes
    console.log("Logging usage for user:", user.id);
    const { error: logError } = await supabase
      .from("ai_usage_logs")
      .insert({
        user_id: user.id,
        content_type: "refine",
        model_used: "google/gemini-2.5-flash",
      });

    if (logError) {
      console.error("Failed to log usage:", logError);
      // Don't fail the request if logging fails, but log the error
    } else {
      console.log("Usage logged successfully");
    }

    return new Response(JSON.stringify({ refined_text: refinedText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in refine-content:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
