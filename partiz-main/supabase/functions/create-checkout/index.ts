
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("ERROR: STRIPE_SECRET_KEY not configured");
      throw new Error("Configuration d'abonnement manquante. Contactez le support.");
    }
    logStep("Stripe key verified");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("ERROR: No authorization header");
      throw new Error("Vous devez être connecté pour vous abonner");
    }

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user");
    
    const { data, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError) {
      logStep("ERROR: Auth error", { error: authError.message });
      throw new Error("Session expirée. Reconnectez-vous et réessayez.");
    }
    
    const user = data.user;
    if (!user?.email) {
      logStep("ERROR: No user or email");
      throw new Error("Utilisateur non authentifié ou email manquant");
    }
    
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    logStep("Checking for existing Stripe customer");
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
      
      // Check if customer already has an active subscription
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
      });
      
      if (subscriptions.data.length > 0) {
        logStep("Customer already has active subscription");
        throw new Error("Vous avez déjà un abonnement actif. Gérez-le depuis votre profil.");
      }
    } else {
      logStep("No existing customer found");
    }

    const origin = req.headers.get("origin") || "https://partiz.lovable.app";
    
    logStep("Creating Stripe checkout session");
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Partiz Premium",
              description: "Accès complet à plus de 1000 cartes exclusives"
            },
            unit_amount: 299, // 2.99€ en centimes
            recurring: {
              interval: "week",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/?payment=success`,
      cancel_url: `${origin}/?payment=cancel`,
      automatic_tax: { enabled: false },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    logStep("Checkout session created successfully", { 
      sessionId: session.id, 
      url: session.url ? "✓" : "✗" 
    });

    if (!session.url) {
      throw new Error("Impossible de créer la session de paiement");
    }

    return new Response(JSON.stringify({ 
      url: session.url,
      sessionId: session.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    
    // Return user-friendly error messages
    let friendlyMessage = errorMessage;
    if (errorMessage.includes("Invalid API Key")) {
      friendlyMessage = "Configuration Stripe invalide. Contactez le support.";
    } else if (errorMessage.includes("No such customer")) {
      friendlyMessage = "Erreur client Stripe. Réessayez ou contactez le support.";
    }
    
    return new Response(JSON.stringify({ 
      error: friendlyMessage,
      details: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
