import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { useSubscription } from '../hooks/useSubscription';
import { Slider } from './ui/slider';
import {
  FREE_MAX_INTENSITY,
  PREMIUM_MAX_INTENSITY,
  clampIntensityForTier,
} from '../config/freemium';
import { trackEvent } from '../lib/analytics';

const PreferencesScreen = () => {
  const { players, setCurrentScreen, setGameSession, relationships } = useGame();
  const { subscribed } = useSubscription();
  const [sexualLevel, setSexualLevel] = useState([2]);
  const [alcoholLevel, setAlcoholLevel] = useState([2]);
  const [votes, setVotes] = useState(false);

  const isCouple = players.length === 2;
  const isPremium = !!subscribed;
  const maxIntensity = isPremium ? PREMIUM_MAX_INTENSITY : FREE_MAX_INTENSITY;

  const hasConfiguredRelationships = Object.keys(relationships).length > 0;

  const goPremium = () => {
    trackEvent('clic_premium', { source: 'preferences' });
    setCurrentScreen('payment');
  };

  // Construit les préférences en appliquant les plafonds du palier gratuit.
  const buildPreferences = (overrides: Record<string, unknown> = {}) => {
    const base = {
      sexualLevel: clampIntensityForTier(sexualLevel[0], isPremium),
      alcoholLevel: clampIntensityForTier(alcoholLevel[0], isPremium),
      deepQuestions: false,
      votes,
      discovery: false,
      refMode: false,
      interviewMode: false,
      ...overrides,
    };
    // Filet de sécurité : les fonctionnalités premium ne passent jamais en gratuit
    if (!isPremium) {
      if (!isCouple) {
        base.votes = false;
      }
      base.sexualLevel = clampIntensityForTier(base.sexualLevel as number, false);
      base.alcoholLevel = clampIntensityForTier(base.alcoholLevel as number, false);
    }
    return base;
  };

  const handleStartGame = () => {
    trackEvent('partie_lancee', { mode: 'standard', joueurs: players.length });
    setGameSession({
      players,
      preferences: buildPreferences(),
      usedCardIds: [],
      currentCardIndex: 0,
    });
    setCurrentScreen('game');
  };

  const handleStartInterviewGame = () => {
    trackEvent('partie_lancee', { mode: 'interview', joueurs: players.length });
    setGameSession({
      players,
      preferences: buildPreferences({ interviewMode: true, votes: false }),
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

  // Toggle de groupe avec gating premium. Si verrouillé, le tap renvoie à l'abonnement.
  // Classes Tailwind écrites en entier (pas d'interpolation) pour survivre au purge.
  const ACCENTS: Record<string, { ring: string; dot: string }> = {
    yellow: { ring: 'ring-2 ring-yellow-400', dot: 'bg-yellow-400 border-yellow-400' },
    purple: { ring: 'ring-2 ring-purple-400', dot: 'bg-purple-400 border-purple-400' },
    blue: { ring: 'ring-2 ring-blue-400', dot: 'bg-blue-400 border-blue-400' },
  };

  const PremiumToggle: React.FC<{
    icon: string;
    title: string;
    subtitle: string;
    active: boolean;
    accent: 'yellow' | 'purple' | 'blue';
    onToggle: () => void;
  }> = ({ icon, title, subtitle, active, accent, onToggle }) => {
    const locked = !isPremium;
    const a = ACCENTS[accent];
    return (
      <button
        onClick={locked ? goPremium : onToggle}
        className={`card-game-mode p-6 w-full text-left transition-all duration-200 tap-highlight-none ${
          active ? a.ring : ''
        } ${locked ? 'opacity-80' : ''}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-2xl">{icon}</span>
            <div>
              <h3 className="text-heading-lg text-white flex items-center gap-2">
                {title}
                {locked && (
                  <span className="text-[10px] bg-yellow-400 text-black font-bold px-1.5 py-0.5 rounded-full">
                    PREMIUM
                  </span>
                )}
              </h3>
              <p className="text-body-sm text-white/70">{subtitle}</p>
            </div>
          </div>
          {locked ? (
            <span className="text-yellow-400 text-lg">🔒</span>
          ) : (
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              active ? a.dot : 'border-white/40'
            }`}>
              {active && <div className="w-2 h-2 bg-black rounded-full" />}
            </div>
          )}
        </div>
      </button>
    );
  };

  // Mode pas encore finalisé : visible mais désactivé, badge "Bientôt disponible".
  const ComingSoonMode: React.FC<{ icon: string; title: string; subtitle: string }> = ({
    icon,
    title,
    subtitle,
  }) => (
    <div className="card-game-mode p-6 w-full text-left opacity-60 cursor-not-allowed select-none">
      <div className="flex items-center space-x-4">
        <span className="text-2xl grayscale opacity-80">{icon}</span>
        <div className="flex-1">
          <h3 className="text-heading-lg text-white/80 flex items-center gap-2 flex-wrap">
            {title}
            <span className="text-[10px] bg-white/15 text-white/90 font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              Bientôt disponible
            </span>
          </h3>
          <p className="text-body-sm text-white/50">{subtitle}</p>
        </div>
      </div>
    </div>
  );

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

        <div className="space-y-6 mb-8 animate-slide-up">

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
              max={maxIntensity}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-white/50 mt-2">
              <span>Sobre</span>
              <span>{isPremium ? 'Party hard' : 'Modéré'}</span>
            </div>
            {!isPremium && (
              <button onClick={goPremium} className="mt-3 text-xs text-yellow-400/80 hover:text-yellow-400 tap-highlight-none">
                🔒 Niveaux Élevé & Maximum avec Premium →
              </button>
            )}
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
              max={maxIntensity}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-white/50 mt-2">
              <span>Aucune</span>
              <span>{isPremium ? 'Maximum' : 'Modéré'}</span>
            </div>
            {!isPremium && (
              <button onClick={goPremium} className="mt-3 text-xs text-yellow-400/80 hover:text-yellow-400 tap-highlight-none">
                🔒 Cartes intenses (niv. 4-5) avec Premium →
              </button>
            )}
          </div>

          {/* Bouton principal */}
          <button
            onClick={handleStartGame}
            className="btn-primary w-full shadow-glow tap-highlight-none"
          >
            🎯 Lancer la partie
          </button>

          <div className="text-center">
            <p className="text-white/60 text-sm">ou choisissez un mode spécial</p>
          </div>

          {/* 1. Mode Interview — actif, en premier, dispo partout, gratuit */}
          <button
            onClick={handleStartInterviewGame}
            className="card-game-mode p-6 w-full text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-lg tap-highlight-none"
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl">🎤</span>
              <div className="flex-1">
                <h3 className="text-heading-lg text-white">Mode Interview</h3>
                <p className="text-body-sm text-white/70">
                  Désignez le joueur interviewé. Une gorgée à chaque réponse que vous trouvez inspirante.
                </p>
              </div>
              <div className="text-white/50">→</div>
            </div>
          </button>

          {/* Votes de groupe — groupes 3+, premium (mode actif), sous le mode Interview */}
          {!isCouple && players.length >= 3 && (
            <PremiumToggle
              icon="🗳️"
              title="Cartes votes de groupe"
              subtitle={'Inclure les questions "qui dans le groupe..."'}
              active={votes}
              accent="blue"
              onToggle={() => setVotes(!votes)}
            />
          )}

          {/* Modes à venir (désactivés) */}
          <ComingSoonMode
            icon="🌊"
            title="Questions deep / ouvertes"
            subtitle="Conversations profondes et introspectives"
          />

          {isCouple && (
            <ComingSoonMode
              icon="💕"
              title="On se découvre"
              subtitle="Idéal pour des dates et rendez-vous"
            />
          )}

          {!isCouple && (
            <ComingSoonMode
              icon="🎯"
              title="T'as la réf"
              subtitle="Que des battles de culture pop et memes"
            />
          )}
        </div>

        {/* Bandeau premium discret pour les non-abonnés */}
        {!isPremium && (
          <button
            onClick={goPremium}
            className="w-full mb-4 bg-gradient-to-r from-yellow-500/10 to-pink-500/10 border border-yellow-400/30 rounded-xl p-4 text-center tap-highlight-none hover:border-yellow-400/50 transition-colors"
          >
            <p className="text-yellow-400 text-sm font-semibold">💎 Passe en Premium</p>
            <p className="text-white/60 text-xs mt-1">
              Cartes intenses (niv. 4-5), parties 2× plus longues, cartes exclusives
            </p>
          </button>
        )}

        {/* Retour */}
        <div className="space-y-4 animate-slide-up">
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
