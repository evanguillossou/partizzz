
import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { useCards } from '../hooks/useSupabaseCards';
import { useSubscription } from '../hooks/useSubscription';
import { insertPlayerNames, shuffleArray, getAvailableCardsFromSupabase } from '../utils/gameUtils';
import { selectOptimalCards } from '../utils/cardSelectionUtils';

const GameScreen = () => {
  const { gameSession, setGameSession, setCurrentScreen, players, relationships } = useGame();
  const { subscribed } = useSubscription();
  const [currentCard, setCurrentCard] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [availableCards, setAvailableCards] = useState<any[]>([]);
  const [totalGameCards, setTotalGameCards] = useState(20);
  const [playerTargetCounts, setPlayerTargetCounts] = useState<Record<string, number>>({});
  
  // Récupération des cartes depuis Supabase
  const { data: supabaseCards, isLoading, error, refetch } = useCards();

  // Initialiser les compteurs de ciblage
  useEffect(() => {
    if (players.length > 0 && Object.keys(playerTargetCounts).length === 0) {
      const initialCounts: Record<string, number> = {};
      players.forEach(p => { initialCounts[p.id] = 0; });
      setPlayerTargetCounts(initialCounts);
    }
  }, [players]);

  useEffect(() => {
    const loadCards = async () => {
      if (gameSession && players) {
        try {
          const cards = await getAvailableCardsFromSupabase(
            gameSession,
            gameSession.usedCardIds,
            players,
            relationships,
            subscribed || false
          );
          
          console.log('🎮 Cartes récupérées pour', players.length, 'joueurs:', {
            totalCards: cards.length,
            limit: totalGameCards,
            preferences: gameSession.preferences
          });
          
          const shuffled = shuffleArray(cards);
          const limitedCards = shuffled.slice(0, totalGameCards);
          setAvailableCards(limitedCards);
          
          if (limitedCards.length > 0) {
            const result = insertPlayerNames(limitedCards[0].content, gameSession.players, playerTargetCounts);
            setCurrentCard(result.content);
            
            // Mettre à jour les compteurs
            const newCounts = { ...playerTargetCounts };
            result.targetedPlayerIds.forEach(id => {
              newCounts[id] = (newCounts[id] || 0) + 1;
            });
            setPlayerTargetCounts(newCounts);
          }
        } catch (error) {
          console.error('Erreur lors du chargement des cartes:', error);
        }
      }
    };

    loadCards();
  }, [gameSession?.usedCardIds?.length === 0, players, relationships, totalGameCards, subscribed]);

  const handleNextCard = () => {
    if (!gameSession || availableCards.length === 0 || isAnimating) return;

    const currentCardObj = availableCards[0];
    const newUsedCardIds = [...gameSession.usedCardIds, currentCardObj.id];
    const remainingCards = availableCards.slice(1);
    const newCardIndex = gameSession.currentCardIndex + 1;
    
    // Vérifier si c'est la fin du jeu
    if (newCardIndex >= totalGameCards || remainingCards.length === 0) {
      setCurrentScreen('feedback');
      return;
    }

    // Animation de sortie
    setIsAnimating(true);
    
    setTimeout(() => {
      setGameSession({
        ...gameSession,
        usedCardIds: newUsedCardIds,
        currentCardIndex: newCardIndex
      });
      
      setAvailableCards(remainingCards);
      
      // Utiliser le système de rotation équitable
      const result = insertPlayerNames(remainingCards[0].content, gameSession.players, playerTargetCounts);
      setCurrentCard(result.content);
      
      // Mettre à jour les compteurs de ciblage
      const newCounts = { ...playerTargetCounts };
      result.targetedPlayerIds.forEach(id => {
        newCounts[id] = (newCounts[id] || 0) + 1;
      });
      setPlayerTargetCounts(newCounts);
      
      console.log('👥 Rotation joueurs:', newCounts);
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 200);
  };

  // Fonction pour recharger les cartes de la session de jeu
  const handleRefreshCards = async () => {
    if (!gameSession || !players) return;

    setIsRefreshing(true);
    
    try {
      // Recharger les cartes depuis Supabase avec les préférences actuelles
      const cards = await getAvailableCardsFromSupabase(
        gameSession,
        gameSession.usedCardIds,
        players,
        relationships,
        subscribed || false
      );
      
      if (cards.length === 0) {
        // Pas de nouvelles cartes disponibles
        console.log('Aucune nouvelle carte disponible');
        setIsRefreshing(false);
        return;
      }
      
      // Mélanger et limiter les nouvelles cartes
      const shuffled = shuffleArray(cards);
      const limitedCards = shuffled.slice(0, totalGameCards - gameSession.currentCardIndex);
      
      // Mettre à jour les cartes disponibles
      setAvailableCards(limitedCards);
      
      // Mettre à jour la carte actuelle avec rotation équitable
      if (limitedCards.length > 0) {
        const result = insertPlayerNames(limitedCards[0].content, gameSession.players, playerTargetCounts);
        setCurrentCard(result.content);
        
        // Mettre à jour les compteurs
        const newCounts = { ...playerTargetCounts };
        result.targetedPlayerIds.forEach(id => {
          newCounts[id] = (newCounts[id] || 0) + 1;
        });
        setPlayerTargetCounts(newCounts);
      }
      
      console.log(`${limitedCards.length} nouvelles cartes chargées`);
    } catch (error) {
      console.error('Erreur lors du rechargement des cartes:', error);
    }
    
    setIsRefreshing(false);
  };

  if (!gameSession) {
    return null;
  }

  // Affichage du chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-6 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Chargement des cartes...</p>
        </div>
      </div>
    );
  }

  // Affichage d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-pink-600 p-6 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="mb-4">Erreur lors du chargement des cartes</p>
          <button 
            onClick={() => setCurrentScreen('home')} 
            className="btn-primary"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // Pas de cartes disponibles
  if (!supabaseCards || supabaseCards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-500 to-orange-600 p-6 flex items-center justify-center">
          <div className="text-center text-white">
            <p className="mb-4">Aucune carte disponible dans la base de données</p>
            <div className="space-y-2">
              <button 
                onClick={() => refetch()} 
                className="btn-primary w-full"
              >
                🔄 Actualiser les cartes
              </button>
              <button 
                onClick={() => setCurrentScreen('home')} 
                className="btn-ghost text-white/80 hover:text-white"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
      </div>
    );
  }

  const cardsPlayed = gameSession?.currentCardIndex || 0;
  const cardsRemaining = totalGameCards - cardsPlayed;
  const progress = (cardsPlayed / totalGameCards) * 100;

  // Couleur de fond basée sur les préférences
  const getBgColor = () => {
    if (!gameSession.preferences) return 'bg-gradient-to-br from-purple-500 to-indigo-600';
    
    const { sexualLevel, alcoholLevel } = gameSession.preferences;
    
    if (sexualLevel >= 4) {
      return 'bg-gradient-to-br from-red-500 to-pink-600';
    } else if (alcoholLevel >= 4) {
      return 'bg-gradient-to-br from-orange-400 to-yellow-500';
    } else if (gameSession.preferences.deepQuestions) {
      return 'bg-gradient-to-br from-purple-500 to-indigo-600';
    } else {
      return 'bg-gradient-to-br from-green-500 to-teal-600';
    }
  };

  const getTitle = () => {
    if (!gameSession.preferences) return '🎯 Partie personnalisée';
    
    const { sexualLevel, alcoholLevel, deepQuestions } = gameSession.preferences;
    
    if (sexualLevel >= 4) return '🔥 Mode intense';
    if (alcoholLevel >= 4) return '🍻 Party mode';
    if (deepQuestions) return '🌊 Mode introspectif';
    return '🎯 Partie personnalisée';
  };

  return (
    <div className={`min-h-screen ${getBgColor()} p-6 flex flex-col`}>
      <div className="container-mobile flex flex-col h-full">
        {/* Header */}
        <div className="text-center mb-6 pt-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentScreen('preferences')}
                className="btn-ghost text-white/80 hover:text-white py-2 px-3 tap-highlight-none"
              >
                ← Retour
              </button>
              <button
                onClick={handleRefreshCards}
                disabled={isRefreshing}
                className={`btn-ghost text-white/80 hover:text-white py-2 px-3 tap-highlight-none ${
                  isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title="Actualiser les cartes"
              >
                {isRefreshing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block" />
                ) : (
                  '🔄'
                )}
              </button>
            </div>
            <span className="text-caption text-white/80">
              {cardsRemaining} / {totalGameCards} cartes
            </span>
          </div>
          
          <h1 className="text-display-sm text-white mb-2">
            {getTitle()}
          </h1>
          <p className="text-body-sm text-white/80 mb-4">
            Partie de {totalGameCards} cartes pour {gameSession.players.length} joueurs
          </p>
          
          {/* Progress bar */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Card */}
        <div className="flex-1 flex items-center justify-center animate-slide-up">
          <div 
            className={`card-game w-full max-w-sm transition-all duration-300 ${
              isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-6">🎯</div>
              <p className="text-body-lg text-card-foreground leading-relaxed font-medium">
                {currentCard}
              </p>
            </div>
          </div>
        </div>

        {/* Next button */}
        <div className="pb-8 animate-slide-up">
          <button
            onClick={handleNextCard}
            disabled={isAnimating}
            className="btn-primary w-full shadow-glow tap-highlight-none touch-manipulation disabled:opacity-50 disabled:transform-none"
          >
            {cardsRemaining > 1 ? '🎯 Défi Suivant' : '🏁 Terminer le Jeu'}
          </button>
          
          <p className="text-caption text-white/60 text-center mt-3">
            Appuyez sur le bouton ou glissez vers le haut pour la carte suivante
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
