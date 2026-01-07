import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const resourceId = url.searchParams.get("id");

    if (!resourceId) {
      return new Response(
        JSON.stringify({ error: "Missing resource ID" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get resource from database
    const { data: resource, error: dbError } = await supabase
      .from("chapter_resources")
      .select("url, title, resource_type")
      .eq("id", resourceId)
      .single();

    if (dbError || !resource) {
      console.error("Resource not found:", dbError);
      return new Response(
        JSON.stringify({ error: "Resource not found" }),
        { 
          status: 404, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Check if this is a Supabase storage URL
    const resourceUrl = resource.url;
    const isStorageUrl = resourceUrl.includes("supabase.co/storage");

    if (isStorageUrl) {
      // Extract bucket and path from URL
      // URL format: https://xxx.supabase.co/storage/v1/object/public/bucket/path
      const urlMatch = resourceUrl.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
      
      if (!urlMatch) {
        // If URL doesn't match expected pattern, redirect to original
        return Response.redirect(resourceUrl, 302);
      }

      const [, bucket, filePath] = urlMatch;
      
      // Download file from storage
      const { data: fileData, error: storageError } = await supabase.storage
        .from(bucket)
        .download(decodeURIComponent(filePath));

      if (storageError || !fileData) {
        console.error("Storage download error:", storageError);
        // Fallback: redirect to original URL
        return Response.redirect(resourceUrl, 302);
      }

      // Determine content type
      const contentTypeMap: Record<string, string> = {
        pdf: "application/pdf",
        video: "video/mp4",
        notebook: "application/x-ipynb+json",
        link: "text/html",
        other: "application/octet-stream",
      };
      
      const contentType = contentTypeMap[resource.resource_type] || "application/octet-stream";
      
      // Get filename from path
      const fileName = filePath.split("/").pop() || resource.title;

      return new Response(fileData, {
        headers: {
          ...corsHeaders,
          "Content-Type": contentType,
          "Content-Disposition": `inline; filename="${encodeURIComponent(fileName)}"`,
          "Cache-Control": "public, max-age=3600",
        },
      });
    } else {
      // External URL - redirect directly
      return Response.redirect(resourceUrl, 302);
    }
  } catch (error) {
    console.error("Download proxy error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
