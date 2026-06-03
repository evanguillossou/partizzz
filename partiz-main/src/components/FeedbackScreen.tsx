
import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { FeedbackRating } from '../types/game';
import { supabase } from '../integrations/supabase/client';

const FeedbackScreen = () => {
  const { gameSession, feedback, setFeedback, setCurrentScreen, resetGame } = useGame();
  const [showCardSubmission, setShowCardSubmission] = useState(false);
  const [cardIdea, setCardIdea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackOptions: { rating: FeedbackRating; label: string; color: string }[] = [
    { rating: '🔥', label: 'Génial !', color: 'from-red-500 to-orange-500' },
    { rating: '😐', label: 'Correct', color: 'from-gray-500 to-gray-600' },
    { rating: '💤', label: 'Bof...', color: 'from-blue-500 to-indigo-600' }
  ];

  const handleReplay = () => {
    setCurrentScreen('preferences');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Partiz - Application de Jeux de Soirée',
        text: 'Rejoins-moi pour des jeux de soirée épiques !',
        url: window.location.href
      });
    } else {
      const text = 'Découvre Partiz - l\'application ultime de jeux de soirée ! 🎉';
      navigator.clipboard.writeText(text + ' ' + window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  const handleSubmitCardIdea = async () => {
    if (!cardIdea.trim()) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('submit-card-idea', {
        body: {
          cardIdea: cardIdea.trim(),
          playerName: gameSession?.players[0] || 'Joueur anonyme',
          gameMode: getSessionDescription()
        }
      });

      if (error) throw error;

      alert('Merci pour votre idée ! Elle a été envoyée à notre équipe. 🎉');
      setCardIdea('');
      setShowCardSubmission(false);
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      alert('Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSessionDescription = () => {
    if (!gameSession?.preferences) return 'Partie personnalisée';
    
    const { sexualLevel, alcoholLevel, deepQuestions, votes } = gameSession.preferences;
    const features = [];
    
    if (sexualLevel > 0) features.push(`🔞 Niveau ${sexualLevel}`);
    if (alcoholLevel > 0) features.push(`🍻 Niveau ${alcoholLevel}`);
    if (deepQuestions) features.push('🌊 Questions deep');
    if (votes) features.push('🗳️ Votes');
    
    return features.length > 0 ? features.join(' • ') : 'Partie personnalisée';
  };

  if (!gameSession) return null;

  return (
    <div className="min-h-screen bg-black p-6 flex flex-col justify-center">
      <div className="container-mobile text-center space-y-8">
        {/* Header */}
        <div className="space-y-4 animate-fade-in">
          <div className="text-6xl animate-bounce-slow">🎉</div>
          <h1 className="text-display-md text-white">Fin de la Fête !</h1>
          <p className="text-body-lg text-white/80">Comment c'était ?</p>
        </div>

        {/* Game summary */}
        <div className="card-primary glass p-6 text-white animate-slide-up">
          <h3 className="text-heading-lg font-bold mb-2">Session Terminée</h3>
          <p className="text-body-md text-white/90 mb-2">{getSessionDescription()}</p>
          <p className="text-body-sm text-white/80">
            {gameSession.players.length} joueurs • 20 cartes complétées
          </p>
        </div>

        {/* Feedback options */}
        <div className="space-y-4 animate-slide-up">
          <p className="text-body-md text-white font-medium">Notez cette partie :</p>
          <div className="flex justify-center space-x-4">
            {feedbackOptions.map((option) => (
              <button
                key={option.rating}
                onClick={() => setFeedback(option.rating)}
                className={`feedback-emoji tap-highlight-none ${
                  feedback === option.rating
                    ? 'feedback-emoji-selected shadow-glow'
                    : 'feedback-emoji-unselected'
                }`}
              >
                <div className="text-3xl">{option.rating}</div>
                <div className="text-white text-caption mt-1">{option.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-4 animate-slide-up">
          <button
            onClick={handleReplay}
            className="btn-primary w-full shadow-glow tap-highlight-none"
          >
            🔄 Rejouer
          </button>
          
          <button
            onClick={handleShare}
            className="btn-secondary w-full glass tap-highlight-none"
          >
            📱 Partager avec des Amis
          </button>

          <button
            onClick={() => setShowCardSubmission(!showCardSubmission)}
            className="btn-secondary w-full glass tap-highlight-none"
          >
            💡 Soumettre une Carte
          </button>

          {showCardSubmission && (
            <div className="card-primary glass p-4 space-y-4 animate-slide-up">
              <h3 className="text-heading-md text-white font-bold">Proposez votre idée</h3>
              <p className="text-body-sm text-white/80">
                Partagez vos meilleures idées de cartes avec nous !
              </p>
              <textarea
                value={cardIdea}
                onChange={(e) => setCardIdea(e.target.value)}
                placeholder="Ex: Raconte ton pire date en imitant la personne..."
                className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 focus:border-white/50 focus:outline-none resize-none"
                rows={3}
                maxLength={200}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSubmitCardIdea}
                  disabled={!cardIdea.trim() || isSubmitting}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {isSubmitting ? '📤 Envoi...' : '🚀 Envoyer'}
                </button>
                <button
                  onClick={() => {
                    setShowCardSubmission(false);
                    setCardIdea('');
                  }}
                  className="btn-ghost text-white/60 hover:text-white px-4"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
          
          <button
            onClick={resetGame}
            className="btn-ghost w-full tap-highlight-none"
          >
            🏠 Retour à l'Accueil
          </button>
        </div>

        {/* Thank you message */}
        <div className="text-body-sm text-white/60 animate-fade-in">
          Merci d'avoir utilisé Partiz ! 🎊
        </div>
      </div>
    </div>
  );
};

export default FeedbackScreen;
