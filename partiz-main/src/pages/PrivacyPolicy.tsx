import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => {
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
          <h1 className="text-4xl font-bold mb-2">Politique de Confidentialité</h1>
          <p className="text-white/80">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>

        <div className="space-y-8 text-white/90 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Introduction</h2>
            <p>
              Nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles. 
              Cette politique explique comment nous collectons, utilisons et protégeons vos informations 
              lorsque vous utilisez notre application de jeu de cartes pour couples.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Données Collectées</h2>
            <p>Nous collectons les types d'informations suivants :</p>
            <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
              <li><strong>Informations de compte :</strong> Email, mot de passe, préférences utilisateur</li>
              <li><strong>Données de jeu :</strong> Préférences du couple, réponses aux questions, progression</li>
              <li><strong>Informations de paiement :</strong> Traitées de manière sécurisée via Stripe</li>
              <li><strong>Données techniques :</strong> Adresse IP, type d'appareil, navigateur</li>
              <li><strong>Cookies :</strong> Pour améliorer votre expérience utilisateur</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Utilisation des Données</h2>
            <p>Nous utilisons vos données pour :</p>
            <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
              <li>Fournir et personnaliser notre service</li>
              <li>Gérer votre compte et vos abonnements</li>
              <li>Améliorer l'expérience utilisateur</li>
              <li>Envoyer des notifications importantes</li>
              <li>Assurer la sécurité et prévenir la fraude</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Partage des Données</h2>
            <p>Nous ne vendons jamais vos données personnelles. Nous pouvons les partager uniquement avec :</p>
            <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
              <li><strong>Prestataires de services :</strong> Supabase (hébergement), Stripe (paiements)</li>
              <li><strong>Autorités légales :</strong> Si requis par la loi</li>
              <li><strong>Votre consentement :</strong> Avec votre autorisation explicite</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Sécurité des Données</h2>
            <p>
              Nous mettons en place des mesures de sécurité appropriées pour protéger vos données :
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
              <li>Chiffrement des données en transit et au repos</li>
              <li>Authentification sécurisée</li>
              <li>Accès limité aux données par le personnel autorisé</li>
              <li>Surveillance et détection des incidents de sécurité</li>
              <li>Sauvegardes régulières et sécurisées</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Vos Droits (RGPD)</h2>
            <p>Conformément au RGPD, vous avez les droits suivants :</p>
            <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
              <li><strong>Accès :</strong> Demander une copie de vos données</li>
              <li><strong>Rectification :</strong> Corriger les données inexactes</li>
              <li><strong>Suppression :</strong> Demander la suppression de vos données</li>
              <li><strong>Portabilité :</strong> Recevoir vos données dans un format structuré</li>
              <li><strong>Opposition :</strong> Vous opposer au traitement de vos données</li>
              <li><strong>Limitation :</strong> Demander la limitation du traitement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Cookies et Technologies Similaires</h2>
            <p>
              Nous utilisons des cookies pour améliorer votre expérience. Ces cookies nous permettent de :
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
              <li>Maintenir votre session connectée</li>
              <li>Mémoriser vos préférences</li>
              <li>Analyser l'utilisation de l'application</li>
              <li>Personnaliser le contenu</li>
            </ul>
            <p className="mt-3">
              Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Conservation des Données</h2>
            <p>
              Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services 
              ou pour respecter nos obligations légales. Les données de compte inactif peuvent être supprimées 
              après 3 ans d'inactivité.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">9. Transferts Internationaux</h2>
            <p>
              Vos données peuvent être traitées dans des pays autres que le vôtre. Nous nous assurons que 
              ces transferts respectent les standards de protection des données applicables.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">10. Modifications de cette Politique</h2>
            <p>
              Nous pouvons modifier cette politique de confidentialité. Les modifications importantes 
              vous seront notifiées par email ou via l'application. La date de dernière mise à jour 
              est indiquée en haut de cette page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">11. Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, 
              vous pouvez nous contacter via l'application ou par email. Nous nous engageons à répondre 
              dans les 30 jours.
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

export default PrivacyPolicy;