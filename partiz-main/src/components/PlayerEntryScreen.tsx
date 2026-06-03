
import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { Player } from '../types/game';

const PlayerEntryScreen = () => {
  const { setPlayers, setCurrentScreen } = useGame();
  const [playerNames, setPlayerNames] = useState<string[]>(['', '']);

  const addPlayer = () => {
    if (playerNames.length < 10) {
      setPlayerNames([...playerNames, '']);
    }
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > 2) {
      const newNames = playerNames.filter((_, i) => i !== index);
      setPlayerNames(newNames);
    }
  };

  const updatePlayerName = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const canProceed = playerNames.filter(name => name.trim()).length >= 2;

  const handleProceed = () => {
    const validNames = playerNames.filter(name => name.trim());
    const players: Player[] = validNames.map((name, index) => ({
      id: `player-${index}`,
      name: name.trim()
    }));
    setPlayers(players);
    
    // Aller vers l'étape des relations d'abord
    if (players.length === 2) {
      setCurrentScreen('preferences');
    } else {
      setCurrentScreen('relationship-skip');
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="container-mobile section-spacing">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-display-md text-white mb-2">Qui joue ? 🎭</h1>
          <p className="text-body-md text-white/80">Ajoutez 2 à 10 joueurs pour commencer !</p>
        </div>

        {/* Player inputs */}
        <div className="space-y-4 mb-8 animate-slide-up">
          {playerNames.map((name, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => updatePlayerName(index, e.target.value)}
                  placeholder={`Nom du joueur ${index + 1}`}
                  className="input-player w-full tap-highlight-none"
                  maxLength={15}
                />
              </div>
              {playerNames.length > 2 && (
                <button
                  onClick={() => removePlayer(index)}
                  className="btn-fab w-10 h-10 bg-destructive hover:bg-destructive/90 tap-highlight-none"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add player button */}
        {playerNames.length < 10 && (
          <button
            onClick={addPlayer}
            className="btn-secondary w-full mb-6 glass tap-highlight-none"
          >
            ➕ Ajouter un autre joueur
          </button>
        )}

        {/* Proceed button */}
        <button
          onClick={handleProceed}
          disabled={!canProceed}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all tap-highlight-none ${
            canProceed
              ? 'btn-primary shadow-glow'
              : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
          }`}
        >
          {canProceed ? '🎯 Continuer' : '⚠️ Il faut au moins 2 joueurs'}
        </button>

        {/* Back button */}
        <button
          onClick={() => setCurrentScreen('home')}
          className="btn-ghost w-full mt-4 tap-highlight-none"
        />
      </div>
    </div>
  );
};

export default PlayerEntryScreen;
