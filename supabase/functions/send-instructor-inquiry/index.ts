import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InquiryRequest {
  instructorEmail: string;
  instructorName: string;
  studentName: string;
  studentEmail: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Resend inside handler to ensure env var is available
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    const resend = new Resend(apiKey);

    const { 
      instructorEmail, 
      instructorName,
      studentName, 
      studentEmail, 
      subject, 
      message 
    }: InquiryRequest = await req.json();

    // Basic validation
    if (!instructorEmail || !studentName || !studentEmail || !subject || !message) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentEmail) || !emailRegex.test(instructorEmail)) {
      console.error("Invalid email format");
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Sending inquiry to ${instructorEmail} from ${studentEmail}`);

    const emailResponse = await resend.emails.send({
      from: "Cognitio <onboarding@resend.dev>",
      to: [instructorEmail],
      reply_to: studentEmail,
      subject: `[Cognitio] Nueva Consulta: ${subject}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #FA8072, #E9695C); padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Nueva Consulta en Cognitio</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 24px; border: 1px solid #eee; border-top: none;">
            <p style="color: #333; margin: 0 0 16px;">
              Hola ${instructorName || 'Instructor'},
            </p>
            
            <p style="color: #666; margin: 0 0 24px;">
              Has recibido una nueva consulta a través de tu perfil en Cognitio:
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #eee; margin-bottom: 24px;">
              <p style="margin: 0 0 12px; color: #333;">
                <strong>De:</strong> ${studentName} (${studentEmail})
              </p>
              <p style="margin: 0 0 12px; color: #333;">
                <strong>Asunto:</strong> ${subject}
              </p>
              <p style="margin: 0; color: #333;">
                <strong>Mensaje:</strong>
              </p>
              <div style="background: #f5f5f5; padding: 16px; border-radius: 4px; margin-top: 8px;">
                <p style="margin: 0; color: #444; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            
            <p style="color: #888; font-size: 14px; margin: 0;">
              Puedes responder directamente a este email para contactar al estudiante.
            </p>
          </div>
          
          <div style="background: #333; padding: 16px; border-radius: 0 0 8px 8px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              Este mensaje fue enviado a través de Cognitio
            </p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, id: emailResponse.data?.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-instructor-inquiry function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
