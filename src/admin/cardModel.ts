/**
 * cardModel.ts — Modèle de carte côté back-office.
 *
 * En base, le « mode » d'une carte est éclaté en 4 colonnes indépendantes
 * (is_interview, is_ref, is_deep, date_mode) qui peuvent se contredire et
 * rendre une carte invisible. Le back-office n'expose qu'UN choix de mode et
 * écrit lui-même les bonnes colonnes.
 */
import type { Card } from '@/types/game';
import type { Database } from '@/integrations/supabase/types';

export type CardRow = Database['public']['Tables']['cards']['Row'];
export type CardInsert = Database['public']['Tables']['cards']['Insert'];

export interface AdminCard extends Card {
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CardMode = 'normal' | 'interview' | 'deep' | 'ref' | 'date';

export const MODE_ORDER: CardMode[] = ['normal', 'interview', 'deep', 'ref', 'date'];

export const MODE_LABELS: Record<CardMode, string> = {
  normal: 'Partie normale',
  interview: 'Interview',
  deep: 'Questions deep',
  ref: "T'as la réf",
  date: 'Date',
};

/**
 * Le mode est-il jouable dans l'app aujourd'hui ?
 * → Passer deep / ref à `live: true` au moment de leur réactivation dans
 *   l'écran des préférences (PreferencesScreen).
 */
export const MODE_STATUS: Record<CardMode, { live: boolean; note: string }> = {
  normal: { live: true, note: 'En ligne' },
  interview: { live: true, note: 'En ligne · gratuit' },
  deep: { live: false, note: 'En attente de réactivation (Premium)' },
  ref: { live: false, note: 'En attente de réactivation (Premium · groupes)' },
  date: { live: false, note: "Retiré de l'app" },
};

export const PROXIMITY_OPTIONS: { value: Card['proximityLevel'] | null; label: string; hint: string }[] = [
  { value: 'stranger', label: 'Tout le monde', hint: 'Jouable même entre inconnus (recommandé)' },
  { value: 'friend', label: 'Amis', hint: 'Seulement si les joueurs se connaissent un minimum' },
  { value: 'close', label: 'Proches', hint: 'Seulement si tout le groupe se connaît très bien' },
  { value: null, label: 'Non précisé', hint: 'Déconseillé : la carte disparaît aux intensités hautes' },
];

/** Mode d'une carte, dans le même ordre de priorité que le jeu. */
export const getCardMode = (card: Card): CardMode => {
  if (card.isInterview) return 'interview';
  if (card.isRef) return 'ref';
  if (card.isDeep) return 'deep';
  if (card.dateMode === 'exclusive') return 'date';
  return 'normal';
};

/** Applique un mode à une carte en écrivant des colonnes cohérentes. */
export const withMode = <T extends Card>(card: T, mode: CardMode): T => ({
  ...card,
  isInterview: mode === 'interview',
  isRef: mode === 'ref',
  isDeep: mode === 'deep',
  dateMode: mode === 'date' ? 'exclusive' : card.dateMode === 'exclusive' ? undefined : card.dateMode,
  // Une carte de vote n'a de sens qu'en partie normale.
  isVote: mode === 'normal' ? card.isVote : false,
});

export const rowToCard = (row: CardRow): AdminCard => ({
  id: row.id,
  content: row.content,
  alcoholLevel: row.alcohol_level ?? 0,
  sexualLevel: row.sexual_level ?? 0,
  isDeep: !!row.is_deep,
  isVote: !!row.is_vote,
  proximityLevel: (row.proximity_level as Card['proximityLevel']) ?? undefined,
  dateMode: (row.date_mode as Card['dateMode']) ?? undefined,
  explicitlySexual: !!row.explicitly_sexual,
  isPremium: !!row.is_premium,
  isRef: !!row.is_ref,
  isInterview: !!row.is_interview,
  isActive: row.is_active !== false,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const cardToRow = (card: AdminCard): CardInsert => ({
  id: card.id,
  content: card.content.trim(),
  alcohol_level: card.alcoholLevel ?? 0,
  sexual_level: card.sexualLevel ?? 0,
  is_deep: !!card.isDeep,
  is_vote: !!card.isVote,
  proximity_level: card.proximityLevel ?? null,
  date_mode: card.dateMode ?? null,
  explicitly_sexual: !!card.explicitlySexual, // colonne inutilisée par le jeu : valeur conservée
  is_premium: !!card.isPremium,
  is_ref: !!card.isRef,
  is_interview: !!card.isInterview,
  is_active: card.isActive,
});

export const newCardId = (): string =>
  `bo_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

export const emptyCard = (mode: CardMode = 'normal'): AdminCard =>
  withMode(
    {
      id: newCardId(),
      content: '',
      alcoholLevel: 1,
      sexualLevel: 0,
      isVote: false,
      isPremium: false,
      proximityLevel: 'stranger',
      isActive: true,
    },
    mode
  );

/** Texte normalisé, comme le dédoublonnage du jeu. */
export const normalizeContent = (text: string): string =>
  (text || '').trim().toLowerCase().replace(/\s+/g, ' ');
