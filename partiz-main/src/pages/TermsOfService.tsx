import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Conditions d'Utilisation</h1>
          <p className="text-white/80">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>

        <div className="space-y-8 text-white/90 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptation des Conditions</h2>
            <p>
              En utilisant notre application de jeu de cartes pour couples, vous acceptez d'être lié par ces conditions d'utilisation. 
              Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Description du Service</h2>
            <p>
              Notre application propose un jeu de cartes interactif conçu pour renforcer les liens entre couples à travers des questions, 
              défis et activités personnalisées. Le service inclut :
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
              <li>Accès à une collection de cartes de jeu</li>
              <li>Personnalisation selon les préférences du couple</li>
              <li>Système d'abonnement pour accéder à du contenu premium</li>
              <li>Suggestions d'activités basées sur votre relation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Abonnements et Paiements</h2>
            <p>
              Certaines fonctionnalités nécessitent un abonnement payant. Les modalités de paiement sont les suivantes :
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
              <li>Les abonnements sont facturés de manière récurrente</li>
              <li>Vous pouvez annuler votre abonnement à tout moment</li>
              <li>Aucun remboursement pour les périodes déjà facturées</li>
              <li>Les prix peuvent être modifiés avec un préavis de 30 jours</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Utilisation Acceptable</h2>
            <p>Vous vous engagez à :</p>
            <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
              <li>Utiliser le service de manière respectueuse et légale</li>
              <li>Ne pas partager votre compte avec des tiers</li>
              <li>Ne pas tenter de contourner les mesures de sécurité</li>
              <li>Respecter les droits d'auteur et la propriété intellectuelle</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Propriété Intellectuelle</h2>
            <p>
              Tout le contenu de l'application, incluant les cartes, textes, images et design, est protégé par des droits d'auteur. 
              Vous ne pouvez pas reproduire, distribuer ou modifier ce contenu sans autorisation écrite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Limitation de Responsabilité</h2>
            <p>
              L'application est fournie "en l'état". Nous ne garantissons pas que le service sera ininterrompu ou exempt d'erreurs. 
              Notre responsabilité est limitée au montant payé pour le service au cours des 12 derniers mois.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Résiliation</h2>
            <p>
              Nous nous réservons le droit de suspendre ou résilier votre accès au service en cas de violation de ces conditions. 
              Vous pouvez également résilier votre compte à tout moment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Modifications</h2>
            <p>
              Nous pouvons modifier ces conditions à tout moment. Les modifications prennent effet dès leur publication. 
              Votre utilisation continue du service constitue votre acceptation des nouvelles conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">9. Contact</h2>
            <p>
              Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter via l'application 
              ou par email.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20">
          <Link to="/">
            <Button className="bg-white text-purple-900 hover:bg-white/90">
              Retour à l'application
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;