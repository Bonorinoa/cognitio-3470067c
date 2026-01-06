import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_TUTOR_LIMIT = 5;

serve(async (req) => {
  const startTime = Date.now();
  const log = (msg: string) => console.log(`[${Date.now() - startTime}ms] ${msg}`);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    log("Request received");
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
    log("User authenticated");

    const { discussion_id, chapter_id, video_timestamp_seconds, user_message, language } = await req.json();

    // Parallel fetch: settings, usage count, discussion, chapter, and recent replies
    log("Starting parallel DB queries");
    const [
      enabledSettingResult,
      usageCountResult,
      discussionResult,
      chapterResult,
      recentRepliesResult,
      settingsResult,
    ] = await Promise.all([
      supabaseClient.from("platform_settings").select("value").eq("key", "ai_tutor_enabled").single(),
      supabaseClient.from("ai_tutor_usage").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("chapter_id", chapter_id),
      supabaseClient.from("discussions").select("title, content").eq("id", discussion_id).single(),
      supabaseClient.from("chapters").select("title, description, course_id").eq("id", chapter_id).single(),
      supabaseClient.from("discussion_replies").select("content, is_ai_generated").eq("discussion_id", discussion_id).order("created_at", { ascending: false }).limit(5),
      supabaseClient.from("platform_settings").select("key, value").in("key", ["ai_tutor_system_prompt", "ai_tutor_model", "ai_tutor_temperature", "ai_tutor_max_tokens"]),
    ]);
    log("Parallel DB queries complete");

    // Check if AI tutor is enabled
    if (!enabledSettingResult.data?.value) {
      return new Response(JSON.stringify({ error: "AI tutor is currently disabled" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check rate limit
    const usageCount = usageCountResult.count ?? 0;
    if (usageCount >= AI_TUTOR_LIMIT) {
      return new Response(JSON.stringify({ 
        error: "AI tutor limit reached for this chapter",
        used: usageCount,
        limit: AI_TUTOR_LIMIT,
      }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const discussion = discussionResult.data;
    const chapter = chapterResult.data;
    const recentReplies = recentRepliesResult.data;

    // Fetch course, instructor, and transcript in parallel (dependent on chapter)
    log("Fetching course/instructor/transcript");
    let courseContext = "";
    let instructorContext = "";
    let transcriptExcerpt = "";

    if (chapter?.course_id) {
      const [courseResult, transcriptResult] = await Promise.all([
        supabaseClient.from("courses").select("title, description, category, instructor_id").eq("id", chapter.course_id).single(),
        supabaseClient.from("chapter_transcripts").select("transcript_json").eq("chapter_id", chapter_id).eq("status", "ready").single(),
      ]);

      if (courseResult.data) {
        const course = courseResult.data;
        courseContext = `Course: "${course.title}"${course.category ? ` (${course.category})` : ""}`;
        if (course.description) {
          courseContext += `\nCourse Description: ${course.description.slice(0, 500)}`;
        }

        // Fetch instructor
        if (course.instructor_id) {
          const { data: instructor } = await supabaseClient
            .from("profiles")
            .select("full_name, affiliation, headline")
            .eq("id", course.instructor_id)
            .single();

          if (instructor) {
            instructorContext = `Instructor: ${instructor.full_name || "Unknown"}`;
            if (instructor.affiliation) instructorContext += `, ${instructor.affiliation}`;
            if (instructor.headline) instructorContext += ` (${instructor.headline})`;
          }
        }
      }

      if (transcriptResult.data?.transcript_json && video_timestamp_seconds) {
        const segments = transcriptResult.data.transcript_json as Array<{ start: number; text: string }>;
        const relevant = segments.filter(
          (s) => s.start >= video_timestamp_seconds - 60 && s.start <= video_timestamp_seconds + 60
        );
        if (relevant.length > 0) {
          const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
          transcriptExcerpt = relevant.map((s) => `[${formatTime(s.start)}] ${s.text}`).join("\n").slice(0, 1500);
        }
      }
    }
    log("Context fetched");

    // Parse settings
    const settingsMap = (settingsResult.data || []).reduce((acc, s) => {
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
    if (courseContext) contextParts.push(courseContext);
    if (instructorContext) contextParts.push(instructorContext);
    if (chapter) {
      contextParts.push(`Chapter: ${chapter.title}`);
      if (chapter.description) contextParts.push(`Chapter Description: ${chapter.description}`);
    }
    if (transcriptExcerpt) {
      contextParts.push(`\nRelevant Transcript (around the video timestamp the student is asking about):\n${transcriptExcerpt}`);
    }

    const conversationContext = recentReplies?.reverse().map((r) => 
      `${r.is_ai_generated ? "AI" : "Student"}: ${r.content}`
    ).join("\n") || "";

    // Determine response language
    const langInstruction = language === "es" 
      ? "IMPORTANT: Respond in Spanish (Español)." 
      : language === "en" 
        ? "IMPORTANT: Respond in English."
        : "IMPORTANT: Respond in the same language as the student's message.";

    const fullPrompt = `${systemPrompt}

${langInstruction}

${contextParts.length > 0 ? `Context:\n${contextParts.join("\n")}\n` : ""}
Original Question: ${discussion?.title}
${discussion?.content}

${conversationContext ? `Recent Discussion:\n${conversationContext}\n` : ""}
Student's message: ${user_message}

Respond in a Socratic manner, guiding the student toward understanding. Use the course and transcript context to provide relevant guidance.`;

    // Insert user's prompt first
    log("Inserting user prompt to DB");
    const { data: promptReply, error: promptError } = await supabaseClient
      .from("discussion_replies")
      .insert({
        discussion_id,
        user_id: user.id,
        content: user_message,
        is_ai_generated: false,
      })
      .select()
      .single();

    if (promptError) {
      console.error("Error inserting user prompt:", promptError);
      throw promptError;
    }
    log("Calling AI gateway (non-streaming)");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    let aiResponse;
    try {
      aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
        signal: controller.signal,
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        log("AI gateway timeout");
        return new Response(JSON.stringify({ error: "AI response timed out. Please try again." }), {
          status: 504,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw fetchError;
    }
    clearTimeout(timeoutId);
    log("AI gateway responded");

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
    log("AI response parsed");

    // Insert AI reply
    log("Inserting AI reply to DB");
    const { data: newReply, error: replyError } = await supabaseClient
      .from("discussion_replies")
      .insert({
        discussion_id,
        user_id: user.id,
        content: aiContent,
        is_ai_generated: true,
        parent_reply_id: promptReply.id,
      })
      .select()
      .single();

    if (replyError) {
      console.error("Error inserting AI reply:", replyError);
      throw replyError;
    }

    // Update flags and record usage in parallel
    await Promise.all([
      supabaseClient.from("discussions").update({ has_ai_response: true }).eq("id", discussion_id),
      supabaseClient.from("ai_tutor_usage").insert({ user_id: user.id, chapter_id, discussion_id }),
      supabaseClient.from("ai_usage_logs").insert({ user_id: user.id, content_type: "discussion_assist", model_used: model }),
    ]);
    log("Complete");

    return new Response(JSON.stringify({ 
      success: true, 
      reply: newReply,
      remaining: AI_TUTOR_LIMIT - usageCount - 1,
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
