/**
 * freemium.ts — Configuration centrale du modèle gratuit / premium
 *
 * Principe : le gratuit reste pleinement jouable (pool basique, intensité
 * modérée, parties correctes). Le premium est une extension naturelle —
 * jamais une friction intrusive. Toute option verrouillée renvoie vers
 * l'écran d'abonnement uniquement sur tap explicite de l'utilisateur.
 */

// ── Intensité (alcool & sexuel) ──────────────────────────────────────────────
// Le gratuit plafonne à 3/5 ; les niveaux 4-5 (cartes "intenses") sont premium.
export const FREE_MAX_INTENSITY = 3;
export const PREMIUM_MAX_INTENSITY = 5;

// ── Longueur de partie ───────────────────────────────────────────────────────
// Le gratuit a des parties plus courtes ; le premium des parties plus longues.
export const FREE_GAME_LENGTH = 15;
export const PREMIUM_GAME_LENGTH = 30;

/**
 * Fonctionnalités "perso avancée" réservées au premium pour les groupes :
 *  - refMode    : mode "T'as la réf" (mode avancé à part entière)
 *  - deep       : questions profondes en groupe
 *  - votes      : cartes de vote de groupe ("qui dans le groupe…")
 *
 * Les couples conservent leurs modes deep / découverte gratuitement
 * (cœur de l'expérience à 2).
 */
export type PremiumFeature = 'refMode' | 'deep' | 'votes';

export const clampIntensityForTier = (level: number, subscribed: boolean): number =>
  subscribed ? level : Math.min(level, FREE_MAX_INTENSITY);

export const getGameLength = (subscribed: boolean): number =>
  subscribed ? PREMIUM_GAME_LENGTH : FREE_GAME_LENGTH;
