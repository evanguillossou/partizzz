/**
 * stats.ts — Calculs du tableau de bord du back-office.
 *
 * Tout passe par les MÊMES fonctions que le jeu (filterCardsForTier,
 * getPlayableCards, explainPlayerCountUnsuitability) : un chiffre affiché ici
 * est exactement ce qu'un joueur verra.
 */
import type { GamePreferences } from '@/types/game';
import {
  explainPlayerCountUnsuitability,
  filterCardsForTier,
  getPlayableCards,
} from '@/utils/cardSelectionUtils';
import { FREE_MAX_INTENSITY, getGameLength, isThemedMode } from '@/config/freemium';
import { AdminCard, CardMode, MODE_ORDER, MODE_STATUS, getCardMode } from './cardModel';

/**
 * Objectifs exprimés en « nombre de parties sans revoir une carte » (le jeu
 * mémorise les cartes déjà jouées sur chaque téléphone).
 *  - Palier 1 : 4 parties → jouable (gratuit) / intéressant (Premium)
 *  - Palier 2 : 6 parties → confortable
 */
export const TARGET_GAMES = { level1: 4, level2: 6 };

const BASE: GamePreferences = {
  alcoholLevel: 2,
  sexualLevel: 2,
  deepQuestions: false,
  votes: false,
  discovery: false,
  refMode: false,
  interviewMode: false,
  deepMode: false,
};
const MAX: GamePreferences = { ...BASE, alcoholLevel: 5, sexualLevel: 5 };

export interface PoolConfig {
  id: string;
  mode: CardMode;
  label: string;
  detail: string;
  players: number;
  premium: boolean;
  prefs: GamePreferences;
}

/** Les configurations de jeu suivies par le tableau de bord. */
export const POOL_CONFIGS: PoolConfig[] = [
  { id: 'free-2', mode: 'normal', label: 'Gratuit · 2 joueurs', detail: 'réglages par défaut', players: 2, premium: false, prefs: BASE },
  { id: 'free-g', mode: 'normal', label: 'Gratuit · groupe', detail: 'réglages par défaut', players: 4, premium: false, prefs: BASE },
  { id: 'prem-2', mode: 'normal', label: 'Premium · 2 joueurs', detail: 'intensité max', players: 2, premium: true, prefs: MAX },
  { id: 'prem-g', mode: 'normal', label: 'Premium · groupe', detail: 'intensité max · votes activés', players: 4, premium: true, prefs: { ...MAX, votes: true } },
  { id: 'itw', mode: 'interview', label: 'Interview', detail: 'gratuit · tous joueurs', players: 4, premium: false, prefs: { ...BASE, interviewMode: true } },
  { id: 'deep-2', mode: 'deep', label: 'Questions deep · 2 joueurs', detail: 'Premium', players: 2, premium: true, prefs: { ...BASE, deepMode: true } },
  { id: 'deep-g', mode: 'deep', label: 'Questions deep · groupe', detail: 'Premium', players: 4, premium: true, prefs: { ...BASE, deepMode: true } },
  { id: 'ref-g', mode: 'ref', label: "T'as la réf · groupe", detail: 'Premium', players: 4, premium: true, prefs: { ...BASE, refMode: true } },
];

/** Carte réservée aux abonnés : marquée Premium, ou intensité au-dessus du gratuit. */
export const isPremiumOnly = (card: AdminCard): boolean =>
  !!card.isPremium ||
  (card.alcoholLevel ?? 0) > FREE_MAX_INTENSITY ||
  (card.sexualLevel ?? 0) > FREE_MAX_INTENSITY;

const playableIds = (cards: AdminCard[], cfg: PoolConfig, proximity: 'medium' | 'high' = 'medium') =>
  new Set(
    getPlayableCards(filterCardsForTier(cards, cfg.premium), cfg.prefs, cfg.players, proximity).map(p => p.card.id)
  );

// ─── Cartes par mode ────────────────────────────────────────────────────────

export interface ModeCount {
  mode: CardMode;
  free: number;
  premium: number;
  total: number;
  inactive: number;
}

export const countByMode = (cards: AdminCard[]): ModeCount[] =>
  MODE_ORDER.map(mode => {
    const inMode = cards.filter(c => getCardMode(c) === mode);
    const active = inMode.filter(c => c.isActive);
    const premium = active.filter(isPremiumOnly).length;
    return {
      mode,
      free: active.length - premium,
      premium,
      total: active.length,
      inactive: inMode.length - active.length,
    };
  });

// ─── Stock réellement jouable par configuration ─────────────────────────────

export interface PoolResult {
  config: PoolConfig;
  size: number;
  perGame: number;
  target1: number;
  target2: number;
  /** Cartes réservées aux abonnés présentes dans ce stock (configs Premium). */
  exclusive: number;
  live: boolean;
  level: 'short' | 'level1' | 'level2';
}

export const computePool = (cards: AdminCard[], config: PoolConfig): PoolResult => {
  const active = cards.filter(c => c.isActive);
  const ids = playableIds(active, config);
  const playable = active.filter(c => ids.has(c.id));
  const perGame = getGameLength(config.premium, isThemedMode(config.prefs));
  const target1 = perGame * TARGET_GAMES.level1;
  const target2 = perGame * TARGET_GAMES.level2;
  const size = playable.length;
  return {
    config,
    size,
    perGame,
    target1,
    target2,
    exclusive: config.premium ? playable.filter(isPremiumOnly).length : 0,
    live: MODE_STATUS[config.mode].live,
    level: size >= target2 ? 'level2' : size >= target1 ? 'level1' : 'short',
  };
};

export const computeAllPools = (cards: AdminCard[]): PoolResult[] =>
  POOL_CONFIGS.map(cfg => computePool(cards, cfg));

// ─── Objectifs de production (palier 1) ─────────────────────────────────────

export interface ProductionGoal {
  key: string;
  label: string;
  hint: string;
  missing: number;
  live: boolean;
}

/**
 * Cartes à écrire pour atteindre le palier 1. Une carte qui marche à 2 joueurs
 * compte aussi pour les groupes : on prend donc le plus grand manque des deux
 * configurations (et non leur somme).
 */
export const computeProductionGoals = (pools: PoolResult[]): ProductionGoal[] => {
  const gap = (id: string) => {
    const p = pools.find(x => x.config.id === id);
    return p ? Math.max(0, p.target1 - p.size) : 0;
  };
  return [
    { key: 'free', label: 'Partie normale · gratuites', hint: 'qui marchent à 2 joueurs, intensité 0 à 3', missing: Math.max(gap('free-2'), gap('free-g')), live: true },
    { key: 'premium', label: 'Partie normale · Premium', hint: 'qui marchent à 2 joueurs, surtout intensité 3 à 5', missing: Math.max(gap('prem-2'), gap('prem-g')), live: true },
    { key: 'itw', label: 'Interview', hint: 'questions façon interview TV', missing: gap('itw'), live: true },
    { key: 'deep', label: 'Questions deep', hint: 'qui marchent à 2 joueurs', missing: Math.max(gap('deep-2'), gap('deep-g')), live: MODE_STATUS.deep.live },
    { key: 'ref', label: "T'as la réf", hint: 'battles de culture pop, groupes', missing: gap('ref-g'), live: MODE_STATUS.ref.live },
  ];
};

// ─── Visibilité d'une carte ─────────────────────────────────────────────────

/** Configurations élargies pour décider si une carte sort « quelque part ». */
const VISIBILITY_CONFIGS: { cfg: PoolConfig; proximity: 'medium' | 'high' }[] = (() => {
  const list: { cfg: PoolConfig; proximity: 'medium' | 'high' }[] = [];
  for (const premium of [false, true]) {
    for (const players of [2, 4]) {
      for (const level of premium ? [2, 3, 5] : [2, 3]) {
        for (const proximity of ['medium', 'high'] as const) {
          list.push({
            proximity,
            cfg: {
              id: `vis-${premium}-${players}-${level}-${proximity}`,
              mode: 'normal',
              label: '',
              detail: '',
              players,
              premium,
              prefs: { ...BASE, alcoholLevel: level, sexualLevel: level, votes: premium && players > 2 },
            },
          });
        }
      }
    }
  }
  return list;
})();

/** Ids des cartes ACTIVES d'un mode en ligne qui ne sortent dans aucune configuration. */
export const findInvisibleCardIds = (cards: AdminCard[]): Set<string> => {
  const active = cards.filter(c => c.isActive);
  const visible = new Set<string>();
  for (const { cfg, proximity } of VISIBILITY_CONFIGS) {
    playableIds(active, cfg, proximity).forEach(id => visible.add(id));
  }
  for (const cfg of POOL_CONFIGS.filter(c => c.mode !== 'normal')) {
    playableIds(active, cfg).forEach(id => visible.add(id));
  }
  return new Set(
    active
      .filter(c => MODE_STATUS[getCardMode(c)].live && !visible.has(c.id))
      .map(c => c.id)
  );
};

export interface CardPlacement {
  config: PoolConfig;
  plays: boolean;
  reason?: string;
}

/** Pourquoi une carte ne sort pas dans une configuration (indication lisible). */
const explainExclusion = (card: AdminCard, cfg: PoolConfig): string => {
  if (!cfg.premium && isPremiumOnly(card)) {
    return card.isPremium ? 'carte Premium' : 'intensité 4-5 réservée Premium';
  }
  const playerReason = explainPlayerCountUnsuitability(card, cfg.players);
  if (playerReason) return playerReason;
  if (card.isVote && (cfg.players === 2 || !cfg.prefs.votes)) {
    return "carte de vote : groupes avec l'option votes";
  }
  const tolerance = cfg.players === 2 ? 1 : 0;
  if ((card.alcoholLevel ?? 0) > cfg.prefs.alcoholLevel + tolerance) return "alcool au-dessus du réglage par défaut";
  if ((card.sexualLevel ?? 0) > cfg.prefs.sexualLevel + tolerance) return 'intensité sexuelle au-dessus du réglage par défaut';
  if (card.proximityLevel === 'close') return 'réservée aux groupes très proches';
  if (!card.proximityLevel) return 'trop douce pour ce réglage : choisis une proximité';
  return 'écartée par les règles du jeu';
};

/** Où une carte (même non enregistrée) sortira, configuration par configuration. */
export const getCardPlacements = (card: AdminCard): CardPlacement[] => {
  const mode = getCardMode(card);
  const asActive = { ...card, isActive: true };
  return POOL_CONFIGS.filter(cfg => cfg.mode === mode).map(config => {
    const plays = playableIds([asActive], config).has(card.id);
    return { config, plays, reason: plays ? undefined : explainExclusion(card, config) };
  });
};
