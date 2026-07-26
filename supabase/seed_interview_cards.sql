-- Partiz — 30 cartes VIDES pour le mode Interview uniquement
-- À coller dans Supabase -> SQL Editor -> Run.
-- Idempotent : crée la colonne si besoin, et ne duplique pas si relancé.
-- Ensuite : remplis la colonne "content" de chaque ligne dans le Table Editor.
--
-- Paramètres pré-réglés pour CHAQUE carte :
--   is_interview = true   (n'apparaît QUE dans le mode Interview)
--   is_ref / is_vote / is_deep / is_premium / explicitly_sexual = false
--   alcohol_level = 0, sexual_level = 0
--   proximity_level = NULL  (aucune restriction de proximité)
--   date_mode = NULL, is_active = true

ALTER TABLE public.cards
  ADD COLUMN IF NOT EXISTS is_interview boolean NOT NULL DEFAULT false;

INSERT INTO public.cards
  (id, content, alcohol_level, sexual_level, is_deep, is_vote,
   proximity_level, date_mode, explicitly_sexual, is_ref, is_premium, is_interview, is_active)
VALUES
  ('itw_01', 'Interview 01 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_02', 'Interview 02 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_03', 'Interview 03 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_04', 'Interview 04 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_05', 'Interview 05 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_06', 'Interview 06 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_07', 'Interview 07 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_08', 'Interview 08 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_09', 'Interview 09 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_10', 'Interview 10 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_11', 'Interview 11 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_12', 'Interview 12 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_13', 'Interview 13 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_14', 'Interview 14 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_15', 'Interview 15 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_16', 'Interview 16 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_17', 'Interview 17 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_18', 'Interview 18 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_19', 'Interview 19 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_20', 'Interview 20 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_21', 'Interview 21 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_22', 'Interview 22 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_23', 'Interview 23 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_24', 'Interview 24 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_25', 'Interview 25 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_26', 'Interview 26 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_27', 'Interview 27 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_28', 'Interview 28 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_29', 'Interview 29 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true),
  ('itw_30', 'Interview 30 — à compléter', 0, 0, false, false, NULL, NULL, false, false, false, true, true)
ON CONFLICT (id) DO NOTHING;
