import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Mentions légales — obligatoire en France (art. 6 LCEN).
 * ⚠️ BROUILLON : compléter les champs entre crochets une fois la SASU
 * immatriculée, puis faire relire par un juriste.
 */
const LAST_UPDATE = 'Juillet 2026';

const LegalNotice = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto max-w-3xl px-5 py-10">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
        </Link>

        <h1 className="mb-1 text-3xl font-bold">Mentions légales</h1>
        <p className="mb-10 text-sm text-white/50">Dernière mise à jour : {LAST_UPDATE}</p>

        <div className="space-y-9 text-[15px] leading-relaxed text-white/80">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">1. Éditeur du site et de l'application</h2>
            <p>Le site et l'application <strong>Partiz</strong> (« Partiz ») sont édités par :</p>
            <ul className="mt-3 space-y-1.5">
              <li><strong>Raison sociale :</strong> [RAISON SOCIALE DE LA SASU]</li>
              <li><strong>Forme juridique :</strong> SASU (société par actions simplifiée unipersonnelle)</li>
              <li><strong>Capital social :</strong> [MONTANT] €</li>
              <li><strong>Siège social :</strong> [ADRESSE DU SIÈGE SOCIAL]</li>
              <li><strong>SIREN / SIRET :</strong> [NUMÉRO SIRET]</li>
              <li><strong>RCS :</strong> [VILLE D'IMMATRICULATION] [NUMÉRO RCS]</li>
              <li><strong>N° TVA intracommunautaire :</strong> [FR + NUMÉRO] <span className="text-white/40">(le cas échéant)</span></li>
              <li><strong>Directeur de la publication :</strong> Evan Guillossou, président</li>
              <li><strong>Contact :</strong> <a href="mailto:[EMAIL DE CONTACT]" className="text-pink-400 hover:text-pink-300">[EMAIL DE CONTACT]</a></li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">2. Hébergement</h2>
            <p>L'application est hébergée par :</p>
            <ul className="mt-3 space-y-1.5">
              <li>
                <strong>Vercel Inc.</strong> — 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis —{' '}
                <a href="https://vercel.com" className="text-pink-400 hover:text-pink-300" target="_blank" rel="noopener noreferrer">vercel.com</a>
                <span className="text-white/40"> [adresse à vérifier]</span>
              </li>
              <li>
                <strong>Supabase Inc.</strong> (base de données et authentification) —{' '}
                <a href="https://supabase.com" className="text-pink-400 hover:text-pink-300" target="_blank" rel="noopener noreferrer">supabase.com</a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">3. Accès réservé aux personnes majeures</h2>
            <p>
              Partiz est un jeu à boire destiné à un public adulte. Son accès est réservé aux
              personnes âgées de <strong>18 ans ou plus</strong>. L'abus d'alcool est dangereux
              pour la santé ; à consommer avec modération.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">4. Propriété intellectuelle</h2>
            <p>
              L'ensemble des contenus présents dans Partiz (cartes, textes, visuels, logo, nom
              « Partiz », design et code) est protégé par le droit de la propriété intellectuelle
              et demeure la propriété exclusive de l'éditeur, sauf mention contraire. Toute
              reproduction, représentation, modification ou exploitation, totale ou partielle,
              sans autorisation écrite préalable est interdite.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">5. Données personnelles</h2>
            <p>
              Le traitement de vos données personnelles est décrit dans notre{' '}
              <Link to="/privacy" className="text-pink-400 hover:text-pink-300">Politique de confidentialité</Link>.
              Conformément au RGPD, vous disposez de droits d'accès, de rectification et de
              suppression que vous pouvez exercer à l'adresse de contact ci-dessus.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">6. Contact</h2>
            <p>
              Pour toute question relative au site ou à l'application, vous pouvez écrire à{' '}
              <a href="mailto:[EMAIL DE CONTACT]" className="text-pink-400 hover:text-pink-300">[EMAIL DE CONTACT]</a>.
            </p>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-4 border-t border-white/10 pt-8 text-sm">
          <Link to="/terms" className="text-white/60 hover:text-white">Conditions d'utilisation</Link>
          <Link to="/privacy" className="text-white/60 hover:text-white">Politique de confidentialité</Link>
        </div>
      </div>
    </div>
  );
};

export default LegalNotice;
