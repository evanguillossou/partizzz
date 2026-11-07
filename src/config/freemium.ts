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
// Modes à thème (Interview, Questions deep, T'as la réf) : 15 cartes pour tous.
// Ces questions prennent du temps : 15 cartes font déjà une vraie session.
export const THEMED_GAME_LENGTH = 15;

/**
 * Fonctionnalités réservées au premium :
 *  - refMode : mode à thème "T'as la réf" (groupes)
 *  - deep    : mode à thème "Questions deep"
 *  - votes   : cartes de vote de groupe ("qui dans le groupe…")
 */
export type PremiumFeature = 'refMode' | 'deep' | 'votes';

export const clampIntensityForTier = (level: number, subscribed: boolean): number =>
  subscribed ? level : Math.min(level, FREE_MAX_INTENSITY);

/** Vrai si la partie est un mode à thème (Interview, Questions deep, T'as la réf). */
export const isThemedMode = (
  prefs?: { interviewMode?: boolean; refMode?: boolean; deepMode?: boolean } | null
): boolean => !!(prefs && (prefs.interviewMode || prefs.refMode || prefs.deepMode));

export const getGameLength = (subscribed: boolean, themed = false): number =>
  themed ? THEMED_GAME_LENGTH : subscribed ? PREMIUM_GAME_LENGTH : FREE_GAME_LENGTH;
