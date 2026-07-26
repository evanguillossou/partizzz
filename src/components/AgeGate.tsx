import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * AgeGate — barrière 18+ affichée au tout premier accès (avant la popup d'accueil).
 *
 * Partiz est un jeu à boire : la loi encadre l'accès des mineurs et la promotion
 * de l'alcool (loi Évin). Ce gate confirme la majorité et affiche le message
 * sanitaire obligatoire. Le choix est mémorisé dans localStorage.
 *
 * - « J'ai 18 ans ou plus »  → on entre, choix mémorisé (partiz_age_ok = '1').
 * - « J'ai moins de 18 ans » → écran bloquant, aucun accès au jeu.
 *
 * ⚠️ Un simple gate déclaratif n'est pas une vérification d'identité. À faire
 * relire par un juriste selon la stratégie de communication (loi Évin).
 */
const STORAGE_KEY = 'partiz_age_ok';

const ModerationLine = () => (
  <p className="text-[11px] leading-relaxed text-white/50">
    L'abus d'alcool est dangereux pour la santé. À consommer avec modération.
  </p>
);

const AgeGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [refused, setRefused] = useState<boolean>(false);

  useEffect(() => {
    try {
      setConfirmed(localStorage.getItem(STORAGE_KEY) === '1');
    } catch {
      setConfirmed(false);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* localStorage indisponible : on laisse quand même entrer pour cette session */
    }
    setConfirmed(true);
  };

  if (confirmed) return <>{children}</>;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="agegate-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black p-6"
    >
      <div className="w-full max-w-sm text-center">
        <img
          src="/logo.png"
          alt="Partiz"
          className="mx-auto mb-8 h-16 w-auto object-contain"
        />

        {!refused ? (
          <>
            <h1 id="agegate-title" className="mb-3 text-2xl font-bold text-white">
              Tu as 18 ans ou plus ?
            </h1>
            <p className="mb-8 text-sm leading-relaxed text-white/70">
              Partiz est un <span className="font-semibold text-white">jeu à boire</span> réservé
              aux personnes majeures. En entrant, tu confirmes avoir l'âge légal pour consommer
              de l'alcool dans ton pays.
            </p>

            <div className="space-y-3">
              <button
                onClick={accept}
                className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 px-5 py-3.5 font-bold text-white shadow-lg transition-all hover:from-pink-600 hover:to-pink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black tap-highlight-none"
              >
                J'ai 18 ans ou plus — Entrer
              </button>
              <button
                onClick={() => setRefused(true)}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white/70 transition-all hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 tap-highlight-none"
              >
                J'ai moins de 18 ans
              </button>
            </div>

            <div className="mt-8 space-y-3">
              <ModerationLine />
              <div className="flex justify-center gap-3 text-[11px] text-white/40">
                <Link to="/mentions" className="hover:text-white/70">Mentions légales</Link>
                <span>•</span>
                <Link to="/terms" className="hover:text-white/70">CGU</Link>
                <span>•</span>
                <Link to="/privacy" className="hover:text-white/70">Confidentialité</Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="mb-3 text-2xl font-bold text-white">Désolé, reviens plus tard 🚫</h1>
            <p className="mb-8 text-sm leading-relaxed text-white/70">
              Partiz est réservé aux personnes majeures. Tu ne peux pas accéder au jeu pour
              le moment.
            </p>
            <button
              onClick={() => setRefused(false)}
              className="text-sm text-white/50 underline transition-colors hover:text-white/80 tap-highlight-none"
            >
              ← Retour
            </button>
            <div className="mt-8">
              <ModerationLine />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AgeGate;
