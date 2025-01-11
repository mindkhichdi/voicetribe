import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InviteRequest {
  email: string;
  recordingId: string;
  sharedById: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Handling invite request");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, recordingId, sharedById }: InviteRequest = await req.json();
    console.log(`Processing invite for email: ${email}, recordingId: ${recordingId}`);

    // Send email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "VoiceTribe <onboarding@resend.dev>",
        to: [email],
        subject: "You've been invited to listen to a voice recording on VoiceTribe",
        html: `
          <h2>You've been invited to listen to a voice recording!</h2>
          <p>Someone has shared a voice recording with you on VoiceTribe.</p>
          <p>Click the link below to sign up and listen:</p>
          <a href="${req.headers.get("origin")}/login?recording=${recordingId}&email=${email}&action=share" style="display: inline-block; background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Listen to Recording
          </a>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-invite function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);