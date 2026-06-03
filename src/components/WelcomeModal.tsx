
import React from 'react';
import { X } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors tap-highlight-none"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="text-center space-y-6 pt-2">
          {/* Logo PARTIZ avec point rose */}
          <div className="flex justify-center items-center space-x-2">
            <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
            <h1 className="text-4xl font-bold text-white">PARTIZ</h1>
          </div>
          
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
          
          {/* Price */}
          <div className="text-center">
            <p className="text-white/80 text-sm">
              Gratuit 7 jours, puis 2,99€ hebdomadaire
            </p>
          </div>
          
          {/* CTA Button */}
          <button
            onClick={onUpgrade}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg tap-highlight-none"
          >
            🎮 DÉMARRER L'ESSAI
          </button>
          
          {/* Restore purchases */}
          <div className="text-center">
            <p className="text-white/50 text-xs">
              Restaurer les achats précédents
            </p>
          </div>
          
          {/* Legal links */}
          <div className="flex justify-center space-x-4 text-xs">
            <a href="#" className="text-white/50 hover:text-white/70">
              Conditions d'utilisation
            </a>
            <span className="text-white/30">•</span>
            <a href="#" className="text-white/50 hover:text-white/70">
              Politique de confidentialité
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
