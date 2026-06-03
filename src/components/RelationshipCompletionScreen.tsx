
import React, { useEffect } from 'react';
import { useGame } from '../contexts/GameContext';

const RelationshipCompletionScreen = () => {
  const { setCurrentScreen, players } = useGame();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Pour les couples (2 joueurs), aller directement au jeu
      // Pour les groupes (3+ joueurs), aller aux préférences
      if (players.length === 2) {
        setCurrentScreen('game');
      } else {
        setCurrentScreen('preferences');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [setCurrentScreen, players.length]);

  // Adapter le message selon le nombre de joueurs
  const isCouple = players.length === 2;

  return (
    <div className="min-h-screen bg-black p-6 flex flex-col justify-center">
      <div className="container-mobile text-center space-y-8">
        <div className="animate-fade-in">
          <div className="text-6xl mb-4 animate-bounce-slow">
            {isCouple ? '❤️' : '😉'}
          </div>
          <h1 className="text-display-md text-white mb-4">
            {isCouple ? 'À deux, c\'est encore mieux !' : 'C\'est bon, on vous connaît !'}
          </h1>
          <p className="text-body-lg text-white/80">
            {isCouple 
              ? 'Préparez-vous pour une soirée en tête-à-tête...' 
              : 'On va maintenant personnaliser votre partie...'
            }
          </p>
        </div>

        <div className="flex justify-center space-x-2 animate-fade-in">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default RelationshipCompletionScreen;
