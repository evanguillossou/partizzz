import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CardIdeaRequest {
  cardIdea: string;
  playerName?: string;
  gameMode?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cardIdea, playerName, gameMode }: CardIdeaRequest = await req.json();

    console.log("Sending card idea email:", { cardIdea, playerName, gameMode });

    const emailResponse = await resend.emails.send({
      from: "Partiz <onboarding@resend.dev>",
      to: ["contact@partizzz.fr"],
      subject: "Nouvelle idée de carte Partiz",
      html: `
        <h2>Nouvelle idée de carte reçue</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Contenu de la carte :</h3>
          <p style="font-size: 16px; line-height: 1.5; background: white; padding: 15px; border-radius: 4px;">
            ${cardIdea}
          </p>
        </div>
        ${playerName ? `<p><strong>Nom du joueur :</strong> ${playerName}</p>` : ''}
        ${gameMode ? `<p><strong>Mode de jeu :</strong> ${gameMode}</p>` : ''}
        <p><strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 14px;">
          Cette idée a été envoyée depuis l'application Partiz.
        </p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Idée de carte envoyée avec succès !" 
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in submit-card-idea function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Erreur lors de l'envoi de l'idée de carte" 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);