
import React from 'react';
import { useGame } from '../contexts/GameContext';
import { RelationshipData } from '../types/relationships';

const RelationshipSkipScreen = () => {
  const { players, setCurrentScreen, setRelationships } = useGame();

  const handleSkipRelationships = () => {
    // Considérer que tous les joueurs sont très proches
    const allCloseRelationships: RelationshipData = {};
    
    players.forEach(player => {
      const otherPlayers = players.filter(p => p.id !== player.id);
      allCloseRelationships[player.id] = otherPlayers.map(otherPlayer => ({
        fromPlayerId: player.id,
        toPlayerId: otherPlayer.id,
        level: 'close' as const
      }));
    });

    setRelationships(allCloseRelationships);
    setCurrentScreen('preferences');
  };

  const handleConfigureRelationships = () => {
    setCurrentScreen('relationships');
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="container-mobile section-spacing">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <button
            onClick={() => setCurrentScreen('players')}
            className="btn-ghost text-white/80 hover:text-white py-2 px-3 tap-highlight-none mb-6"
          >
            ← Retour
          </button>

          <h1 className="text-display-md text-white mb-4">
            Vous vous connaissez tous déjà très bien ? 🤔
          </h1>
          
          <div className="bg-white/10 rounded-xl p-4 mb-8">
            <p className="text-body-sm text-white/80 leading-relaxed">
              Partiz adapte les cartes selon votre niveau de proximité. Vous pouvez sauter cette étape si vous êtes entre potes proches.
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-8 animate-slide-up">
          <button
            onClick={handleSkipRelationships}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl transition-all tap-highlight-none group"
          >
            <div className="flex items-center justify-center space-x-4">
              <span className="text-3xl">✅</span>
              <div className="text-left">
                <div className="text-heading-lg font-bold">Oui, passez cette étape</div>
                <div className="text-body-sm opacity-80">On se connaît tous très bien</div>
              </div>
            </div>
          </button>

          <button
            onClick={handleConfigureRelationships}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white p-6 rounded-xl transition-all tap-highlight-none group"
          >
            <div className="flex items-center justify-center space-x-4">
              <span className="text-3xl">❌</span>
              <div className="text-left">
                <div className="text-heading-lg font-bold">Non, on configure les relations</div>
                <div className="text-body-sm opacity-80">Certains se connaissent moins bien</div>
              </div>
            </div>
          </button>
        </div>

        {/* Info */}
        <div className="text-center animate-fade-in mt-4">
          <p className="text-caption text-white/60">
            {players.length} joueurs · Cette étape prend moins de 30 secondes
          </p>
        </div>
      </div>
    </div>
  );
};

export default RelationshipSkipScreen;
