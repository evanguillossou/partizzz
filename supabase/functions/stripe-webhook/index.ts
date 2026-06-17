// Partiz — Webhook Stripe (Supabase Edge Function, Deno)
//
// Rôle : à la confirmation d'un paiement Stripe, passe la ligne `subscribers`
// du bon utilisateur en `subscribed = true`. C'est le SEUL endroit autorisé à
// élever un compte en premium (le client ne peut qu'y lire son propre statut).
//
// Secrets attendus (Dashboard → Edge Functions → Secrets, ou `supabase secrets set`) :
//   STRIPE_SECRET_KEY        (sk_live_… en production)
//   STRIPE_WEBHOOK_SECRET    (whsec_… donné par Stripe à la création du endpoint)
// SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont injectés automatiquement.
//
// Mapping utilisateur : le front ouvre le Payment Link avec
// ?client_reference_id=<user.id>, que Stripe renvoie dans la session.

import Stripe from 'https://esm.sh/stripe@16.12.0?target=denonext';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
});
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Upsert la ligne subscribers de l'utilisateur (clé : user_id).
async function upsertByUser(userId: string, patch: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('subscribers')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select('id');
  if (error) { console.error('update by user failed', error); return; }
  if (!data || data.length === 0) {
    const { error: insErr } = await supabase
      .from('subscribers')
      .insert({ user_id: userId, ...patch });
    if (insErr) console.error('insert by user failed', insErr);
  }
}

// Met à jour par customer Stripe (renouvellement / résiliation).
async function updateByCustomer(customerId: string, patch: Record<string, unknown>) {
  const { error } = await supabase
    .from('subscribers')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('stripe_customer_id', customerId);
  if (error) console.error('update by customer failed', error);
}

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature!, webhookSecret);
  } catch (err) {
    return new Response(`Bad signature: ${(err as Error).message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      // Paiement validé : on identifie l'utilisateur et on l'abonne.
      case 'checkout.session.completed': {
        const s = event.data.object as Stripe.Checkout.Session;
        const userId = s.client_reference_id;
        if (!userId) break;
        const customerId = (s.customer as string) ?? null;
        const email = s.customer_details?.email ?? s.customer_email ?? null;

        let end: string | null = null;
        if (s.mode === 'subscription' && s.subscription) {
          const sub = await stripe.subscriptions.retrieve(s.subscription as string);
          end = new Date(sub.current_period_end * 1000).toISOString();
        }

        await upsertByUser(userId, {
          subscribed: true,
          subscription_tier: 'Premium',
          subscription_end: end,
          stripe_customer_id: customerId,
          email,
        });
        break;
      }

      // Renouvellement / changement d'état de l'abonnement.
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const active = sub.status === 'active' || sub.status === 'trialing';
        await updateByCustomer(sub.customer as string, {
          subscribed: active,
          subscription_tier: active ? 'Premium' : null,
          subscription_end: active
            ? new Date(sub.current_period_end * 1000).toISOString()
            : null,
        });
        break;
      }

      // Résiliation / fin d'abonnement : retour au gratuit.
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        await updateByCustomer(sub.customer as string, {
          subscribed: false,
          subscription_tier: null,
          subscription_end: null,
        });
        break;
      }
    }
  } catch (err) {
    console.error('handler error', err);
    return new Response('handler error', { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
