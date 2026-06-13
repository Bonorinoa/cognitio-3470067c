import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  buildCors, isOriginAllowed, createServiceClient,
  getUserTier, checkRateLimits, rateLimitResponse, logUsage,
  getPlatformDefaults, wrapUserContent, INJECTION_GUARD_NOTE,
} from "../_shared/ai.ts";

const FUNCTION_NAME = "refine-content";

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = buildCors(origin);
  if (req.method !== "OPTIONS" && origin && !isOriginAllowed(origin)) {
    return new Response(JSON.stringify({ error: "Origin not allowed" }), {
      status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabase = createServiceClient();
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const tier = await getUserTier(supabase, user.id);
    const rl = await checkRateLimits(supabase, user.id, FUNCTION_NAME, tier);
    if (!rl.ok) return rateLimitResponse(rl, tier, corsHeaders);

    const { selected_text, instruction } = await req.json();
    const MAX_SELECTED_TEXT = 10000;
    const MAX_INSTRUCTION = 2000;
    if (typeof selected_text !== "string" || selected_text.length === 0 || selected_text.length > MAX_SELECTED_TEXT) {
      return new Response(JSON.stringify({ error: `selected_text required, max ${MAX_SELECTED_TEXT} chars` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (typeof instruction !== "string" || instruction.length === 0 || instruction.length > MAX_INSTRUCTION) {
      return new Response(JSON.stringify({ error: `instruction required, max ${MAX_INSTRUCTION} chars` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const defaults = await getPlatformDefaults(supabase);

    const systemPrompt = `You are a professional editor. Refine the given text according to the user's instruction.

${INJECTION_GUARD_NOTE}

RULES:
- Output ONLY the refined text — no explanations, preambles, or meta-commentary.
- Maintain the same language as the original text.
- Keep the Markdown formatting style consistent.
- Preserve the author's voice and intent while applying the requested changes.`;

    const userPrompt = `${wrapUserContent("SELECTED_TEXT", selected_text)}

${wrapUserContent("INSTRUCTION", instruction)}

Apply the INSTRUCTION to the SELECTED_TEXT and return only the refined version.`;

    const start = Date.now();
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: defaults.model,
        temperature: defaults.temperature,
        max_tokens: defaults.maxTokens,
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
        return new Response(JSON.stringify({ error: "Rate limit exceeded upstream. Try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const refinedText = data.choices?.[0]?.message?.content || "";
    const latencyMs = Date.now() - start;
    const usage = data.usage || {};

    await logUsage(supabase, {
      userId: user.id,
      functionName: FUNCTION_NAME,
      contentType: "refine",
      model: defaults.model,
      promptTokens: usage.prompt_tokens,
      completionTokens: usage.completion_tokens,
      totalTokens: usage.total_tokens,
      latencyMs,
    });

    return new Response(JSON.stringify({ refined_text: refinedText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in refine-content:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
