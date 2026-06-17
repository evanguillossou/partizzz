# Brancher Stripe sur Partiz (mode LIVE)

Approche **Payment Link + webhook** (comme Givrr). Le code est prêt ; il reste
les étapes côté dashboards Stripe & Supabase. Compte ~15 min.

---

## 1. Stripe — Produit & Payment Link (LIVE)

> Bascule bien Stripe en mode **Live** (interrupteur en haut à droite), pas Test.

1. **Produits** → *Ajouter un produit*
   - Nom : `Partiz Premium`
   - Tarif : `2,99 €` · **Récurrent** · `Hebdomadaire`
   - Enregistre.
2. **Payment Links** → *Nouveau* → choisis le produit `Partiz Premium`.
   - Dans *Après le paiement* : redirige vers `https://<ton-domaine>/?paid=1`
     (ou la page d'accueil de Partiz).
   - Crée le lien → copie l'URL `https://buy.stripe.com/xxxx…` → c'est
     **`VITE_STRIPE_LINK_WEEKLY`**.
3. **Settings → Billing → Customer portal** → active le portail, puis copie le
   lien du portail → **`VITE_STRIPE_PORTAL_URL`**.

---

## 2. Variables d'environnement front

Pose ces deux variables là où le front est déployé (Vercel/Lovable) **et** dans
`.env` en local :

```
VITE_STRIPE_LINK_WEEKLY=https://buy.stripe.com/xxxxxxxx
VITE_STRIPE_PORTAL_URL=https://billing.stripe.com/p/login/xxxxxxxx
```

Redéploie le front après les avoir posées.

---

## 3. Supabase — déployer le webhook

Depuis le dossier du projet :

```bash
# une seule fois : lier le projet
supabase login
supabase link --project-ref ciixbycvzaexsdearmmk

# poser les secrets (clés LIVE)
supabase secrets set STRIPE_SECRET_KEY=sk_live_xxx
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx   # (voir étape 4, à mettre après)

# déployer la fonction (pas besoin de JWT : Stripe appelle sans token)
supabase functions deploy stripe-webhook --no-verify-jwt
```

L'URL du webhook sera :
`https://ciixbycvzaexsdearmmk.supabase.co/functions/v1/stripe-webhook`

---

## 4. Stripe — créer le endpoint webhook (LIVE)

1. **Developers → Webhooks → Add endpoint**
   - URL : `https://ciixbycvzaexsdearmmk.supabase.co/functions/v1/stripe-webhook`
   - Événements à écouter :
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
2. Crée → copie le **Signing secret** `whsec_…`.
3. Repose-le dans Supabase puis redéploie :
   ```bash
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx
   supabase functions deploy stripe-webhook --no-verify-jwt
   ```

---

## 5. Supabase — RLS de la table `subscribers`

Colle le contenu de [`supabase/migration_stripe.sql`](supabase/migration_stripe.sql)
dans **SQL Editor → Run**. Ça garantit :
- l'utilisateur connecté lit **sa** ligne (statut premium affiché dans l'app) ;
- personne ne peut s'auto-abonner côté client (seul le webhook écrit).

---

## 6. Test de bout en bout (en live, petit montant)

1. Connecte-toi dans l'app (l'abonnement exige un compte → on récupère `user.id`).
2. Va sur l'écran Premium → *S'abonner* → paie 2,99 € (vrai paiement).
3. Reviens dans l'app : le statut passe à **Premium Actif** (lecture de
   `subscribers`). Les cartes premium, l'intensité 4-5, T'as la réf, etc. se
   débloquent.
4. Vérifie le portail client (résiliation) via *Gérer mon abonnement*.

> Astuce : tu peux te rembourser le test depuis Stripe → Paiements.

---

## Récap des secrets / variables

| Où | Clé | Valeur |
|----|-----|--------|
| Front (Vercel/Lovable + .env) | `VITE_STRIPE_LINK_WEEKLY` | lien Payment Link live |
| Front | `VITE_STRIPE_PORTAL_URL` | lien portail client |
| Supabase secrets | `STRIPE_SECRET_KEY` | `sk_live_…` |
| Supabase secrets | `STRIPE_WEBHOOK_SECRET` | `whsec_…` |

`SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont injectés automatiquement dans la fonction.
