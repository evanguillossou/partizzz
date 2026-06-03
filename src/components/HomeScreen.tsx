
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Play, Settings, X, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { useSubscription } from '../hooks/useSubscription';
import WelcomeModal from './WelcomeModal';
import AdminCardsScreen from './AdminCardsScreen';

const HomeScreen = () => {
  const { setCurrentScreen } = useGame();
  const { subscribed, subscription_tier, subscription_end, openCustomerPortal } = useSubscription();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // Admin access - you can change this condition or implement proper auth later
  const isAdmin = import.meta.env.DEV; // Only show in development

  if (showAdmin) {
    return <AdminCardsScreen onBack={() => setShowAdmin(false)} />;
  }

  const handleClose = () => {
    setCurrentScreen('players');
  };

  const formatSubscriptionEnd = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors tap-highlight-none"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="text-center space-y-6 pt-2">
          {/* Logo */}
          <div className="flex justify-center items-center">
            <img 
              src="/lovable-uploads/609e73fd-d36b-480a-b409-7ef6119bdc26.png" 
              alt="Logo" 
              className="h-24 w-auto object-contain"
            />
          </div>
          
          {/* Subscription Status */}
          {subscribed ? (
            <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">Premium Actif</span>
              </div>
              <p className="text-green-300 text-sm">
                {subscription_tier} • Renouvellement le {subscription_end ? formatSubscriptionEnd(subscription_end) : 'N/A'}
              </p>
              <button
                onClick={openCustomerPortal}
                className="mt-3 text-green-400 hover:text-green-300 text-sm underline"
              >
                Gérer mon abonnement
              </button>
            </div>
          ) : (
            <>
              {/* Title */}
              <h2 className="text-2xl text-white font-bold">
                C'est parti ! 🚀
              </h2>
              
              {/* Features list */}
              <div className="space-y-4 text-left">
                <div className="flex items-center space-x-3 text-white/90">
                  <span className="text-2xl">🔓</span>
                  <span className="text-sm">Débloque tous les modes</span>
                </div>
                <div className="flex items-center space-x-3 text-white/90">
                  <span className="text-2xl">🃏</span>
                  <span className="text-sm">Plus de 1000 cartes exclusives</span>
                </div>
                <div className="flex items-center space-x-3 text-white/90">
                  <span className="text-2xl">🆕</span>
                  <span className="text-sm">Ajout régulier de contenu</span>
                </div>
              </div>
              
              {/* CTA Button */}
              <button
                onClick={() => setCurrentScreen('players')}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg tap-highlight-none"
              >
                🎮 COMMENCER À JOUER
              </button>
            </>
          )}
          
          {/* Legal links */}
          <div className="flex justify-center space-x-4 text-xs">
            <Link to="/terms" className="text-white/50 hover:text-white/70">
              Conditions d'utilisation
            </Link>
            <span className="text-white/30">•</span>
            <Link to="/privacy" className="text-white/50 hover:text-white/70">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>

      <WelcomeModal 
        isOpen={showWelcome} 
        onClose={() => setShowWelcome(false)}
        onUpgrade={() => setCurrentScreen('payment')}
      />
    </div>
  );
};

export default HomeScreen;
