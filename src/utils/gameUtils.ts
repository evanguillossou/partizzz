
import { Player, Card } from '../types/game';
import { RelationshipData } from '../types/relationships';
import { selectOptimalCards } from './cardSelectionUtils';
import { supabase } from '@/integrations/supabase/client';
import { cards as localCards } from '@/data/gameData';

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getRandomPlayers = (players: Player[], count: number): Player[] => {
  const shuffled = shuffleArray(players);
  return shuffled.slice(0, count);
};

// Système de rotation équitable des joueurs
export const insertPlayerNames = (
  cardContent: string, 
  players: Player[],
  targetCounts?: Record<string, number>
): { content: string; targetedPlayerIds: string[] } => {
  let content = cardContent;
  
  // Trouver tous les placeholders {player1}, {player2}, etc.
  const playerPlaceholders = content.match(/\{player\d+\}/g) || [];
  
  if (playerPlaceholders.length === 0) {
    return { content, targetedPlayerIds: [] };
  }
  
  // Initialiser les compteurs si non fournis
  const counts = targetCounts || {};
  players.forEach(p => {
    if (counts[p.id] === undefined) counts[p.id] = 0;
  });
  
  // Trier les joueurs par nombre de ciblages (les moins ciblés en premier)
  // Ajouter un peu d'aléatoire parmi les joueurs avec le même compteur
  const sortedPlayers = [...players].sort((a, b) => {
    const diff = (counts[a.id] || 0) - (counts[b.id] || 0);
    if (diff !== 0) return diff;
    // Si égalité, ajouter un peu d'aléatoire
    return Math.random() - 0.5;
  });
  
  const selectedPlayers: Player[] = [];
  const targetedPlayerIds: string[] = [];
  
  // Pour chaque placeholder, assigner le joueur le moins ciblé disponible
  playerPlaceholders.forEach((placeholder) => {
    // Trouver le premier joueur non encore sélectionné pour cette carte
    let selectedPlayer = sortedPlayers.find(p => !selectedPlayers.includes(p));
    
    // Si tous les joueurs sont déjà utilisés, recommencer avec le moins ciblé
    if (!selectedPlayer) {
      selectedPlayer = sortedPlayers[0];
    }
    
    selectedPlayers.push(selectedPlayer);
    targetedPlayerIds.push(selectedPlayer.id);
    content = content.replace(placeholder, selectedPlayer.name);
  });
  
  return { content, targetedPlayerIds };
};

// Fonction legacy pour compatibilité (retourne juste le string)
export const insertPlayerNamesSimple = (cardContent: string, players: Player[]): string => {
  return insertPlayerNames(cardContent, players).content;
};

// Fonction pour récupérer les cartes depuis Supabase
export const getAvailableCardsFromSupabase = async (
  gameSession: any,
  usedCardIds: string[], 
  players?: Player[],
  relationships?: RelationshipData,
  isSubscribed: boolean = false
): Promise<Card[]> => {
  try {
    // Récupérer toutes les cartes actives depuis Supabase
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('is_active', true);
    
    if (error) throw error;
    
    // Transformer les données Supabase vers le format Card
    const allCards: Card[] = data.map(card => ({
      id: card.id,
      content: card.content,
      alcoholLevel: card.alcohol_level || 0,
      sexualLevel: card.sexual_level || 0,
      isDeep: card.is_deep || false,
      isVote: card.is_vote || false,
      proximityLevel: card.proximity_level as 'stranger' | 'friend' | 'close' | undefined,
      dateMode: card.date_mode as 'no' | 'compatible' | 'exclusive' | undefined,
      explicitlySexual: card.explicitly_sexual || false,
      isPremium: card.is_premium || false,
      isRef: card.is_ref || false
    }));
    
    // Filtrer les cartes déjà utilisées
    let availableCards = allCards.filter(card => !usedCardIds.includes(card.id));

    // Filtrer les cartes premium selon l'abonnement
    if (!isSubscribed) {
      availableCards = availableCards.filter(card => !card.isPremium);
    }

    // Si on a les préférences, utiliser le nouvel algorithme intelligent
    if (gameSession.preferences && players) {
      availableCards = selectOptimalCards(
        availableCards, 
        gameSession.preferences, 
        players, 
        relationships
      );
    }

    return availableCards;
  } catch (error) {
    console.warn('Supabase inaccessible, fallback local:', error);
    // Fallback vers les données locales (gameData.ts)
    let available = localCards.filter(card => !usedCardIds.includes(card.id));
    if (!isSubscribed) {
      available = available.filter(card => !card.isPremium);
    }
    if (gameSession.preferences && players) {
      available = selectOptimalCards(available, gameSession.preferences, players, relationships);
    }
    return available;
  }
};

// Fonction de compatibilité avec l'ancien système
export const getAvailableCards = (
  gameSession: any,
  usedCardIds: string[], 
  allCards: Card[],
  players?: Player[],
  relationships?: RelationshipData
): Card[] => {
  // Cette fonction est conservée pour la compatibilité
  // mais devrait être remplacée par getAvailableCardsFromSupabase
  let availableCards = allCards.filter(card => !usedCardIds.includes(card.id));

  if (gameSession.preferences && players) {
    availableCards = selectOptimalCards(
      availableCards, 
      gameSession.preferences, 
      players, 
      relationships
    );
  }

  return availableCards;
};
