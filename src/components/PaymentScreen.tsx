
import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { useSubscription } from '../hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackEvent } from '../lib/analytics';
import AuthModal from './AuthModal';

const PaymentScreen = () => {
  const { setCurrentScreen } = useGame();
  const { createCheckoutSession, loading } = useSubscription();
  const [showAuth, setShowAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (session && showAuth) {
        setShowAuth(false);
        // Une fois connecté, démarrer l'abonnement
        createCheckoutSession();
      }
    });

    return () => subscription.unsubscribe();
  }, [showAuth, createCheckoutSession]);

  const handleBackToFree = () => {
    setCurrentScreen('players');
  };

  const handleStartSubscription = async () => {
    trackEvent('clic_premium', { source: 'paywall' });
    if (isAuthenticated) {
      console.log('Starting subscription process...');
      const result = await createCheckoutSession();
      if (result?.success) {
        console.log('Checkout session created successfully');
      } else {
        console.error('Failed to create checkout session:', result?.error);
      }
    } else {
      setShowAuth(true);
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="container-mobile section-spacing">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <button 
            onClick={handleBackToFree} 
            className="btn-ghost text-white/80 hover:text-white py-2 px-3 tap-highlight-none mb-6"
          >
            ← Retour à la version gratuite
          </button>

          <div className="text-6xl mb-4 animate-bounce-slow">💎</div>
          <h1 className="text-display-md text-white mb-2">Version Premium</h1>
          <p className="text-body-md text-white/80">
            Débloque tout le contenu de Partiz !
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-gradient-to-br from-pink-900/50 to-purple-900/50 border border-pink-500/30 rounded-2xl p-6 mb-8 animate-slide-up">
          <div className="text-center space-y-4">
            <div className="flex items-baseline justify-center space-x-2">
              <span className="text-4xl font-black text-white">2,99€</span>
              <span className="text-body-sm text-white/60">par semaine</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-white/90">
                <span className="text-green-400 text-xl">✓</span>
                <span>Cartes exclusives, rares & intenses</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <span className="text-green-400 text-xl">✓</span>
                <span>Intensité maximale (niveaux 4 & 5)</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <span className="text-green-400 text-xl">✓</span>
                <span>Cartes votes de groupe</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <span className="text-green-400 text-xl">✓</span>
                <span>Parties 2× plus longues</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <span className="text-green-400 text-xl">✓</span>
                <span>Nouvelles cartes en priorité</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <span className="text-green-400 text-xl">✓</span>
                <span>Annulation facile à tout moment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Button */}
        <button 
          onClick={handleStartSubscription}
          disabled={loading}
          className="btn-primary w-full shadow-glow tap-highlight-none mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Redirection vers Stripe...</span>
            </div>
          ) : (
            '🛒 S\'abonner maintenant - 2,99€/semaine'
          )}
        </button>

        {/* Alternative */}
        <div className="text-center">
          <p className="text-body-sm text-white/60 mb-4">
            Pas encore convaincu ?
          </p>
          <button 
            onClick={handleBackToFree} 
            className="text-pink-400 hover:text-pink-300 transition-colors tap-highlight-none"
          >
            Essayer la version gratuite →
          </button>
        </div>

        {/* Legal notice */}
        <div className="text-center mt-8 space-y-3">
          <p className="text-xs text-white/50">
            Abonnement 2,99€/semaine, sans engagement, résiliable à tout moment. Renouvellement
            automatique jusqu'à résiliation. Paiement sécurisé via Stripe.
          </p>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs">
            <Link to="/terms" className="text-white/50 underline hover:text-white/70">
              Conditions & abonnement
            </Link>
            <span className="text-white/30">•</span>
            <Link to="/privacy" className="text-white/50 underline hover:text-white/70">
              Confidentialité
            </Link>
            <span className="text-white/30">•</span>
            <Link to="/mentions" className="text-white/50 underline hover:text-white/70">
              Mentions légales
            </Link>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => setShowAuth(false)}
      />
    </div>
  );
};

export default PaymentScreen;
