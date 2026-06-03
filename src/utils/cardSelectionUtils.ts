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

export const isCardSuitableForPlayerCount = (card: Card, playerCount: number): boolean => {
  const playerPlaceholders = (card.content.match(/\{player\d+\}/g) || []).length;

  if (playerPlaceholders > playerCount) return false;

  if (playerCount === 2) {
    if (card.isVote) return false;
    const problematicDistribution =
      /distribue.*à qui tu veux(?!.*toi)/i.test(card.content) &&
      !card.content.includes('tout le monde') &&
      !card.content.includes("l'autre");
    if (problematicDistribution) return false;
  }

  if (playerCount >= 3 && card.dateMode === 'exclusive') return false;

  return true;
};

export const filterCardsByRules = (
  cards: Card[],
  preferences: GamePreferences,
  groupProximity: 'low' | 'medium' | 'high',
  isDateMode: boolean,
  playerCount: number
): Card[] => {
  const filtered = cards.filter(card => {
    // Mode "T'as la réf" : uniquement les cartes isRef
    if (preferences.refMode) {
      return !!card.isRef;
    } else {
      if (card.isRef) return false;
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

    // Filtre questions deep
    if (card.isDeep && !preferences.deepQuestions) return false;

    // Filtre date mode
    if (card.dateMode === 'exclusive') {
      if (playerCount > 2) return false;
      if (playerCount === 2 && !preferences.discovery) return false;
    }

    // Filtre votes pour 2 joueurs
    if (card.isVote && playerCount === 2) return false;

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

export const selectOptimalCards = (
  availableCards: Card[],
  preferences: GamePreferences,
  players: Player[],
  relationships?: RelationshipData
): Card[] => {
  const playerCount = players.length;

  const groupProximity =
    relationships && Object.keys(relationships).length > 0
      ? getGroupProximityLevel(players, relationships)
      : 'medium';

  const isDateMode = playerCount === 2 && preferences.discovery === true;

  // 1. Filtrer les cartes inéligibles
  const eligible = filterCardsByRules(
    availableCards,
    preferences,
    groupProximity,
    isDateMode,
    playerCount
  );

  // 2. Calculer le score de chaque carte
  const scored = eligible.map(card => ({
    card,
    score: getCardPriorityScore(card, preferences, groupProximity),
  }));

  // 3. Diviser en 3 paliers : HIGH / MEDIUM / LOW
  //    On définit les seuils en valeurs absolues pour éviter les biais
  const maxScore = Math.max(...scored.map(c => c.score), 1);
  const highThreshold  = maxScore * 0.7;
  const mediumThreshold = maxScore * 0.35;

  const high   = scored.filter(c => c.score >= highThreshold);
  const medium = scored.filter(c => c.score >= mediumThreshold && c.score < highThreshold);
  const low    = scored.filter(c => c.score > 0 && c.score < mediumThreshold);
  // Les cartes avec score = 0 (proximité refusée) sont déjà filtrées

  // 4. Mélanger aléatoirement dans chaque palier
  const shuffledHigh   = shuffleArray(high);
  const shuffledMedium = shuffleArray(medium);
  const shuffledLow    = shuffleArray(low);

  // 5. Entrelacement par type à l'intérieur de chaque palier
  const resultHigh   = interleaveByType(shuffledHigh);
  const resultMedium = interleaveByType(shuffledMedium);
  const resultLow    = interleaveByType(shuffledLow);

  const final = preventConsecutiveSameType([...resultHigh, ...resultMedium, ...resultLow]);

  return final;
};
