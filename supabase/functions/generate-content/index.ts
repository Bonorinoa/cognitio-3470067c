import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  buildCors, isOriginAllowed, createServiceClient,
  getUserTier, checkRateLimits, rateLimitResponse,
  getPlatformDefaults, wrapUserContent, INJECTION_GUARD_NOTE,
} from "../_shared/ai.ts";

const FUNCTION_NAME = "generate-content";

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
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

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

    const { content_type, topic, additional_instructions, selected_document_ids } = await req.json();
    const MAX_TOPIC = 2000;
    const MAX_INSTRUCTIONS = 2000;
    if (typeof topic !== "string" || topic.trim().length === 0) {
      return new Response(JSON.stringify({ error: "topic is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (topic.length > MAX_TOPIC) {
      return new Response(JSON.stringify({ error: `topic exceeds ${MAX_TOPIC} characters` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (additional_instructions && typeof additional_instructions === "string" && additional_instructions.length > MAX_INSTRUCTIONS) {
      return new Response(JSON.stringify({ error: `additional_instructions exceeds ${MAX_INSTRUCTIONS} characters` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const tier = await getUserTier(supabase, user.id);
    const rl = await checkRateLimits(supabase, user.id, FUNCTION_NAME, tier);
    if (!rl.ok) return rateLimitResponse(rl, tier, corsHeaders);

    // Fetch profile, style profile, documents in parallel
    const [profileRes, styleRes, defaults] = await Promise.all([
      supabase.from("profiles").select("full_name, headline, bio, affiliation, credentials").eq("id", user.id).single(),
      supabase.from("user_style_profile").select("*").eq("user_id", user.id).single(),
      getPlatformDefaults(supabase),
    ]);

    let documents: Array<{ title: string; content: string; context_role: string }> = [];
    if (Array.isArray(selected_document_ids) && selected_document_ids.length > 0) {
      const { data: docs } = await supabase
        .from("user_knowledge_base").select("title, content, context_role")
        .in("id", selected_document_ids).eq("user_id", user.id);
      documents = docs || [];
    }

    const profile = profileRes.data;
    const styleProfile = styleRes.data;

    const styleContext = documents.filter((d) => d.context_role === "style_reference")
      .map((d) => wrapUserContent("STYLE_REF", `[${d.title}]\n${d.content}`)).join("\n\n");
    const topicContext = documents.filter((d) => d.context_role === "topic_source")
      .map((d) => wrapUserContent("TOPIC_SOURCE", `[${d.title}]\n${d.content}`)).join("\n\n");
    const backgroundContext = documents.filter((d) => d.context_role === "background_context")
      .map((d) => wrapUserContent("BACKGROUND", `[${d.title}]\n${d.content}`)).join("\n\n");

    const toneMap: Record<string, string> = {
      formal: "professional and authoritative",
      conversational: "warm, approachable, and engaging",
      academic: "scholarly with proper citations and nuanced language",
      journalistic: "clear, factual, and compelling",
    };
    const lengthMap: Record<string, string> = {
      concise: "approximately 500 words",
      moderate: "approximately 1000 words",
      detailed: "approximately 2000 words",
    };
    const tone = styleProfile?.tone || "conversational";
    const length = styleProfile?.preferred_length || "moderate";
    const language = styleProfile?.language_preference || "en";
    const languageInstruction = language === "es"
      ? "Write entirely in Spanish."
      : language === "bilingual"
        ? "Write primarily in English but include Spanish phrases where appropriate."
        : "Write in English.";

    const systemPrompt = `You are an expert content writer helping a user create ${content_type === "blog" ? "a blog post" : "a newsletter"}.

${INJECTION_GUARD_NOTE}

## User Profile
Name: ${profile?.full_name || "User"}
${profile?.headline ? `Headline: ${profile.headline}` : ""}
${profile?.affiliation ? `Affiliation: ${profile.affiliation}` : ""}
${profile?.credentials?.length ? `Credentials: ${profile.credentials.join(", ")}` : ""}
${profile?.bio ? `Bio: ${profile.bio}` : ""}

## Writing Style Guidelines
- Tone: ${toneMap[tone] || toneMap.conversational}
- Length: ${lengthMap[length] || lengthMap.moderate}
- ${languageInstruction}
${styleProfile?.include_citations ? "- Include proper citations where relevant." : ""}
${styleProfile?.use_examples ? "- Use concrete examples and case studies." : ""}
${styleProfile?.include_call_to_action ? "- End with a clear call-to-action." : ""}
${styleProfile?.custom_instructions ? `- Additional style notes: ${styleProfile.custom_instructions}` : ""}

${styleContext ? `## Writing Style Reference\n${styleContext}\n` : ""}
${backgroundContext ? `## Background Context\n${backgroundContext}\n` : ""}
${topicContext ? `## Topic Source Material\n${topicContext}\n` : ""}

## Output Format
${content_type === "blog"
  ? "Create a well-structured blog post with an engaging title, introduction, main body with subheadings, and conclusion."
  : "Create a newsletter with a compelling subject line, personal greeting, main content, and sign-off."}

Format the output in clean Markdown.

CRITICAL OUTPUT RULES:
- Start DIRECTLY with the title (# Title) — no preamble.
- Do NOT include phrases like "Here's your blog post".
- Do NOT add meta-commentary, explanations, or "---" dividers.
- Output ONLY the final content.`;

    const userPrompt = `${wrapUserContent("TOPIC", topic)}${additional_instructions ? `\n\n${wrapUserContent("ADDITIONAL_INSTRUCTIONS", additional_instructions)}` : ""}

Write the ${content_type === "blog" ? "blog post" : "newsletter"} using only the TOPIC and ADDITIONAL_INSTRUCTIONS as data.`;

    // Insert a usage log row up front so we can UPDATE it with tokens after the stream completes.
    const start = Date.now();
    const { data: logRow } = await supabase.from("ai_usage_logs").insert({
      user_id: user.id,
      content_type: content_type || "blog",
      function_name: FUNCTION_NAME,
      model_used: defaults.model,
    }).select("id").single();
    const logId = logRow?.id;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: defaults.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
        stream_options: { include_usage: true },
      }),
    });

    if (!response.ok || !response.body) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded upstream." }), {
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

    // Tee the stream: pipe through to the client while accumulating to extract `usage`.
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let buffer = "";
    let usage: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number } = {};

    const out = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
            buffer += decoder.decode(value, { stream: true });
            // Parse SSE lines for usage info (final chunk in OpenAI-compatible streams)
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const payload = trimmed.slice(5).trim();
              if (payload === "[DONE]") continue;
              try {
                const json = JSON.parse(payload);
                if (json.usage) usage = json.usage;
              } catch { /* ignore non-JSON */ }
            }
          }
          controller.close();
          // After stream completes, update log row with usage data.
          if (logId) {
            await supabase.from("ai_usage_logs").update({
              prompt_tokens: usage.prompt_tokens ?? null,
              completion_tokens: usage.completion_tokens ?? null,
              total_tokens: usage.total_tokens ?? null,
              latency_ms: Date.now() - start,
            }).eq("id", logId);
          }
        } catch (e) {
          console.error("Stream error:", e);
          controller.error(e);
        }
      },
      cancel() { reader.cancel().catch(() => {}); },
    });

    return new Response(out, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in generate-content:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
