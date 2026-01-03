import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DAILY_LIMIT = 15;
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

serve(async (req) => {
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

    // Check daily usage limit BEFORE processing
    const dayStart = getDayStart();
    const { count: todayUsage, error: usageError } = await supabase
      .from("ai_usage_logs")
      .select("*", { count: "exact", head: true })
      .eq("instructor_id", user.id)
      .gte("created_at", dayStart.toISOString());

    if (usageError) {
      console.error("Error checking usage:", usageError);
    }

    if (todayUsage !== null && todayUsage >= DAILY_LIMIT) {
      console.log("Daily limit exceeded for user:", user.id);
      return new Response(
        JSON.stringify({ 
          error: "Daily AI limit reached (15/day). Resets at 6am Argentina time." 
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

    // Log this AI call for usage tracking
    supabase
      .from("ai_usage_logs")
      .insert({
        instructor_id: user.id,
        content_type: "refine",
        model_used: "google/gemini-2.5-flash",
      })
      .then(({ error: logError }) => {
        if (logError) {
          console.error("Failed to log usage:", logError);
        } else {
          console.log("Usage logged successfully");
        }
      });

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
