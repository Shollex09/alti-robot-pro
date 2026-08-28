-- ============================================================
-- Marketplace Jardin — notifications de commande
-- À exécuter dans Supabase → SQL Editor → New query → Run
--
-- Active le temps réel sur la table des commandes : l'appli est
-- ainsi prévenue dès qu'une commande est passée ou change de statut.
-- Les règles de confidentialité continuent de s'appliquer : chacun ne
-- reçoit que les commandes qui le concernent.
-- ============================================================

-- "replica identity full" fait remonter aussi l'ancienne version de la
-- ligne : c'est ce qui permet de savoir qu'un statut vient de changer.
alter table public.orders replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.orders;
exception
  when duplicate_object then null; -- déjà activé, rien à faire
end
$$;
