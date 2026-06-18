-- Partiz — Ajout du mode "Interview"
-- Ajoute la colonne is_interview sur la table cards.
-- NOT NULL DEFAULT false => toutes les cartes existantes passent automatiquement à "no".
-- À exécuter dans Supabase → SQL Editor.

ALTER TABLE public.cards
  ADD COLUMN IF NOT EXISTS is_interview boolean NOT NULL DEFAULT false;
