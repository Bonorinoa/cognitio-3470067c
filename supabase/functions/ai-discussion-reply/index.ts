import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_TUTOR_LIMIT = 5;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    // Get user from JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { discussion_id, chapter_id, video_timestamp_seconds, user_message } = await req.json();

    // Check if AI tutor is enabled
    const { data: enabledSetting } = await supabaseClient
      .from("platform_settings")
      .select("value")
      .eq("key", "ai_tutor_enabled")
      .single();

    if (!enabledSetting?.value) {
      return new Response(JSON.stringify({ error: "AI tutor is currently disabled" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check rate limit
    const { count: usageCount } = await supabaseClient
      .from("ai_tutor_usage")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("chapter_id", chapter_id);

    if ((usageCount ?? 0) >= AI_TUTOR_LIMIT) {
      return new Response(JSON.stringify({ 
        error: "AI tutor limit reached for this chapter",
        used: usageCount,
        limit: AI_TUTOR_LIMIT,
      }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get discussion context
    const { data: discussion } = await supabaseClient
      .from("discussions")
      .select("title, content")
      .eq("id", discussion_id)
      .single();

    // Get recent replies for context
    const { data: recentReplies } = await supabaseClient
      .from("discussion_replies")
      .select("content, is_ai_generated")
      .eq("discussion_id", discussion_id)
      .order("created_at", { ascending: false })
      .limit(5);

    // Get chapter info
    const { data: chapter } = await supabaseClient
      .from("chapters")
      .select("title, description")
      .eq("id", chapter_id)
      .single();

    // Get transcript excerpt if available
    let transcriptExcerpt = "";
    const { data: transcript } = await supabaseClient
      .from("chapter_transcripts")
      .select("transcript_json")
      .eq("chapter_id", chapter_id)
      .eq("status", "ready")
      .single();

    if (transcript?.transcript_json && video_timestamp_seconds) {
      // Extract relevant transcript portion around timestamp
      const segments = transcript.transcript_json as Array<{ start: number; text: string }>;
      const relevant = segments.filter(
        (s) => s.start >= video_timestamp_seconds - 60 && s.start <= video_timestamp_seconds + 60
      );
      transcriptExcerpt = relevant.map((s) => s.text).join(" ").slice(0, 1000);
    }

    // Get AI tutor settings
    const { data: settings } = await supabaseClient
      .from("platform_settings")
      .select("key, value")
      .in("key", ["ai_tutor_system_prompt", "ai_tutor_model", "ai_tutor_temperature", "ai_tutor_max_tokens"]);

    const settingsMap = (settings || []).reduce((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {} as Record<string, unknown>);

    const systemPrompt = (settingsMap.ai_tutor_system_prompt as string) || 
      "You are CognitioAI, a Socratic learning assistant. Guide students toward understanding without giving direct answers.";
    const model = (settingsMap.ai_tutor_model as string) || "google/gemini-2.5-flash";
    const temperature = (settingsMap.ai_tutor_temperature as number) || 0.7;
    const maxTokens = (settingsMap.ai_tutor_max_tokens as number) || 1024;

    // Build context
    const contextParts = [];
    if (chapter) {
      contextParts.push(`Chapter: ${chapter.title}`);
      if (chapter.description) contextParts.push(`Description: ${chapter.description}`);
    }
    if (transcriptExcerpt) {
      contextParts.push(`Relevant transcript: ${transcriptExcerpt}`);
    }

    const conversationContext = recentReplies?.reverse().map((r) => 
      `${r.is_ai_generated ? "AI" : "Student"}: ${r.content}`
    ).join("\n") || "";

    const fullPrompt = `${systemPrompt}

${contextParts.length > 0 ? `Context:\n${contextParts.join("\n")}\n` : ""}
Original Question: ${discussion?.title}
${discussion?.content}

${conversationContext ? `Recent Discussion:\n${conversationContext}\n` : ""}
Student's message: ${user_message}

Respond in a Socratic manner, guiding the student toward understanding.`;

    // Call Lovable AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: fullPrompt }],
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || "I apologize, I couldn't generate a response.";

    // Insert AI reply
    const { data: newReply, error: replyError } = await supabaseClient
      .from("discussion_replies")
      .insert({
        discussion_id,
        user_id: user.id,
        content: aiContent,
        is_ai_generated: true,
      })
      .select()
      .single();

    if (replyError) {
      console.error("Error inserting reply:", replyError);
      throw replyError;
    }

    // Update discussion has_ai_response flag
    await supabaseClient
      .from("discussions")
      .update({ has_ai_response: true })
      .eq("id", discussion_id);

    // Record usage
    await supabaseClient
      .from("ai_tutor_usage")
      .insert({
        user_id: user.id,
        chapter_id,
        discussion_id,
      });

    // Log to ai_usage_logs
    await supabaseClient
      .from("ai_usage_logs")
      .insert({
        user_id: user.id,
        content_type: "discussion_assist",
        model_used: model,
      });

    return new Response(JSON.stringify({ 
      success: true, 
      reply: newReply,
      remaining: AI_TUTOR_LIMIT - (usageCount ?? 0) - 1,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("ai-discussion-reply error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
