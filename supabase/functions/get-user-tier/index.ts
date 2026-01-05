import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to fetch tier limit from database
async function getTierLimit(supabase: any, tierName: string, defaultLimit: number): Promise<number> {
  const { data: tierLimit } = await supabase
    .from("ai_tier_limits")
    .select("daily_limit")
    .eq("tier_name", tierName)
    .single();
  
  return tierLimit?.daily_limit || defaultLimit;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("get-user-tier called");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    console.log("Auth header present:", !!authHeader);
    
    if (!authHeader) {
      // Return free tier for unauthenticated users
      return new Response(JSON.stringify({ tier: "free", dailyLimit: 10 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ tier: "free", dailyLimit: 10 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check for active subscription
    const { data: subscription } = await supabase
      .from("ai_subscriptions")
      .select("bundle, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subscription) {
      const tierName = subscription.bundle === "pro" ? "pro" : subscription.bundle;
      const dailyLimit = await getTierLimit(supabase, tierName, 200);
      
      return new Response(JSON.stringify({ 
        tier: tierName, 
        dailyLimit 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user is an instructor by querying user_roles table directly
    console.log("Checking instructor role for user:", user.id);
    const { data: instructorRole, error: roleError } = await supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", user.id)
      .eq("role", "instructor")
      .maybeSingle();

    if (roleError) {
      console.error("Error checking instructor role:", roleError);
    }

    console.log("Instructor role check result:", instructorRole);

    if (instructorRole) {
      const dailyLimit = await getTierLimit(supabase, "instructor", 50);
      console.log("User is instructor, returning limit:", dailyLimit);
      
      return new Response(JSON.stringify({ 
        tier: "instructor", 
        dailyLimit 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Default to free tier
    const dailyLimit = await getTierLimit(supabase, "free", 10);
    
    return new Response(JSON.stringify({ 
      tier: "free", 
      dailyLimit 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in get-user-tier:", error);
    return new Response(JSON.stringify({ tier: "free", dailyLimit: 10 }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
