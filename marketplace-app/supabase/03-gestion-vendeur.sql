-- ============================================================
-- Marketplace Jardin — gestion vendeur (reprise du poulailler)
-- À exécuter dans Supabase → SQL Editor → New query → Run
--
-- Ajoute les tables qui manquaient pour retrouver toute la logique
-- économique du poulailler : coûts, consommation personnelle,
-- investissements, ventes directes (hors appli) et réapprovisionnements.
-- Le stock reste tenu automatiquement par la base à chaque mouvement.
-- ============================================================

-- ------------------------------------------------------------
-- Tables
-- ------------------------------------------------------------
create table if not exists public.couts (
  id uuid primary key default gen_random_uuid(),
  vendeur_id uuid not null references public.profiles(id) on delete cascade,
  date date not null default current_date,
  categorie text not null default 'Autre',
  montant numeric not null check (montant >= 0),
  commentaire text,
  created_at timestamptz not null default now()
);

create table if not exists public.investissements (
  id uuid primary key default gen_random_uuid(),
  vendeur_id uuid not null references public.profiles(id) on delete cascade,
  date date not null default current_date,
  libelle text not null,
  montant numeric not null check (montant >= 0),
  commentaire text,
  created_at timestamptz not null default now()
);

-- Ce que le producteur consomme lui-même : sort du stock sans argent,
-- mais compte comme une économie réalisée.
create table if not exists public.consommations (
  id uuid primary key default gen_random_uuid(),
  vendeur_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  date date not null default current_date,
  quantite numeric not null check (quantite > 0),
  prix_estime numeric not null check (prix_estime >= 0),
  commentaire text,
  created_at timestamptz not null default now()
);

-- Ventes faites en direct (marché, voisin...) pour que les chiffres
-- soient complets, pas seulement les commandes passées dans l'appli.
create table if not exists public.ventes_directes (
  id uuid primary key default gen_random_uuid(),
  vendeur_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  date date not null default current_date,
  client_nom text not null,
  quantite numeric not null check (quantite > 0),
  prix_unitaire numeric not null check (prix_unitaire >= 0),
  commentaire text,
  created_at timestamptz not null default now()
);

-- Entrées de stock (récolte, ponte...) : l'équivalent des "pontes".
create table if not exists public.reapprovisionnements (
  id uuid primary key default gen_random_uuid(),
  vendeur_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  date date not null default current_date,
  quantite numeric not null check (quantite > 0),
  commentaire text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Le stock suit automatiquement chaque mouvement
-- ------------------------------------------------------------
create or replace function public.appliquer_mouvement_stock(p_product uuid, p_delta numeric)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_product is null then return; end if;
  update public.products
    set quantite_disponible = greatest(0, quantite_disponible + p_delta),
        statut = case
          when statut = 'retire' then 'retire'
          when quantite_disponible + p_delta <= 0 then 'epuise'
          else 'disponible'
        end
    where id = p_product;
end;
$$;

-- Refuse de sortir plus que le stock disponible.
create or replace function public.verifier_stock_sortie()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  dispo numeric;
begin
  if new.product_id is null then return new; end if;
  select quantite_disponible into dispo
    from public.products where id = new.product_id for update;
  if dispo is null then
    raise exception 'Ce produit n''existe plus.';
  end if;
  if new.quantite > dispo then
    raise exception 'Stock insuffisant : il reste % unité(s).', dispo;
  end if;
  return new;
end;
$$;

create or replace function public.mouvement_sortie()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    perform public.appliquer_mouvement_stock(new.product_id, -new.quantite);
    return new;
  else
    perform public.appliquer_mouvement_stock(old.product_id, old.quantite);
    return old;
  end if;
end;
$$;

create or replace function public.mouvement_entree()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    perform public.appliquer_mouvement_stock(new.product_id, new.quantite);
    return new;
  else
    perform public.appliquer_mouvement_stock(old.product_id, -old.quantite);
    return old;
  end if;
end;
$$;

drop trigger if exists conso_check_stock on public.consommations;
create trigger conso_check_stock before insert on public.consommations
  for each row execute function public.verifier_stock_sortie();
drop trigger if exists conso_mouvement on public.consommations;
create trigger conso_mouvement after insert or delete on public.consommations
  for each row execute function public.mouvement_sortie();

drop trigger if exists vente_directe_check_stock on public.ventes_directes;
create trigger vente_directe_check_stock before insert on public.ventes_directes
  for each row execute function public.verifier_stock_sortie();
drop trigger if exists vente_directe_mouvement on public.ventes_directes;
create trigger vente_directe_mouvement after insert or delete on public.ventes_directes
  for each row execute function public.mouvement_sortie();

drop trigger if exists reappro_mouvement on public.reapprovisionnements;
create trigger reappro_mouvement after insert or delete on public.reapprovisionnements
  for each row execute function public.mouvement_entree();

-- ------------------------------------------------------------
-- Confidentialité : chacun ne voit et ne gère que ses propres lignes
-- ------------------------------------------------------------
alter table public.couts enable row level security;
alter table public.investissements enable row level security;
alter table public.consommations enable row level security;
alter table public.ventes_directes enable row level security;
alter table public.reapprovisionnements enable row level security;

drop policy if exists "Le vendeur gère ses coûts" on public.couts;
create policy "Le vendeur gère ses coûts" on public.couts for all to authenticated
  using (auth.uid() = vendeur_id) with check (auth.uid() = vendeur_id);

drop policy if exists "Le vendeur gère ses investissements" on public.investissements;
create policy "Le vendeur gère ses investissements" on public.investissements for all to authenticated
  using (auth.uid() = vendeur_id) with check (auth.uid() = vendeur_id);

drop policy if exists "Le vendeur gère sa consommation" on public.consommations;
create policy "Le vendeur gère sa consommation" on public.consommations for all to authenticated
  using (auth.uid() = vendeur_id) with check (auth.uid() = vendeur_id);

drop policy if exists "Le vendeur gère ses ventes directes" on public.ventes_directes;
create policy "Le vendeur gère ses ventes directes" on public.ventes_directes for all to authenticated
  using (auth.uid() = vendeur_id) with check (auth.uid() = vendeur_id);

drop policy if exists "Le vendeur gère ses réappros" on public.reapprovisionnements;
create policy "Le vendeur gère ses réappros" on public.reapprovisionnements for all to authenticated
  using (auth.uid() = vendeur_id) with check (auth.uid() = vendeur_id);
