import { Card, GamePreferences, Player } from '../types/game';
import { RelationshipData } from '../types/relationships';
import { getGroupProximityLevel } from './relationshipUtils';

export const getCardPriorityScore = (
  card: Card,
  preferences: GamePreferences,
  groupProximity: 'low' | 'medium' | 'high'
): number => {
  let score = 0;
  
  // Score pour l'intensité des gorgées - privilégier celles qui matchent exactement
  if (card.alcoholLevel !== undefined && preferences.alcoholLevel > 0) {
    if (card.alcoholLevel === preferences.alcoholLevel) {
      score += 100; // Priorité maximale pour match exact
    } else if (card.alcoholLevel <= preferences.alcoholLevel) {
      // Plus on s'éloigne du niveau souhaité, moins on a de points
      const distance = Math.abs(card.alcoholLevel - preferences.alcoholLevel);
      score += Math.max(0, 50 - (distance * 10));
    }
  } else if (card.alcoholLevel === 0) {
    score += 10; // Les cartes à 0 peuvent toujours être distribuées
  }
  
  // Score pour l'intensité sexuelle - même logique
  if (card.sexualLevel !== undefined && preferences.sexualLevel > 0) {
    if (card.sexualLevel === preferences.sexualLevel) {
      score += 100;
    } else if (card.sexualLevel <= preferences.sexualLevel) {
      const distance = Math.abs(card.sexualLevel - preferences.sexualLevel);
      score += Math.max(0, 50 - (distance * 10));
    }
  } else if (card.sexualLevel === 0) {
    score += 10;
  }
  
  // Score pour la proximité du groupe
  if (card.proximityLevel) {
    const proximityMapping = {
      'stranger': ['low', 'medium', 'high'],
      'friend': ['medium', 'high'], 
      'close': ['high']
    };
    
    if (proximityMapping[card.proximityLevel].includes(groupProximity)) {
      score += 25;
    } else {
      return 0; // Carte non éligible pour ce niveau de proximité
    }
  }
  
  return score;
};

export const isCardSuitableForPlayerCount = (card: Card, playerCount: number): boolean => {
  // Compter le nombre de placeholders dans le contenu de la carte
  const playerPlaceholders = (card.content.match(/\{player\d+\}/g) || []).length;
  
  // Si la carte a plus de placeholders que de joueurs disponibles, l'exclure
  if (playerPlaceholders > playerCount) {
    return false;
  }
  
  // Règles assouplies pour 2 joueurs - permettre plus de cartes
  if (playerCount === 2) {
    // Exclure uniquement les cartes avec votes (impossible à 2)
    if (card.isVote) {
      return false;
    }
    
    // Être plus permissif sur les cartes de distribution - seulement exclure les cas vraiment problématiques
    const problematicDistribution = /distribue.*à qui tu veux(?!.*toi)/i.test(card.content) && 
                                   !card.content.includes('tout le monde') && 
                                   !card.content.includes('l\'autre');
    if (problematicDistribution) {
      return false;
    }
    
    // Garder toutes les autres cartes - on filtre moins strictement
  }
  
  // Règles pour 3+ joueurs - inchangées
  if (playerCount >= 3) {
    if (card.dateMode === 'exclusive') {
      return false;
    }
  }
  
  return true;
};

export const filterCardsByRules = (
  cards: Card[],
  preferences: GamePreferences,
  groupProximity: 'low' | 'medium' | 'high',
  isDateMode: boolean,
  playerCount: number
): Card[] => {
  console.log('🔍 Début du filtrage des cartes:', {
    totalCards: cards.length,
    playerCount,
    groupProximity,
    preferences
  });

  const filteredCards = cards.filter(card => {
    // 📱 Mode "T'as la réf" - filtrage prioritaire
    if (preferences.refMode) {
      // En mode "T'as la réf", on ne prend QUE les cartes de référence
      if (!card.isRef) {
        return false;
      }
    } else {
      // Hors mode "T'as la réf", on exclut les cartes de référence
      if (card.isRef) {
        return false;
      }
    }

    // Vérifier d'abord si la carte est adaptée au nombre de joueurs
    if (!isCardSuitableForPlayerCount(card, playerCount)) {
      return false;
    }
    
    // 🍻 Règle intensité gorgées - plus permissive pour 2 joueurs
    if (card.alcoholLevel !== undefined && card.alcoholLevel > 0) {
      if (playerCount === 2) {
        // Pour les couples, permettre jusqu'à +1 niveau au-dessus des préférences
        if (card.alcoholLevel > preferences.alcoholLevel + 1) {
          return false;
        }
      } else {
        // Pour les groupes, garder la règle stricte
        if (card.alcoholLevel > preferences.alcoholLevel) {
          return false;
        }
      }
    }
    
    // 🔞 Règle intensité sexuelle - plus permissive pour 2 joueurs
    if (card.sexualLevel !== undefined && card.sexualLevel > 0) {
      if (playerCount === 2) {
        // Pour les couples, permettre jusqu'à +1 niveau au-dessus des préférences
        if (card.sexualLevel > preferences.sexualLevel + 1) {
          return false;
        }
      } else {
        // Pour les groupes, garder la règle stricte
        if (card.sexualLevel > preferences.sexualLevel) {
          return false;
        }
      }
    }
    
    // 🧠 Règle proximité - assouplir pour 2 joueurs
    if (card.proximityLevel) {
      const proximityMapping = {
        'stranger': ['low', 'medium', 'high'],
        'friend': ['medium', 'high'], 
        'close': ['high']
      };
      
      if (playerCount === 2) {
        // Pour les couples, être plus permissif - accepter les cartes d'un niveau en-dessous
        const allowedLevels = proximityMapping[card.proximityLevel];
        if (!allowedLevels.includes(groupProximity)) {
          // Permettre les cartes 'friend' même en mode 'low' pour les couples
          if (!(card.proximityLevel === 'friend' && groupProximity === 'low')) {
            return false;
          }
        }
      } else if (playerCount >= 3) {
        // Pour les groupes, on ne filtre pas complètement mais on pénalise dans le score
        // Pas de filtrage strict ici
      }
    }
    
    // Filtrer les questions deep
    if (card.isDeep && !preferences.deepQuestions) {
      return false;
    }
    
    // Filtrer les cartes date mode - logique améliorée pour 2 joueurs
    if (card.dateMode === 'exclusive') {
      if (playerCount > 2) {
        return false; // Pour les groupes, exclure les cartes exclusives
      } else if (playerCount === 2 && !preferences.discovery) {
        return false; // Pour les couples en mode basique, exclure les cartes exclusives
      }
    }
    
    // Permettre les cartes 'compatible' pour les couples même sans mode découverte activé
    if (card.dateMode === 'compatible' && playerCount === 2) {
      // Ne pas filtrer - ces cartes sont acceptables pour les couples
    }
    
    // Filtrer les votes seulement pour 2 joueurs
    if (card.isVote && playerCount === 2) {
      return false;
    }
    
    return true;
  });

  console.log('✅ Cartes après filtrage par règles:', {
    before: cards.length,
    after: filteredCards.length,
    filtered: cards.length - filteredCards.length
  });

  return filteredCards;
};

export const selectOptimalCards = (
  availableCards: Card[],
  preferences: GamePreferences,
  players: Player[],
  relationships?: RelationshipData
): Card[] => {
  const playerCount = players.length;
  
  // Déterminer le niveau de proximité du groupe
  const groupProximity = relationships && Object.keys(relationships).length > 0 
    ? getGroupProximityLevel(players, relationships)
    : 'medium'; // Valeur par défaut si pas de données de relations
  
  // Déterminer si on est en mode date (uniquement si 2 joueurs)
  const isDateMode = playerCount === 2 && preferences.discovery === true;
  
  console.log('🎯 Algorithme de sélection:', {
    playerCount,
    groupProximity,
    isDateMode,
    preferences,
    totalCards: availableCards.length
  });
  
  // Filtrer les cartes selon les règles améliorées
  const eligibleCards = filterCardsByRules(availableCards, preferences, groupProximity, isDateMode, playerCount);
  
  console.log('✅ Cartes éligibles après filtrage:', eligibleCards.length);
  
  // Calculer les scores de priorité pour chaque carte éligible
  const cardsWithScores = eligibleCards.map(card => ({
    card,
    score: getCardPriorityScore(card, preferences, groupProximity)
  }));
  
  // Trier par score décroissant
  cardsWithScores.sort((a, b) => b.score - a.score);
  
  console.log('🏆 Top 5 cartes sélectionnées:', 
    cardsWithScores.slice(0, 5).map(item => ({
      content: item.card.content.substring(0, 50) + '...',
      score: item.score,
      alcoholLevel: item.card.alcoholLevel,
      sexualLevel: item.card.sexualLevel,
      proximityLevel: item.card.proximityLevel,
      dateMode: item.card.dateMode,
      playerPlaceholders: (item.card.content.match(/\{player\d+\}/g) || []).length
    }))
  );
  
  return cardsWithScores.map(item => item.card);
};
