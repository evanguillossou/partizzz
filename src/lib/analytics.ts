import { track } from '@vercel/analytics';

/**
 * analytics.ts — événements produit Partiz (Vercel Web Analytics).
 *
 * Objectif : suivre l'entonnoir accueil → partie lancée → intention premium →
 * checkout ouvert, pour piloter la campagne (quelle source convertit).
 *
 * - `track()` est SANS EFFET en local et n'envoie des données qu'en production
 *   Vercel, avec « Web Analytics » activé dans le dashboard du projet.
 * - Aucune donnée personnelle n'est envoyée (pas de cookie, RGPD-friendly).
 * - On n'échoue jamais l'app pour de l'analytics (try/catch).
 */
export type PartizEvent = 'partie_lancee' | 'clic_premium' | 'checkout_ouvert';

export const trackEvent = (
  event: PartizEvent,
  props?: Record<string, string | number | boolean | null>
): void => {
  try {
    track(event, props);
  } catch {
    /* analytics best-effort : ne jamais bloquer l'expérience */
  }
};
