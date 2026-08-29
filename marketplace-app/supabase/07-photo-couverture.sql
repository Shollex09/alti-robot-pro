-- ============================================================
-- Marketplace Jardin — photo de couverture des profils
-- À exécuter dans Supabase → SQL Editor → New query → Run
--
-- Une vraie photo en bannière (le potager, les poules, l'étal du
-- marché) remplace le dégradé décoratif : c'est ce qui donne à une
-- fiche producteur l'air d'une vraie vitrine.
-- ============================================================

alter table public.profiles
  add column if not exists couverture_url text;
