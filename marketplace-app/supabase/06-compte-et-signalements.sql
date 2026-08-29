-- ============================================================
-- Marketplace Jardin — suppression de compte et signalements
-- À exécuter dans Supabase → SQL Editor → New query → Run
--
-- 1. Permet à chacun de supprimer définitivement son compte
--    (Google Play l'exige pour toute appli qui crée des comptes).
-- 2. Permet de signaler une annonce abusive.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Suppression de compte
--
-- La fonction s'exécute avec les droits de son propriétaire pour
-- atteindre auth.users, mais ne supprime que la ligne de la personne
-- connectée : auth.uid() ne peut pas être falsifié depuis l'appli.
-- Tout le reste (profil, annonces, commandes, messages) part en
-- cascade grâce aux clés étrangères.
-- ------------------------------------------------------------
create or replace function public.supprimer_mon_compte()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  moi uuid := auth.uid();
begin
  if moi is null then
    raise exception 'Aucun compte connecté.';
  end if;
  delete from auth.users where id = moi;
end;
$$;

revoke all on function public.supprimer_mon_compte() from public;
grant execute on function public.supprimer_mon_compte() to authenticated;

-- ------------------------------------------------------------
-- 2. Signalements
-- ------------------------------------------------------------
create table if not exists public.signalements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  profil_signale_id uuid references public.profiles(id) on delete cascade,
  auteur_id uuid not null references public.profiles(id) on delete cascade,
  motif text not null,
  details text,
  traite boolean not null default false,
  created_at timestamptz not null default now(),
  -- On signale soit une annonce, soit un profil, pas les deux.
  check (num_nonnulls(product_id, profil_signale_id) = 1)
);

-- Un même signalement ne part qu'une fois.
create unique index if not exists signalements_unicite_produit
  on public.signalements (auteur_id, product_id) where product_id is not null;
create unique index if not exists signalements_unicite_profil
  on public.signalements (auteur_id, profil_signale_id) where profil_signale_id is not null;

alter table public.signalements enable row level security;

-- On signale en son propre nom, et on ne relit que ses signalements.
-- Le traitement se fait depuis le tableau de bord Supabase.
drop policy if exists "Signaler" on public.signalements;
create policy "Signaler" on public.signalements for insert to authenticated
  with check (auth.uid() = auteur_id);

drop policy if exists "Voir ses signalements" on public.signalements;
create policy "Voir ses signalements" on public.signalements for select to authenticated
  using (auth.uid() = auteur_id);
