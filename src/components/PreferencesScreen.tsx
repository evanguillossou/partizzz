import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { Slider } from './ui/slider';

const PreferencesScreen = () => {
  const { players, setCurrentScreen, setGameSession, relationships } = useGame();
  const [sexualLevel, setSexualLevel] = useState([2]);
  const [alcoholLevel, setAlcoholLevel] = useState([2]);
  const [votes, setVotes] = useState(players.length > 2);
  const [deepQuestions, setDeepQuestions] = useState(false);
  const [refMode, setRefMode] = useState(false);

  const isCouple = players.length === 2;

  const hasConfiguredRelationships = Object.keys(relationships).length > 0;

  const buildPreferences = (overrides: Record<string, unknown> = {}) => ({
    sexualLevel: sexualLevel[0],
    alcoholLevel: alcoholLevel[0],
    deepQuestions: deepQuestions,
    votes: votes,
    discovery: false,
    refMode: refMode,
    ...overrides,
  });

  const handleStartGame = () => {
    setGameSession({
      players,
      preferences: buildPreferences(),
      usedCardIds: [],
      currentCardIndex: 0,
    });
    setCurrentScreen('game');
  };

  const handleStartDeepGame = () => {
    setGameSession({
      players,
      preferences: buildPreferences({ deepQuestions: true, votes: false, refMode: false }),
      usedCardIds: [],
      currentCardIndex: 0,
    });
    setCurrentScreen('game');
  };

  const handleStartDiscoveryGame = () => {
    setGameSession({
      players,
      preferences: buildPreferences({ discovery: true, deepQuestions: false, votes: false, refMode: false }),
      usedCardIds: [],
      currentCardIndex: 0,
    });
    setCurrentScreen('game');
  };

  const handleBack = () => {
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

        <div className="space-y-8 mb-8 animate-slide-up">

          {/* Ref mode — plein écran si activé */}
          {!isCouple && (
            <button
              onClick={() => setRefMode(!refMode)}
              className={`card-game-mode p-6 w-full text-left transition-all duration-200 tap-highlight-none ${
                refMode ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <h3 className="text-heading-lg text-white">
                      T'as la réf{' '}
                      <span className="text-xs text-yellow-400 font-normal ml-1">MODE BATTLE</span>
                    </h3>
                    <p className="text-body-sm text-white/70">Que des battles de culture pop et memes</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  refMode ? 'bg-yellow-400 border-yellow-400' : 'border-white/40'
                }`}>
                  {refMode && <div className="w-2 h-2 bg-black rounded-full" />}
                </div>
              </div>
            </button>
          )}

          {/* Sliders — masqués en ref mode */}
          {!refMode && (
            <>
              {/* Alcohol Level */}
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

              {/* Sexual Level */}
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

              {/* Deep questions toggle — groupes uniquement */}
              {!isCouple && (
                <button
                  onClick={() => setDeepQuestions(!deepQuestions)}
                  className={`card-game-mode p-6 w-full text-left transition-all duration-200 tap-highlight-none ${
                    deepQuestions ? 'ring-2 ring-purple-400' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">🌊</span>
                      <div>
                        <h3 className="text-heading-lg text-white">Questions profondes</h3>
                        <p className="text-body-sm text-white/70">Inclure les questions deep et introspectives</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      deepQuestions ? 'bg-purple-400 border-purple-400' : 'border-white/40'
                    }`}>
                      {deepQuestions && <div className="w-2 h-2 bg-black rounded-full" />}
                    </div>
                  </div>
                </button>
              )}

              {/* Votes toggle — groupes uniquement */}
              {!isCouple && players.length >= 3 && (
                <button
                  onClick={() => setVotes(!votes)}
                  className={`card-game-mode p-6 w-full text-left transition-all duration-200 tap-highlight-none ${
                    votes ? 'ring-2 ring-blue-400' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">🗳️</span>
                      <div>
                        <h3 className="text-heading-lg text-white">Cartes votes de groupe</h3>
                        <p className="text-body-sm text-white/70">Inclure les questions "qui dans le groupe..."</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      votes ? 'bg-blue-400 border-blue-400' : 'border-white/40'
                    }`}>
                      {votes && <div className="w-2 h-2 bg-black rounded-full" />}
                    </div>
                  </div>
                </button>
              )}
            </>
          )}

          {/* Pour les couples : boutons de modes de jeu */}
          {isCouple ? (
            <>
              <button
                onClick={handleStartGame}
                className="btn-primary w-full shadow-glow tap-highlight-none"
              >
                🎯 Lancer la partie
              </button>

              <div className="text-center">
                <p className="text-white/60 text-sm">ou choisissez un mode spécial</p>
              </div>

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
                  <div className="text-white/50">→</div>
                </div>
              </button>

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
                  <div className="text-white/50">→</div>
                </div>
              </button>
            </>
          ) : null}
        </div>

        {/* Action buttons */}
        <div className="space-y-4 animate-slide-up">
          {!isCouple && (
            <button
              onClick={handleStartGame}
              className="btn-primary w-full shadow-glow tap-highlight-none"
            >
              {refMode ? '🎯 Lancer le mode Battle' : '🎯 Lancer la partie'}
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
