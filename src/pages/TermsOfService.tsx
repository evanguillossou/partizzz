import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Conditions Générales d'Utilisation et de Vente (CGU / CGV).
 * ⚠️ BROUILLON : compléter les champs [entre crochets] après création de la
 * SASU et faire relire par un juriste (droit conso, rétractation, loi Évin).
 */
const LAST_UPDATE = 'Juillet 2026';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto max-w-3xl px-5 py-10">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
        </Link>

        <h1 className="mb-1 text-3xl font-bold">Conditions générales d'utilisation et de vente</h1>
        <p className="mb-10 text-sm text-white/50">Dernière mise à jour : {LAST_UPDATE}</p>

        <div className="space-y-9 text-[15px] leading-relaxed text-white/80">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">1. Objet</h2>
            <p>
              Les présentes conditions régissent l'utilisation de l'application <strong>Partiz</strong>,
              un jeu à boire édité par [RAISON SOCIALE DE LA SASU] (voir les{' '}
              <Link to="/mentions" className="text-pink-400 hover:text-pink-300">mentions légales</Link>).
              En utilisant Partiz, vous acceptez ces conditions. Si vous ne les acceptez pas,
              n'utilisez pas le service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">2. Accès réservé aux majeurs & consommation responsable</h2>
            <p>
              Partiz est un jeu à boire réservé aux personnes de <strong>18 ans ou plus</strong>.
              En accédant au jeu, vous confirmez avoir l'âge légal pour consommer de l'alcool.
            </p>
            <p className="mt-3">
              <strong>L'abus d'alcool est dangereux pour la santé. À consommer avec modération.</strong>{' '}
              Le jeu propose un mode sans alcool. Chaque joueur reste seul responsable de sa
              consommation ; ne conduisez jamais après avoir bu. L'éditeur ne saurait être tenu
              responsable des conséquences d'une consommation d'alcool par les utilisateurs.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">3. Description du service</h2>
            <p>Partiz propose un jeu de cartes interactif pour animer les soirées, incluant :</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>une version gratuite avec un ensemble de cartes et de modes de jeu ;</li>
              <li>une version Premium par abonnement donnant accès à du contenu et des options supplémentaires ;</li>
              <li>une personnalisation de l'intensité des parties.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">4. Abonnement Premium, prix et paiement</h2>
            <ul className="mt-1 list-disc space-y-2 pl-5">
              <li>L'abonnement Premium est proposé au prix de <strong>2,99 € TTC par semaine</strong>, facturé de manière récurrente.</li>
              <li>Le paiement est traité de façon sécurisée par notre prestataire <strong>Stripe</strong> ; l'éditeur ne conserve aucune donnée de carte bancaire.</li>
              <li>L'abonnement est <strong>sans engagement</strong> et se renouvelle automatiquement jusqu'à sa résiliation.</li>
              <li>Vous pouvez résilier à tout moment ; la résiliation prend effet à la fin de la période en cours, sans remboursement au prorata de la période déjà entamée.</li>
              <li>Les prix peuvent être modifiés ; toute modification vous sera notifiée à l'avance et ne s'appliquera qu'aux périodes suivantes.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">5. Droit de rétractation</h2>
            <p>
              Conformément à l'article L221-28 du Code de la consommation, en souscrivant à un
              contenu numérique fourni immédiatement, vous demandez son exécution immédiate et
              reconnaissez <strong>renoncer à votre droit de rétractation</strong> de 14 jours dès
              lors que l'accès au contenu Premium vous a été ouvert. À défaut d'exécution
              immédiate, le délai de rétractation de 14 jours s'applique.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">6. Utilisation acceptable</h2>
            <p>Vous vous engagez à :</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>utiliser le service de manière légale et respectueuse ;</li>
              <li>ne pas partager votre compte avec des tiers ;</li>
              <li>ne pas tenter de contourner les mesures de sécurité ou de restriction d'âge ;</li>
              <li>respecter les droits de propriété intellectuelle de l'éditeur.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">7. Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu de Partiz (cartes, textes, visuels, logo, design) est protégé
              par le droit d'auteur. Toute reproduction, distribution ou modification sans
              autorisation écrite est interdite.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">8. Limitation de responsabilité</h2>
            <p>
              Le service est fourni « en l'état ». L'éditeur ne garantit pas un fonctionnement
              ininterrompu ou exempt d'erreurs. Sa responsabilité ne saurait être engagée pour
              l'usage fait du jeu par les utilisateurs, notamment en matière de consommation
              d'alcool.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">9. Résiliation & modifications</h2>
            <p>
              L'éditeur peut suspendre l'accès en cas de violation des présentes conditions. Ces
              conditions peuvent être modifiées ; les modifications prennent effet dès leur
              publication et votre utilisation continue vaut acceptation.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">10. Droit applicable & contact</h2>
            <p>
              Les présentes conditions sont soumises au droit français. Pour toute question ou
              réclamation, contactez-nous à{' '}
              <a href="mailto:[EMAIL DE CONTACT]" className="text-pink-400 hover:text-pink-300">[EMAIL DE CONTACT]</a>.
            </p>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-4 border-t border-white/10 pt-8 text-sm">
          <Link to="/mentions" className="text-white/60 hover:text-white">Mentions légales</Link>
          <Link to="/privacy" className="text-white/60 hover:text-white">Politique de confidentialité</Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
