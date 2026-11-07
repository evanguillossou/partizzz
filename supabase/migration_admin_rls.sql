-- ════════════════════════════════════════════════════════════════════════════
-- Partiz — Back-office : administrateurs + verrouillage de la table `cards`
-- À exécuter UNE fois dans Supabase → SQL Editor.
--
-- Avant : la clé publique de l'app (visible par tous dans le navigateur)
-- pouvait potentiellement écrire dans `cards`.
-- Après : tout le monde peut LIRE les cartes actives (le jeu en a besoin),
-- seuls les administrateurs peuvent créer / modifier / supprimer, et voir
-- les cartes désactivées.
--
-- ⚠️ Remplace TON_EMAIL_ICI (étape 4) par l'email du compte avec lequel tu te
-- connectes au back-office. Ce compte doit déjà exister
-- (Supabase → Authentication → Users).
-- Le script peut être relancé sans risque (idempotent).
-- ════════════════════════════════════════════════════════════════════════════

-- 1. Table des administrateurs ───────────────────────────────────────────────
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

drop policy if exists "admins_read_own" on public.admins;
create policy "admins_read_own" on public.admins
  for select to authenticated
  using (user_id = auth.uid());

-- 2. Fonction « suis-je administrateur ? » ───────────────────────────────────
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
grant execute on function public.is_admin() to anon, authenticated;

-- 3. Verrouillage de la table cards ──────────────────────────────────────────
alter table public.cards enable row level security;

-- On repart de zéro : suppression des anciennes règles éventuelles.
do $$
declare p record;
begin
  for p in select policyname from pg_policies
           where schemaname = 'public' and tablename = 'cards'
  loop
    execute format('drop policy %I on public.cards', p.policyname);
  end loop;
end $$;

-- Lecture : cartes actives pour tout le monde ; toutes les cartes pour les admins.
create policy "cards_read" on public.cards
  for select to anon, authenticated
  using (is_active = true or public.is_admin());

-- Écriture : administrateurs uniquement.
create policy "cards_admin_insert" on public.cards
  for insert to authenticated
  with check (public.is_admin());

create policy "cards_admin_update" on public.cards
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "cards_admin_delete" on public.cards
  for delete to authenticated
  using (public.is_admin());

-- 4. Te déclarer administrateur ──────────────────────────────────────────────
insert into public.admins (user_id)
select id from auth.users where email = 'TON_EMAIL_ICI'
on conflict do nothing;

-- 5. Vérification : doit afficher ton email. Si le résultat est vide, l'email
--    de l'étape 4 ne correspond à aucun compte existant.
select u.email as administrateur
from public.admins a
join auth.users u on u.id = a.user_id;
