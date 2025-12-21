import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const MUX_TOKEN_ID = Deno.env.get("MUX_TOKEN_ID");
    const MUX_TOKEN_SECRET = Deno.env.get("MUX_TOKEN_SECRET");

    if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
      console.error("Missing Mux credentials");
      throw new Error("Mux credentials not configured");
    }

    const { action, chapterId, assetId, uploadId } = await req.json();
    console.log(`Mux upload action: ${action}, chapterId: ${chapterId}`);

    // Create Supabase client for database operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const muxAuth = btoa(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`);

    if (action === "create-upload") {
      // Create a direct upload URL
      console.log("Creating Mux direct upload URL...");
      
      const uploadResponse = await fetch("https://api.mux.com/video/v1/uploads", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${muxAuth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          new_asset_settings: {
            playback_policy: ["public"],
            encoding_tier: "baseline",
          },
          cors_origin: "*",
        }),
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("Mux upload creation failed:", errorText);
        throw new Error(`Failed to create upload: ${errorText}`);
      }

      const uploadData = await uploadResponse.json();
      console.log("Upload created successfully:", uploadData.data.id);

      return new Response(
        JSON.stringify({
          uploadUrl: uploadData.data.url,
          uploadId: uploadData.data.id,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "check-upload") {
      // Check upload status and get asset info
      console.log("Checking upload status for:", uploadId);

      const uploadResponse = await fetch(`https://api.mux.com/video/v1/uploads/${uploadId}`, {
        headers: {
          "Authorization": `Basic ${muxAuth}`,
        },
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("Failed to check upload:", errorText);
        throw new Error(`Failed to check upload: ${errorText}`);
      }

      const uploadData = await uploadResponse.json();
      const upload = uploadData.data;

      return new Response(
        JSON.stringify({
          status: upload.status,
          assetId: upload.asset_id,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "get-asset") {
      // Get asset details including playback ID
      console.log("Getting asset details for:", assetId);

      const assetResponse = await fetch(`https://api.mux.com/video/v1/assets/${assetId}`, {
        headers: {
          "Authorization": `Basic ${muxAuth}`,
        },
      });

      if (!assetResponse.ok) {
        const errorText = await assetResponse.text();
        console.error("Failed to get asset:", errorText);
        throw new Error(`Failed to get asset: ${errorText}`);
      }

      const assetData = await assetResponse.json();
      const asset = assetData.data;

      const playbackId = asset.playback_ids?.[0]?.id;
      const duration = asset.duration;

      // Update chapter with asset info if chapterId provided
      if (chapterId && playbackId) {
        console.log("Updating chapter with playback info:", chapterId);
        const { error: updateError } = await supabase
          .from("chapters")
          .update({
            mux_asset_id: assetId,
            mux_playback_id: playbackId,
            duration_seconds: duration ? Math.round(duration) : null,
            upload_status: asset.status === "ready" ? "ready" : "processing",
          })
          .eq("id", chapterId);

        if (updateError) {
          console.error("Failed to update chapter:", updateError);
        }
      }

      return new Response(
        JSON.stringify({
          status: asset.status,
          playbackId,
          duration,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error("Invalid action");
  } catch (error) {
    console.error("Mux upload error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
