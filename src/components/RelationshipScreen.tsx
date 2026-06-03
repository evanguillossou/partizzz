import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { Player } from '../types/game';
import { RelationshipLevel, RELATIONSHIP_EMOJIS, PlayerRelationship } from '../types/relationships';
import { Avatar, AvatarFallback } from './ui/avatar';

const RelationshipScreen = () => {
  const { players, setCurrentScreen, relationships, setRelationships } = useGame();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentRelationships, setCurrentRelationships] = useState<PlayerRelationship[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentPlayer = players[currentPlayerIndex];
  const otherPlayers = players.filter(p => p.id !== currentPlayer.id);

  const handleRelationshipSelect = (toPlayerId: string, level: RelationshipLevel) => {
    const newRelationship: PlayerRelationship = {
      fromPlayerId: currentPlayer.id,
      toPlayerId,
      level
    };

    const updatedRelationships = currentRelationships.filter(r => r.toPlayerId !== toPlayerId);
    updatedRelationships.push(newRelationship);
    setCurrentRelationships(updatedRelationships);

    // Vérifier si toutes les relations sont définies pour ce joueur
    if (updatedRelationships.length === otherPlayers.length) {
      // Petit délai pour l'UX puis passer au joueur suivant
      setTimeout(() => {
        handleNextPlayer(updatedRelationships);
      }, 500);
    }
  };

  const handleNextPlayer = (playerRelationships: PlayerRelationship[]) => {
    // Sauvegarder les relations du joueur actuel
    const newRelationships = {
      ...relationships,
      [currentPlayer.id]: playerRelationships
    };
    setRelationships(newRelationships);

    if (currentPlayerIndex < players.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPlayerIndex(currentPlayerIndex + 1);
        setCurrentRelationships([]);
        setIsTransitioning(false);
      }, 300);
    } else {
      // Tous les joueurs ont terminé, aller vers l'écran de completion puis le jeu
      setCurrentScreen('completion');
    }
  };

  const getRelationshipLevel = (toPlayerId: string): RelationshipLevel | null => {
    const relationship = currentRelationships.find(r => r.toPlayerId === toPlayerId);
    return relationship?.level || null;
  };

  const progress = ((currentPlayerIndex + 1) / players.length) * 100;

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="container-mobile section-spacing">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentScreen('relationship-skip')}
              className="btn-ghost text-white/80 hover:text-white py-2 px-3 tap-highlight-none"
            >
              ← Retour
            </button>
            <span className="text-caption text-white/80">
              {currentPlayerIndex + 1}/{players.length}
            </span>
          </div>

          <h1 className="text-display-md text-white mb-2">On se connaît ? 🤔</h1>
          <p className="text-body-md text-white/80 mb-4">
            Ça nous aide à choisir les bonnes cartes !
          </p>

          {/* Progress bar */}
          <div className="w-full bg-white/20 rounded-full h-2 mb-6">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Current Player */}
        <div className={`text-center mb-8 transition-all duration-300 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {currentPlayer.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-heading-lg text-white font-bold">
              {currentPlayer.name}
            </h2>
            <p className="text-body-sm text-white/80">
              Comment tu connais les autres ?
            </p>
          </div>
        </div>

        {/* Other Players */}
        <div className="space-y-4 animate-slide-up">
          {otherPlayers.map((player) => {
            const selectedLevel = getRelationshipLevel(player.id);
            
            return (
              <div key={player.id} className="card-primary glass p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-secondary text-secondary-foreground font-medium">
                        {player.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-white font-medium">{player.name}</span>
                  </div>
                </div>

                <div className="flex justify-between space-x-2">
                  {(Object.keys(RELATIONSHIP_EMOJIS) as RelationshipLevel[]).map((level) => {
                    const isSelected = selectedLevel === level;
                    const { emoji, label } = RELATIONSHIP_EMOJIS[level];
                    
                    return (
                      <button
                        key={level}
                        onClick={() => handleRelationshipSelect(player.id, level)}
                        className={`flex-1 p-3 rounded-xl text-center transition-all tap-highlight-none ${
                          isSelected
                            ? 'bg-primary text-primary-foreground shadow-glow scale-105'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        <div className="text-lg mb-1">{emoji}</div>
                        <div className="text-xs leading-tight">{label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Instructions */}
        <div className="text-center mt-6 animate-fade-in">
          <p className="text-caption text-white/60">
            Clique sur un emoji pour chaque personne
          </p>
        </div>
      </div>
    </div>
  );
};

export default RelationshipScreen;
