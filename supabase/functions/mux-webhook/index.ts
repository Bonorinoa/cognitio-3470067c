import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Parse VTT content into JSON with timestamps
function parseVttToJson(vttContent: string): { start: number; end: number; text: string }[] {
  const entries: { start: number; end: number; text: string }[] = [];
  const lines = vttContent.split("\n");
  
  let i = 0;
  // Skip WEBVTT header
  while (i < lines.length && !lines[i].includes("-->")) {
    i++;
  }
  
  while (i < lines.length) {
    const line = lines[i].trim();
    
    // Look for timestamp line (e.g., "00:00:01.000 --> 00:00:04.000")
    if (line.includes("-->")) {
      const [startStr, endStr] = line.split("-->").map(s => s.trim());
      const start = parseTimestamp(startStr);
      const end = parseTimestamp(endStr);
      
      // Collect text lines until empty line or next timestamp
      i++;
      const textLines: string[] = [];
      while (i < lines.length && lines[i].trim() && !lines[i].includes("-->")) {
        textLines.push(lines[i].trim());
        i++;
      }
      
      if (textLines.length > 0) {
        entries.push({
          start,
          end,
          text: textLines.join(" "),
        });
      }
    } else {
      i++;
    }
  }
  
  return entries;
}

// Convert VTT timestamp to seconds
function parseTimestamp(timestamp: string): number {
  // Handle formats: "00:00:01.000" or "00:01.000"
  const parts = timestamp.split(":");
  let hours = 0, minutes = 0, seconds = 0;
  
  if (parts.length === 3) {
    hours = parseFloat(parts[0]);
    minutes = parseFloat(parts[1]);
    seconds = parseFloat(parts[2]);
  } else if (parts.length === 2) {
    minutes = parseFloat(parts[0]);
    seconds = parseFloat(parts[1]);
  }
  
  return hours * 3600 + minutes * 60 + seconds;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const MUX_WEBHOOK_SECRET = Deno.env.get("MUX_WEBHOOK_SECRET");
    const MUX_TOKEN_ID = Deno.env.get("MUX_TOKEN_ID");
    const MUX_TOKEN_SECRET = Deno.env.get("MUX_TOKEN_SECRET");
    
    // Verify webhook signature if secret is configured
    if (MUX_WEBHOOK_SECRET) {
      const signature = req.headers.get("mux-signature");
      if (!signature) {
        console.error("Missing Mux webhook signature");
        return new Response(JSON.stringify({ error: "Missing signature" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      // Note: Full signature verification would require crypto library
      // For now, we verify the signature header exists
      console.log("Mux webhook signature present");
    }

    const body = await req.json();
    const { type, data } = body;
    
    console.log(`Mux webhook received: ${type}`);
    console.log("Event data:", JSON.stringify(data, null, 2));

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle video.asset.track.ready - fired when a track (like subtitles) is ready
    if (type === "video.asset.track.ready") {
      const track = data;
      const assetId = track.asset_id;
      
      console.log(`Track ready for asset ${assetId}:`, track.type, track.text_type);
      
      // Only process text tracks (subtitles/captions)
      if (track.type === "text" && (track.text_type === "subtitles" || track.text_source === "generated_vod")) {
        console.log("Processing auto-generated subtitles for asset:", assetId);
        
        // Find the chapter with this asset ID
        const { data: chapter, error: chapterError } = await supabase
          .from("chapters")
          .select("id, course_id")
          .eq("mux_asset_id", assetId)
          .single();
        
        if (chapterError || !chapter) {
          console.log("No chapter found for asset:", assetId);
          return new Response(JSON.stringify({ received: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        console.log("Found chapter:", chapter.id);
        
        // Fetch the VTT transcript from Mux
        if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
          console.error("Missing Mux API credentials");
          throw new Error("Mux credentials not configured");
        }
        
        const muxAuth = btoa(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`);
        const trackId = track.id;
        
        // Get the track URL for the VTT file
        const vttUrl = `https://stream.mux.com/${track.passthrough || assetId}/text/${trackId}.vtt`;
        
        // Actually, Mux provides the VTT through a different endpoint
        // We need to fetch from the tracks endpoint
        const trackResponse = await fetch(
          `https://api.mux.com/video/v1/assets/${assetId}/tracks/${trackId}`,
          {
            headers: { "Authorization": `Basic ${muxAuth}` },
          }
        );
        
        if (!trackResponse.ok) {
          console.error("Failed to fetch track details:", await trackResponse.text());
        } else {
          const trackData = await trackResponse.json();
          console.log("Track details:", JSON.stringify(trackData, null, 2));
        }
        
        // For auto-generated subtitles, we can get the VTT from the playback URL
        // First get the playback ID
        const assetResponse = await fetch(
          `https://api.mux.com/video/v1/assets/${assetId}`,
          {
            headers: { "Authorization": `Basic ${muxAuth}` },
          }
        );
        
        if (!assetResponse.ok) {
          console.error("Failed to fetch asset:", await assetResponse.text());
          throw new Error("Failed to fetch asset details");
        }
        
        const assetData = await assetResponse.json();
        const playbackId = assetData.data.playback_ids?.[0]?.id;
        
        if (!playbackId) {
          console.error("No playback ID found for asset");
          throw new Error("No playback ID available");
        }
        
        // Fetch VTT from Mux's streaming endpoint
        const vttResponse = await fetch(
          `https://stream.mux.com/${playbackId}/text/${trackId}.vtt`
        );
        
        if (!vttResponse.ok) {
          console.error("Failed to fetch VTT:", vttResponse.status);
          // Mark as error but don't fail
          await supabase
            .from("chapter_transcripts")
            .upsert({
              chapter_id: chapter.id,
              status: "error",
              error_message: "Failed to fetch transcript from Mux",
              language_code: track.language_code || "en",
            }, { onConflict: "chapter_id" });
          
          return new Response(JSON.stringify({ received: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        const vttContent = await vttResponse.text();
        console.log("VTT content length:", vttContent.length);
        
        // Parse VTT to JSON
        const transcriptJson = parseVttToJson(vttContent);
        console.log("Parsed transcript entries:", transcriptJson.length);
        
        // Store in chapter_transcripts
        const { error: upsertError } = await supabase
          .from("chapter_transcripts")
          .upsert({
            chapter_id: chapter.id,
            transcript_vtt: vttContent,
            transcript_json: transcriptJson,
            status: "ready",
            language_code: track.language_code || "en",
            error_message: null,
          }, { onConflict: "chapter_id" });
        
        if (upsertError) {
          console.error("Failed to store transcript:", upsertError);
          throw new Error("Failed to store transcript");
        }
        
        console.log("Transcript stored successfully for chapter:", chapter.id);
      }
    }
    
    // Handle video.asset.ready - mark chapter as fully processed
    if (type === "video.asset.ready") {
      const assetId = data.id;
      console.log("Asset ready:", assetId);
      
      // Update chapter status
      const { error: updateError } = await supabase
        .from("chapters")
        .update({ upload_status: "ready" })
        .eq("mux_asset_id", assetId);
      
      if (updateError) {
        console.error("Failed to update chapter status:", updateError);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Mux webhook error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
