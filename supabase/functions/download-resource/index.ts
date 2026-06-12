import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const resourceId = url.searchParams.get("id");

    if (!resourceId) {
      return new Response(JSON.stringify({ error: "Missing resource ID" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const admin = createClient(supabaseUrl, supabaseServiceKey);

    // Require authenticated caller
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userRes, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userRes?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userRes.user.id;

    // Load resource + parent chapter to find course_id
    const { data: resource, error: dbError } = await admin
      .from("chapter_resources")
      .select("url, title, resource_type, chapter_id, chapters!inner(course_id)")
      .eq("id", resourceId)
      .single();

    if (dbError || !resource) {
      return new Response(JSON.stringify({ error: "Resource not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const courseId = (resource as unknown as { chapters: { course_id: string } }).chapters.course_id;

    // Enforce access via has_course_access
    const { data: hasAccess, error: accessErr } = await admin.rpc("has_course_access", {
      _user_id: userId,
      _course_id: courseId,
    });
    if (accessErr || !hasAccess) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resourceUrl = resource.url as string;
    const isStorageUrl = resourceUrl.includes("supabase.co/storage");

    if (isStorageUrl) {
      const urlMatch = resourceUrl.match(/\/storage\/v1\/object\/(?:public|sign)\/([^/]+)\/([^?]+)/);
      if (!urlMatch) {
        return Response.redirect(resourceUrl, 302);
      }
      const [, bucket, filePath] = urlMatch;

      const { data: fileData, error: storageError } = await admin.storage
        .from(bucket)
        .download(decodeURIComponent(filePath));

      if (storageError || !fileData) {
        console.error("Storage download error:", storageError);
        return new Response(JSON.stringify({ error: "Download failed" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const contentTypeMap: Record<string, string> = {
        pdf: "application/pdf",
        video: "video/mp4",
        notebook: "application/x-ipynb+json",
        link: "text/html",
        other: "application/octet-stream",
      };
      const contentType = contentTypeMap[resource.resource_type as string] || "application/octet-stream";
      const fileName = filePath.split("/").pop() || (resource.title as string);

      return new Response(fileData, {
        headers: {
          ...corsHeaders,
          "Content-Type": contentType,
          "Content-Disposition": `inline; filename="${encodeURIComponent(fileName)}"`,
          "Cache-Control": "private, max-age=300",
        },
      });
    }

    // External URL
    return Response.redirect(resourceUrl, 302);
  } catch (error) {
    console.error("Download proxy error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
