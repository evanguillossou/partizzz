import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { Slider } from './ui/slider';

const PreferencesScreen = () => {
  const { players, setCurrentScreen, setGameSession, relationships } = useGame();
  const [sexualLevel, setSexualLevel] = useState([2]);
  const [alcoholLevel, setAlcoholLevel] = useState([2]);
  const [votes, setVotes] = useState(players.length > 2);

  const isCouple = players.length === 2;
  
  // Vérifier si on a configuré les relations (au moins une relation existe)
  const hasConfiguredRelationships = Object.keys(relationships).length > 0;

  const handleStartGame = () => {
    const preferences = {
      sexualLevel: sexualLevel[0],
      alcoholLevel: alcoholLevel[0],
      deepQuestions: false, // Pour les groupes, toujours false
      votes: votes,
      discovery: false // Pour les groupes, toujours false
    };

    setGameSession({
      players,
      preferences,
      usedCardIds: [],
      currentCardIndex: 0
    });

    // Aller directement au jeu pour tous les cas
    setCurrentScreen('game');
  };

  // Fonction pour lancer directement le mode Deep
  const handleStartDeepGame = () => {
    const preferences = {
      sexualLevel: sexualLevel[0],
      alcoholLevel: alcoholLevel[0],
      deepQuestions: true,
      votes: false,
      discovery: false
    };

    setGameSession({
      players,
      preferences,
      usedCardIds: [],
      currentCardIndex: 0
    });

    setCurrentScreen('game');
  };

  // Fonction pour lancer directement le mode Discovery
  const handleStartDiscoveryGame = () => {
    const preferences = {
      sexualLevel: sexualLevel[0],
      alcoholLevel: alcoholLevel[0],
      deepQuestions: false,
      votes: false,
      discovery: true
    };

    setGameSession({
      players,
      preferences,
      usedCardIds: [],
      currentCardIndex: 0
    });

    setCurrentScreen('game');
  };


  const handleBack = () => {
    // Si on a configuré les relations et qu'on est un groupe, retourner à l'écran de saut des relations
    // Si on est un couple, retourner à l'écran des joueurs
    if (hasConfiguredRelationships && !isCouple) {
      setCurrentScreen('relationship-skip');
    } else {
      setCurrentScreen('players');
    }
  };

  const getLevelLabel = (level: number) => {
    const labels = ['Aucun', 'Très léger', 'Léger', 'Modéré', 'Élevé', 'Maximum'];
    return labels[level] || 'Modéré';
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="container-mobile section-spacing">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-display-md text-white mb-2">Personnalisez votre partie ! 🎛️</h1>
          <p className="text-body-md text-white/80">
            {players.length} joueurs • Ajustez l'intensité à votre goût
          </p>
        </div>

        {/* Preferences */}
        <div className="space-y-8 mb-8 animate-slide-up">
          {/* Alcohol Level - maintenant en premier */}
          <div className="card-game-mode p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">🍻</span>
              <div>
                <h3 className="text-heading-lg text-white">Gorgées distribuées</h3>
                <p className="text-body-sm text-white/70">Niveau actuel : {getLevelLabel(alcoholLevel[0])}</p>
              </div>
            </div>
            <Slider
              value={alcoholLevel}
              onValueChange={setAlcoholLevel}
              max={5}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-white/50 mt-2">
              <span>Sobre</span>
              <span>Party hard</span>
            </div>
          </div>

          {/* Sexual Level - maintenant en deuxième */}
          <div className="card-game-mode p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">🔞</span>
              <div>
                <h3 className="text-heading-lg text-white">Cartes explicitement sexuelles</h3>
                <p className="text-body-sm text-white/70">Niveau actuel : {getLevelLabel(sexualLevel[0])}</p>
              </div>
            </div>
            <Slider
              value={sexualLevel}
              onValueChange={setSexualLevel}
              max={5}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-white/50 mt-2">
              <span>Aucune</span>
              <span>Maximum</span>
            </div>
          </div>

          {/* Pour les couples : Bouton Lancer la partie + Boutons de modes de jeu */}
          {isCouple ? (
            <>
              {/* Bouton générique pour couples */}
              <button
                onClick={handleStartGame}
                className="btn-primary w-full shadow-glow tap-highlight-none"
              >
                🎯 Lancer la partie
              </button>

              {/* Séparateur */}
              <div className="text-center">
                <p className="text-white/60 text-sm">ou choisissez un mode spécial</p>
              </div>

              {/* Deep Questions Button */}
              <button
                onClick={handleStartDeepGame}
                className="card-game-mode p-6 w-full text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-lg tap-highlight-none"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">🌊</span>
                  <div className="flex-1">
                    <h3 className="text-heading-lg text-white">Questions deep / ouvertes</h3>
                    <p className="text-body-sm text-white/70">Conversations profondes et introspectives</p>
                  </div>
                  <div className="text-white/50">
                    →
                  </div>
                </div>
              </button>

              {/* Discovery Button */}
              <button
                onClick={handleStartDiscoveryGame}
                className="card-game-mode p-6 w-full text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-lg tap-highlight-none"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">💕</span>
                  <div className="flex-1">
                    <h3 className="text-heading-lg text-white">On se découvre</h3>
                    <p className="text-body-sm text-white/70">Idéal pour des dates et rendez-vous</p>
                  </div>
                  <div className="text-white/50">
                    →
                  </div>
                </div>
              </button>

            </>
          ) : null}
        </div>

        {/* Action buttons */}
        <div className="space-y-4 animate-slide-up">
          {/* Bouton générique seulement pour les groupes */}
          {!isCouple && (
            <button
              onClick={handleStartGame}
              className="btn-primary w-full shadow-glow tap-highlight-none"
            >
              🎯 Lancer la partie
            </button>
          )}
          
          <button
            onClick={handleBack}
            className="btn-ghost w-full tap-highlight-none"
          >
            ← Retour
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesScreen;
