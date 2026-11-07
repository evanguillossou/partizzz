/**
 * cardSelectionUtils.ts — VERSION AMÉLIORÉE
 *
 * CORRECTIONS vs version originale :
 *  1. Bug scoring : quand pref = 0, une carte à niveau 0 obtenait 10 pts
 *     au lieu de 100 (correspondance parfaite). Corrigé.
 *  2. Randomisation : les cartes étaient triées strictement par score →
 *     même ordre à chaque partie. Maintenant mélangées par palier de score.
 *  3. Variété : `selectOptimalCards` entrelace les types de cartes pour
 *     éviter d'enchaîner 5 questions deep ou 5 défis boisson d'affilée.
 */

import { Card, GamePreferences, Player } from '../types/game';
import { FREE_MAX_INTENSITY, isThemedMode } from '../config/freemium';
import { RelationshipData } from '../types/relationships';
import { getGroupProximityLevel } from './relationshipUtils';

// ─── Utilitaires internes ──────────────────────────────────────────────────

/** Fisher-Yates shuffle (ne modifie pas le tableau original) */
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Classe une carte dans un type broad pour la gestion de la variété.
 * L'ordre d'importance détermine la priorité (vote > deep > sexual > …).
 */
const getCardType = (card: Card): string => {
  if (card.isVote) return 'vote';
  if (card.isDeep) return 'deep';
  if ((card.sexualLevel ?? 0) >= 3) return 'sexual';
  if ((card.alcoholLevel ?? 0) >= 3) return 'drinking';
  if (card.dateMode === 'exclusive') return 'date';
  return 'casual';
};

// ─── Score de priorité ─────────────────────────────────────────────────────

/**
 * Calcule le score d'une carte selon les préférences et le contexte.
 *
 * Retourne 0 si la carte n'est pas éligible (proximité insuffisante).
 *
 * @param card            La carte à évaluer
 * @param preferences     Préférences du joueur (alcool, sexe, deep…)
 * @param groupProximity  Niveau de proximité calculé du groupe
 */
export const getCardPriorityScore = (
  card: Card,
  preferences: GamePreferences,
  groupProximity: 'low' | 'medium' | 'high'
): number => {
  let score = 0;

  // ── Scoring alcool ────────────────────────────────────────────────
  const cardAlcohol = card.alcoholLevel ?? 0;
  const prefAlcohol = preferences.alcoholLevel;

  if (prefAlcohol === 0) {
    // L'utilisateur ne veut pas boire → seules les cartes à 0 sont bien notées
    score += cardAlcohol === 0 ? 100 : 0;
  } else {
    if (cardAlcohol === prefAlcohol) {
      score += 100; // Correspondance exacte
    } else if (cardAlcohol < prefAlcohol) {
      // Plus on s'éloigne vers le bas, moins de points
      const distance = prefAlcohol - cardAlcohol;
      score += Math.max(0, 70 - distance * 20);
    }
    // Les cartes au-dessus du niveau sont filtrées en amont (filterCardsByRules)
  }

  // ── Scoring sexuel ────────────────────────────────────────────────
  const cardSexual = card.sexualLevel ?? 0;
  const prefSexual = preferences.sexualLevel;

  if (prefSexual === 0) {
    score += cardSexual === 0 ? 100 : 0;
  } else {
    if (cardSexual === prefSexual) {
      score += 100;
    } else if (cardSexual < prefSexual) {
      const distance = prefSexual - cardSexual;
      score += Math.max(0, 70 - distance * 20);
    }
  }

  // ── Scoring proximité ─────────────────────────────────────────────
  if (card.proximityLevel) {
    const allowed: Record<string, string[]> = {
      stranger: ['low', 'medium', 'high'],
      friend: ['medium', 'high'],
      close: ['high'],
    };

    if (!allowed[card.proximityLevel]?.includes(groupProximity)) {
      return 0; // Carte non éligible pour ce niveau de proximité
    }

    // Bonus si la proximité de la carte correspond exactement au groupe
    const exactProximityMatch =
      (card.proximityLevel === 'stranger' && groupProximity === 'low') ||
      (card.proximityLevel === 'friend'   && groupProximity === 'medium') ||
      (card.proximityLevel === 'close'    && groupProximity === 'high');
    score += exactProximityMatch ? 40 : 20;
  }

  // ── Bonus questions deep ──────────────────────────────────────────
  if (card.isDeep && preferences.deepQuestions) score += 30;

  // ── Bonus votes ───────────────────────────────────────────────────
  if (card.isVote && preferences.votes) score += 30;

  return score;
};

// ─── Filtre d'éligibilité ──────────────────────────────────────────────────

// Cartes pensées pour un groupe (≥3 joueurs) : tour de table, vote, jugement
// collectif ("le groupe juge", "selon le groupe"), désignation par majorité…
// Aucune ne tient à 2 (le "groupe" = une seule personne). On exclut dès qu'un
// marqueur collectif apparaît, peu importe la tournure de la phrase.
// Chaque sous-regex cible une famille de tournures de groupe. Les garde-fous
// (?!…) et le choix "la personne" (défini, jamais "une personne") protègent
// les cartes valides à 2 :
//   • "choisis UNE personne et regardez-vous" (duel à 2) → OK
//   • "la personne à ta droite / de ton choix" → OK
//   • "la personne la plus IMPORTANTE de ton téléphone" → OK
//   • "les autres" au sens "les autres gens" (deep) → OK
//   • "choisit UN artiste", "choisissez chacun un objet" → OK
// NB : "distribue à qui tu veux" est jouable à 2 (l'autre = seule cible).
const GROUP_PATTERNS: RegExp[] = [
  // Mécaniques de groupe explicites
  /tour de table|en cercle|\btout le monde\b|\bgroupe\b|\bmajorité\b/i,
  /\bvote\b|\bvotez\b|\bvotent\b|\bvoté\b|\bon vote\b|du vote/i,
  // "chacun des joueurs/participants", "chaque personne/joueur" → ≥3 joueurs
  /chacun des (joueurs|participants?|membres|autres)/i,
  /chaque (personne|joueur|participant)/i,
  // "les autres" SUIVI d'une action de groupe (pas "les autres gens"/"comprennent")
  /les autres (devinent|devinez|votent|votez|jugent|jugez|notent|notez|décident|décidez|boivent|trinquent|choisissent|choisissez|désignent|comptent|miment|imitent|distribuent|pointent|répondent|valident)/i,
  // Désignation par superlatif (= comparaison entre ≥3 joueurs)
  /le joueur le plus|la personne avec le plus|la personne la plus(?! importante)/i,
  /la personne dont[^.!?]*(distribue|distribuent|boit|boivent)/i,
  // Verbe de désignation visant "quelqu'un" ou "la personne" (définie)
  /(distribue|distribuez|donne|donnez|offre|file|désigne|désignez|choisis|choisit|choisissez|pointe|pointez|cible|vise|fais boire|fait boire)[^.!?]*(\bquelqu['’]un\b|\bla personne\b)/i,
];

/**
 * Explique pourquoi une carte ne sort PAS pour ce nombre de joueurs.
 * Retourne null si la carte convient. Source unique de vérité : le jeu
 * (isCardSuitableForPlayerCount) et le back-office s'appuient dessus.
 */
export const explainPlayerCountUnsuitability = (card: Card, playerCount: number): string | null => {
  // Compte les joueurs DISTINCTS référencés (pas les occurrences) : une carte
  // qui répète "{player2}" reste une carte à 2 joueurs.
  const distinctPlayers = new Set(card.content.match(/\{player\d+\}/g) || []).size;
  if (distinctPlayers > playerCount) {
    return `elle nomme ${distinctPlayers} joueurs différents`;
  }

  if (playerCount === 2) {
    if (card.isVote) return 'carte de vote (réservée aux groupes)';
    for (const re of GROUP_PATTERNS) {
      const match = card.content.match(re);
      if (match) return `formulation de groupe : « ${match[0]} »`;
    }
  }

  if (playerCount >= 3 && card.dateMode === 'exclusive') {
    return 'carte du mode date (couples uniquement)';
  }

  return null;
};

export const isCardSuitableForPlayerCount = (card: Card, playerCount: number): boolean =>
  explainPlayerCountUnsuitability(card, playerCount) === null;

/**
 * Filtre d'accès selon l'abonnement. Sans abonnement : pas de cartes Premium,
 * et rien au-dessus de l'intensité gratuite (3/5) — même avec la tolérance +1
 * appliquée aux couples, qui laissait passer des cartes de niveau 4 en gratuit.
 */
export const filterCardsForTier = (cards: Card[], isSubscribed: boolean): Card[] =>
  isSubscribed
    ? cards
    : cards.filter(
        card =>
          !card.isPremium &&
          (card.alcoholLevel ?? 0) <= FREE_MAX_INTENSITY &&
          (card.sexualLevel ?? 0) <= FREE_MAX_INTENSITY
      );

export const filterCardsByRules = (
  cards: Card[],
  preferences: GamePreferences,
  groupProximity: 'low' | 'medium' | 'high',
  isDateMode: boolean,
  playerCount: number
): Card[] => {
  const filtered = cards.filter(card => {
    // Mode "Interview" : uniquement les cartes isInterview
    if (preferences.interviewMode) {
      return !!card.isInterview;
    }
    if (card.isInterview) return false;

    // Mode "T'as la réf" : uniquement les cartes isRef
    if (preferences.refMode) {
      return !!card.isRef;
    } else {
      if (card.isRef) return false;
    }

    // Mode à thème "Questions deep" : uniquement les cartes isDeep, avec les
    // filtres joueurs / intensité / proximité ci-dessous. Hors de ce mode, les
    // cartes deep ne sortent que si l'ancien réglage deepQuestions est actif.
    if (preferences.deepMode) {
      if (!card.isDeep) return false;
    } else if (card.isDeep && !preferences.deepQuestions) {
      return false;
    }

    if (!isCardSuitableForPlayerCount(card, playerCount)) return false;

    // Filtre alcool
    const cardAlcohol = card.alcoholLevel ?? 0;
    if (cardAlcohol > 0) {
      const tolerance = playerCount === 2 ? 1 : 0;
      if (cardAlcohol > preferences.alcoholLevel + tolerance) return false;
    }

    // Filtre sexuel
    const cardSexual = card.sexualLevel ?? 0;
    if (cardSexual > 0) {
      const tolerance = playerCount === 2 ? 1 : 0;
      if (cardSexual > preferences.sexualLevel + tolerance) return false;
    }

    // Filtre proximité
    if (card.proximityLevel) {
      const allowed: Record<string, string[]> = {
        stranger: ['low', 'medium', 'high'],
        friend: ['medium', 'high'],
        close: ['high'],
      };
      const ok = allowed[card.proximityLevel]?.includes(groupProximity);
      if (!ok) {
        // Pour les couples, on accepte les cartes 'friend' même en mode 'low'
        if (!(playerCount === 2 && card.proximityLevel === 'friend' && groupProximity === 'low')) {
          return false;
        }
      }
    }

    // Filtre date mode
    if (card.dateMode === 'exclusive') {
      if (playerCount > 2) return false;
      if (playerCount === 2 && !preferences.discovery) return false;
    }

    // Cartes de vote : réservées aux groupes ET à l'option "Cartes votes de
    // groupe" (Premium). Sans l'option, elles ne sortent pas — avant, elles
    // sortaient pour tout le monde et l'option Premium ne servait à rien.
    if (card.isVote && (playerCount === 2 || !preferences.votes)) return false;

    return true;
  });

  return filtered;
};

// ─── Sélection optimale avec variété ──────────────────────────────────────

/**
 * Entrelace les cartes par type pour éviter les répétitions de catégorie.
 *
 * Exemple : [deep, casual, deep, casual, drinking, deep, casual, …]
 * plutôt que : [deep, deep, deep, deep, deep, casual, casual, …]
 */
const interleaveByType = (cards: { card: Card; score: number }[]): Card[] => {
  // Grouper par type
  const groups: Record<string, Card[]> = {};
  cards.forEach(({ card }) => {
    const type = getCardType(card);
    if (!groups[type]) groups[type] = [];
    groups[type].push(card);
  });

  const result: Card[] = [];
  const types = Object.keys(groups);

  // Round-robin sur les types tant qu'il reste des cartes
  let remaining = cards.length;
  while (remaining > 0) {
    let added = false;
    for (const type of types) {
      if (groups[type].length > 0) {
        result.push(groups[type].shift()!);
        remaining--;
        added = true;
      }
    }
    if (!added) break; // Sécurité anti-boucle infinie
  }

  return result;
};

/**
 * Évite d'enchaîner plus de `maxConsecutive` cartes du même type en
 * réordonnant le moins possible (tire la prochaine carte de type différent
 * depuis le reste de la file). Préserve l'ordre de priorité par palier.
 */
const preventConsecutiveSameType = (cards: Card[], maxConsecutive = 2): Card[] => {
  const result: Card[] = [];
  const pool = [...cards];
  let streak = 0;
  let lastType: string | null = null;

  while (pool.length > 0) {
    const topType = getCardType(pool[0]);

    if (lastType !== null && topType === lastType && streak >= maxConsecutive) {
      const altIndex = pool.findIndex(c => getCardType(c) !== lastType);
      if (altIndex === -1) {
        result.push(...pool.splice(0));
        break;
      }
      const [alt] = pool.splice(altIndex, 1);
      result.push(alt);
      streak = 1;
      lastType = getCardType(alt);
    } else {
      const card = pool.shift()!;
      const cardType = getCardType(card);
      streak = cardType === lastType ? streak + 1 : 1;
      lastType = cardType;
      result.push(card);
    }
  }

  return result;
};

/**
 * Cartes réellement jouables pour une configuration, avec leur score : même
 * pipeline que la partie (dédoublonnage, règles d'éligibilité, score > 0).
 * Source unique utilisée par le tirage ET par le tableau de bord du back-office.
 */
export const getPlayableCards = (
  availableCards: Card[],
  preferences: GamePreferences,
  playerCount: number,
  groupProximity: 'low' | 'medium' | 'high' = 'medium'
): { card: Card; score: number }[] => {
  const isDateMode = playerCount === 2 && preferences.discovery === true;

  // 1. Filtrer les cartes inéligibles
  const eligible = filterCardsByRules(availableCards, preferences, groupProximity, isDateMode, playerCount);

  // 2. Dédoublonnage par CONTENU : deux cartes au texte identique ne doivent
  //    jamais tomber 2× dans la même partie. On garde la 1re occurrence.
  //    Fait APRÈS le filtre : sinon une jumelle d'un autre mode (non jouable
  //    ici) pouvait éliminer la bonne carte, et le texte ne sortait nulle part.
  const seenContent = new Set<string>();
  const deduped = eligible.filter(card => {
    const key = (card.content || '').trim().toLowerCase().replace(/\s+/g, ' ');
    if (!key || seenContent.has(key)) return false;
    seenContent.add(key);
    return true;
  });

  // 3. Scorer chaque carte. En partie normale, on écarte les scores nuls
  //    (cartes très en dessous de l'intensité demandée). Dans un mode à thème
  //    (Interview, Deep, Réf), le thème prime : sinon un joueur aux curseurs
  //    d'intensité 4-5 tombait sur un mode Interview vide (0 carte sur 30).
  const themed = isThemedMode(preferences);
  return deduped
    .map(card => ({ card, score: getCardPriorityScore(card, preferences, groupProximity) }))
    .filter(c => c.score > 0 || themed);
};

export const selectOptimalCards = (
  availableCards: Card[],
  preferences: GamePreferences,
  players: Player[],
  relationships?: RelationshipData,
  seen?: Map<string, number>
): Card[] => {
  const playerCount = players.length;

  const groupProximity =
    relationships && Object.keys(relationships).length > 0
      ? getGroupProximityLevel(players, relationships)
      : 'medium';

  // 0-2. Cartes jouables pour cette configuration, avec leur score
  const scored = getPlayableCards(availableCards, preferences, playerCount, groupProximity);

  // 3. Tri aléatoire PONDÉRÉ par le score (Efraimidis–Spirakis : clé = u^(1/poids)).
  //    Chaque partie pioche un mélange DIFFÉRENT dans TOUT le pool éligible, avec
  //    un biais vers les cartes les plus pertinentes. Fini le "toujours les mêmes
  //    15 cartes" : on ne tronque plus un deck trié par score, on échantillonne.
  const weighted = scored
    .map(c => ({ card: c.card, k: Math.pow(Math.random(), 1 / Math.max(1, c.score)) }))
    .sort((a, b) => b.k - a.k)
    .map(x => x.card);

  // 4. Mémoire des cartes déjà jouées (sur l'appareil) : les cartes jamais vues
  //    passent d'abord ; quand il n'en reste plus assez, les plus anciennement
  //    vues reviennent en premier. Chaque bloc est entrelacé séparément pour
  //    qu'une carte déjà vue ne remonte jamais devant une carte nouvelle.
  if (seen && seen.size > 0) {
    const fresh = weighted.filter(card => !seen.has(card.id));
    const replay = weighted
      .filter(card => seen.has(card.id))
      .sort((a, b) => (seen.get(a.id) ?? 0) - (seen.get(b.id) ?? 0));
    return [...preventConsecutiveSameType(fresh), ...preventConsecutiveSameType(replay)];
  }

  // 5. Éviter d'enchaîner trop de cartes du même type
  return preventConsecutiveSameType(weighted);
};
