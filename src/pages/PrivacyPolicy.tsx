import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Politique de confidentialité (RGPD).
 * ⚠️ BROUILLON : compléter les champs [entre crochets] après création de la
 * SASU et faire relire par un juriste. Mettre à jour la liste des
 * sous-traitants si un outil d'analytics est ajouté.
 */
const LAST_UPDATE = 'Juillet 2026';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto max-w-3xl px-5 py-10">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
        </Link>

        <h1 className="mb-1 text-3xl font-bold">Politique de confidentialité</h1>
        <p className="mb-10 text-sm text-white/50">Dernière mise à jour : {LAST_UPDATE}</p>

        <div className="space-y-9 text-[15px] leading-relaxed text-white/80">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement de vos données est [RAISON SOCIALE DE LA SASU], éditrice
              de l'application <strong>Partiz</strong> (voir les{' '}
              <Link to="/mentions" className="text-pink-400 hover:text-pink-300">mentions légales</Link>).
              Nous nous engageons à protéger votre vie privée conformément au Règlement Général sur
              la Protection des Données (RGPD).
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">2. Données que nous collectons</h2>
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li><strong>Compte :</strong> adresse e-mail et identifiant de compte (via notre prestataire d'authentification), uniquement si vous créez un compte pour vous abonner.</li>
              <li><strong>Abonnement :</strong> statut de votre abonnement (actif / inactif, date de renouvellement). Les données de paiement (carte bancaire) sont traitées directement par Stripe et ne nous sont jamais transmises.</li>
              <li><strong>Préférences de jeu :</strong> réglages de partie (intensité, mode). Certaines préférences restent stockées localement sur votre appareil.</li>
              <li><strong>Données techniques :</strong> données de fonctionnement et de sécurité (par ex. adresse IP, type d'appareil) traitées par nos hébergeurs.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">3. Finalités & bases légales</h2>
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>Fournir le service et gérer votre compte — <em>exécution du contrat</em>.</li>
              <li>Gérer les abonnements et les paiements — <em>exécution du contrat</em> et <em>obligations légales</em> (comptables).</li>
              <li>Assurer la sécurité et le bon fonctionnement du service — <em>intérêt légitime</em>.</li>
              <li>Améliorer l'application (statistiques d'usage) — <em>consentement</em> ou <em>intérêt légitime</em> selon l'outil utilisé.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">4. Sous-traitants & partage</h2>
            <p>Nous ne vendons jamais vos données. Nous faisons appel à des prestataires qui les traitent pour notre compte :</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li><strong>Supabase</strong> — authentification et base de données ;</li>
              <li><strong>Stripe</strong> — paiement et gestion des abonnements ;</li>
              <li><strong>Vercel</strong> — hébergement de l'application ;</li>
              <li className="text-white/50">[Outil d'analytics — à ajouter le cas échéant].</li>
            </ul>
            <p className="mt-3">
              Certains prestataires peuvent traiter des données hors de l'Union européenne, dans le
              cadre de garanties appropriées (clauses contractuelles types).
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">5. Durée de conservation</h2>
            <p>
              Nous conservons vos données aussi longtemps que nécessaire à la fourniture du service
              et au respect de nos obligations légales (notamment comptables). Les données d'un
              compte inactif ou supprimé sont effacées ou anonymisées dans un délai raisonnable.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">6. Vos droits (RGPD)</h2>
            <p>Vous disposez des droits d'accès, de rectification, d'effacement, de portabilité, de limitation et d'opposition. Pour les exercer :</p>
            <p className="mt-3">
              <a href="mailto:[EMAIL DE CONTACT]" className="text-pink-400 hover:text-pink-300">[EMAIL DE CONTACT]</a>
            </p>
            <p className="mt-3">
              Vous pouvez également introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300">www.cnil.fr</a>).
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">7. Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour
              protéger vos données (chiffrement en transit, accès restreint).
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">8. Modifications</h2>
            <p>
              Cette politique peut évoluer. Toute modification importante vous sera notifiée dans
              l'application. La date de dernière mise à jour figure en haut de cette page.
            </p>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-4 border-t border-white/10 pt-8 text-sm">
          <Link to="/mentions" className="text-white/60 hover:text-white">Mentions légales</Link>
          <Link to="/terms" className="text-white/60 hover:text-white">Conditions d'utilisation</Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
