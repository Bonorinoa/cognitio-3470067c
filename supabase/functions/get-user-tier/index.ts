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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
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

    // Check if user is an instructor
    const { data: hasInstructorRole } = await supabase
      .rpc("has_role", { _user_id: user.id, _role: "instructor" });

    if (hasInstructorRole) {
      const dailyLimit = await getTierLimit(supabase, "instructor", 50);
      
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
