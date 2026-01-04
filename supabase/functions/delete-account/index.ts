import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS origin patterns - allows all Lovable preview/production domains
const allowedOriginPatterns = [
  /^https:\/\/[a-z0-9-]+\.lovable\.app$/,
  /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/,
  /^http:\/\/localhost:(5173|8080|3000)$/,
];

const isOriginAllowed = (origin: string | null): boolean => {
  if (!origin) return false;
  return allowedOriginPatterns.some(pattern => pattern.test(origin));
};

const getCorsHeaders = (origin: string | null) => {
  const isAllowed = isOriginAllowed(origin);
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin! : "",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
};

interface DeleteAccountRequest {
  userId: string;
}

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);
  
  // Validate origin for non-OPTIONS requests
  if (req.method !== "OPTIONS" && origin && !isOriginAllowed(origin)) {
    console.error("BLOCKED - Origin not allowed:", origin);
    return new Response(JSON.stringify({ error: "Origin not allowed" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create a Supabase client with the user's JWT
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: { headers: { Authorization: authHeader } },
      }
    );

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error("Authentication error:", authError);
      return new Response(
        JSON.stringify({ error: "Not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { userId }: DeleteAccountRequest = await req.json();

    // Ensure user can only delete their own account
    if (userId !== user.id) {
      console.error("User attempted to delete a different account");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Processing account deletion for user: ${userId}`);

    // Create an admin client for operations that need elevated permissions
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // 1. Anonymize the user's profile
    const anonymizedData = {
      full_name: "[Eliminado]",
      avatar_url: null,
      headline: null,
      bio: null,
      affiliation: null,
      website_url: null,
      linkedin_url: null,
      twitter_url: null,
      credentials: null,
      email: null,
    };

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update(anonymizedData)
      .eq("id", userId);

    if (profileError) {
      console.error("Error anonymizing profile:", profileError);
      throw new Error("Failed to anonymize profile");
    }
    console.log("Profile anonymized successfully");

    // 2. Delete user roles
    const { error: rolesError } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", userId);

    if (rolesError) {
      console.error("Error deleting user roles:", rolesError);
      // Continue anyway - not critical
    }
    console.log("User roles deleted");

    // 3. Delete user progress
    const { error: progressError } = await supabaseAdmin
      .from("user_progress")
      .delete()
      .eq("user_id", userId);

    if (progressError) {
      console.error("Error deleting user progress:", progressError);
      // Continue anyway - not critical
    }
    console.log("User progress deleted");

    // 4. Delete course memberships
    const { error: membershipsError } = await supabaseAdmin
      .from("course_memberships")
      .delete()
      .eq("user_id", userId);

    if (membershipsError) {
      console.error("Error deleting course memberships:", membershipsError);
      // Continue anyway - not critical
    }
    console.log("Course memberships deleted");

    // 5. Delete user's avatar from storage if exists
    const { data: files } = await supabaseAdmin
      .storage
      .from("avatars")
      .list(userId);

    if (files && files.length > 0) {
      const filePaths = files.map((file) => `${userId}/${file.name}`);
      await supabaseAdmin.storage.from("avatars").remove(filePaths);
      console.log("Avatar files deleted");
    }

    // 6. Delete the auth user (this should be last)
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteUserError) {
      console.error("Error deleting auth user:", deleteUserError);
      throw new Error("Failed to delete user account");
    }
    console.log("Auth user deleted successfully");

    // Note: Purchases are kept for accounting purposes but the profile is anonymized
    // The purchase records will show user_id but the profile data is gone

    return new Response(
      JSON.stringify({ success: true, message: "Account deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in delete-account function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to delete account" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
