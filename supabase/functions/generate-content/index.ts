import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESET_HOUR_UTC = 9; // 6am Argentina = 09:00 UTC

function getDayStart(): Date {
  const now = new Date();
  const dayStart = new Date(now);
  dayStart.setUTCHours(RESET_HOUR_UTC, 0, 0, 0);
  dayStart.setUTCMinutes(0);
  dayStart.setUTCSeconds(0);
  dayStart.setUTCMilliseconds(0);
  
  // If we haven't reached reset hour today, use yesterday's reset
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
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get auth user
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

    const { content_type, topic, additional_instructions, selected_document_ids } = await req.json();

    console.log("Generating content for user:", user.id);
    console.log("Content type:", content_type, "Topic:", topic);
    console.log("Selected documents:", selected_document_ids);

    // Get user's tier and dynamic limit
    const { tier, dailyLimit } = await getUserTierAndLimit(supabase, user.id);
    console.log("User tier:", tier, "Daily limit:", dailyLimit);

    // Check daily usage limit BEFORE calling AI
    const dayStart = getDayStart();
    console.log("Checking usage since:", dayStart.toISOString());

    const { count: todayUsage, error: usageError } = await supabase
      .from("ai_usage_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", dayStart.toISOString());

    if (usageError) {
      console.error("Error checking usage:", usageError);
    }

    console.log("Today's usage count:", todayUsage);

    if (todayUsage !== null && todayUsage >= dailyLimit) {
      console.log("Daily limit exceeded for user:", user.id);
      return new Response(
        JSON.stringify({ 
          error: `Daily generation limit reached (${dailyLimit}/day for ${tier} tier). Resets at 6am Argentina time.` 
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Fetch user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, headline, bio, affiliation, credentials")
      .eq("id", user.id)
      .single();

    // Fetch style profile
    const { data: styleProfile } = await supabase
      .from("user_style_profile")
      .select("*")
      .eq("user_id", user.id)
      .single();

    // Fetch selected documents
    let documents: any[] = [];
    if (selected_document_ids && selected_document_ids.length > 0) {
      const { data: docs } = await supabase
        .from("user_knowledge_base")
        .select("*")
        .in("id", selected_document_ids)
        .eq("user_id", user.id);
      documents = docs || [];
    }

    // Build context sections
    const styleContext = documents
      .filter((d) => d.context_role === "style_reference")
      .map((d) => `[${d.title}]\n${d.content}`)
      .join("\n\n");

    const topicContext = documents
      .filter((d) => d.context_role === "topic_source")
      .map((d) => `[${d.title}]\n${d.content}`)
      .join("\n\n");

    const backgroundContext = documents
      .filter((d) => d.context_role === "background_context")
      .map((d) => `[${d.title}]\n${d.content}`)
      .join("\n\n");

    // Build tone instructions
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

    // Build system prompt
    const systemPrompt = `You are an expert content writer helping a user create ${content_type === "blog" ? "a blog post" : "a newsletter"}.

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
- Start DIRECTLY with the title (# Title) - no preamble or introduction
- Do NOT include phrases like "Here's your blog post" or "I've written..."
- Do NOT add meta-commentary or explanations about the content
- Do NOT include "---" dividers at the start or end
- Output ONLY the final content, nothing else`;

    const userPrompt = `Write ${content_type === "blog" ? "a blog post" : "a newsletter"} about: ${topic}${additional_instructions ? `\n\nAdditional instructions: ${additional_instructions}` : ""}`;

    console.log("Calling Lovable AI Gateway...");

    // Call Lovable AI Gateway with streaming
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
        stream: true,
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
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    // Log this AI call for usage tracking BEFORE streaming response
    // This ensures the log is recorded even if the stream terminates early
    console.log("Logging usage for user:", user.id);
    const { error: logError } = await supabase
      .from("ai_usage_logs")
      .insert({
        user_id: user.id,
        content_type: content_type || "blog",
        model_used: "google/gemini-2.5-flash",
      });

    if (logError) {
      console.error("Failed to log usage:", logError);
      // Don't fail the request if logging fails, but log the error
    } else {
      console.log("Usage logged successfully");
    }

    console.log("Streaming response to client...");

    // Stream the response back
    return new Response(response.body, {
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
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
