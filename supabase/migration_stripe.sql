-- Partiz — RLS de la table `subscribers` pour le flux Stripe (Payment Link + webhook)
-- À coller dans Supabase Studio → SQL Editor → Run. Idempotent.
--
-- Principe : l'utilisateur connecté peut LIRE sa propre ligne (pour afficher
-- son statut premium). Il ne peut PAS écrire (sinon il pourrait se passer
-- premium gratuitement). Le webhook Stripe écrit via la clé service_role,
-- qui contourne la RLS.

alter table public.subscribers enable row level security;

-- Lecture de sa propre ligne uniquement.
drop policy if exists "subscribers_select_own" on public.subscribers;
create policy "subscribers_select_own"
  on public.subscribers
  for select
  to authenticated
  using (user_id = auth.uid());

-- IMPORTANT : aucune policy INSERT/UPDATE/DELETE pour `authenticated` ou `anon`.
-- Cela bloque toute écriture côté client. Le webhook (service_role) n'est pas
-- soumis à la RLS et peut écrire normalement.
--
-- ⚠️ Si une ancienne policy autorisait les écritures client (héritage Lovable),
-- supprime-la. Pour lister les policies existantes :
--   select policyname, cmd, roles from pg_policies where tablename = 'subscribers';
-- Puis, le cas échéant :
--   drop policy "<nom_de_la_policy>" on public.subscribers;
