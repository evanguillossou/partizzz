/**
 * premium.ts — Paiement Stripe via Payment Link (approche "no-code", comme Givrr).
 *
 * En prod (live) : définir VITE_STRIPE_LINK_WEEKLY (lien Payment Link LIVE)
 * et VITE_STRIPE_PORTAL_URL (portail client Stripe) dans les variables
 * d'environnement de l'hébergeur, et dans .env en local.
 *
 * Le webhook Stripe (Edge Function `stripe-webhook`) lit le client_reference_id
 * attaché à l'URL pour savoir quel utilisateur passer en premium.
 */

const WEEKLY_LINK: string = import.meta.env.VITE_STRIPE_LINK_WEEKLY || '';

// Portail client Stripe (gestion / résiliation). Lien no-code à activer dans
// Stripe → Settings → Billing → Customer portal.
export const STRIPE_PORTAL_URL: string = import.meta.env.VITE_STRIPE_PORTAL_URL || '';

/** True si un lien de paiement est configuré. */
export const hasStripeConfigured = (): boolean => !!WEEKLY_LINK;

/**
 * Construit l'URL de paiement en attachant l'id utilisateur via
 * client_reference_id — c'est ce que le webhook lit pour upgrader le bon compte.
 * Retourne '' si aucun lien n'est configuré.
 */
export function checkoutUrl(userId: string): string {
  if (!WEEKLY_LINK) return '';
  const sep = WEEKLY_LINK.includes('?') ? '&' : '?';
  return `${WEEKLY_LINK}${sep}client_reference_id=${encodeURIComponent(userId)}`;
}
