-- ============================================================
-- Marketplace Jardin — schéma initial (déjà exécuté)
-- Gardé ici comme référence de ce qui existe dans la base.
-- ============================================================

create extension if not exists "pgcrypto";

-- Utilisateurs (vendeur et/ou acheteur)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  prenom text not null,
  role text not null check (role in ('acheteur', 'vendeur')) default 'acheteur',
  photo_url text,
  description text,
  type_production text,
  latitude double precision,
  longitude double precision,
  rayon_recherche_km integer default 10,
  created_at timestamptz not null default now()
);

-- Annonces (produits à vendre)
create table public.products (
  id uuid primary key default gen_random_uuid(),
  vendeur_id uuid not null references public.profiles(id) on delete cascade,
  nom text not null,
  categorie text not null check (categorie in ('legume', 'fruit', 'oeuf', 'autre')),
  quantite_disponible numeric not null check (quantite_disponible >= 0),
  prix numeric not null check (prix >= 0),
  photo_url text,
  description text,
  statut text not null default 'disponible' check (statut in ('disponible', 'epuise', 'retire')),
  created_at timestamptz not null default now()
);

-- Commandes (achat direct sur l'annonce)
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  acheteur_id uuid not null references public.profiles(id),
  vendeur_id uuid not null references public.profiles(id),
  quantite numeric not null check (quantite > 0),
  prix_total numeric not null,
  statut text not null default 'commande' check (statut in ('commande', 'confirmee', 'annulee')),
  created_at timestamptz not null default now()
);

-- Favoris
create table public.favoris (
  id uuid primary key default gen_random_uuid(),
  acheteur_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (acheteur_id, product_id)
);

-- Stock qui se décrémente automatiquement à chaque commande
create or replace function public.decrementer_stock()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.products
    set quantite_disponible = quantite_disponible - new.quantite,
        statut = case when quantite_disponible - new.quantite <= 0 then 'epuise' else statut end
    where id = new.product_id;
  return new;
end;
$$;

create trigger on_order_created
  after insert on public.orders
  for each row execute function public.decrementer_stock();

-- Règles de confidentialité (qui peut voir/modifier quoi)
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.favoris enable row level security;

create policy "Profils visibles par tous les connectés"
  on public.profiles for select to authenticated using (true);

create policy "Créer son propre profil"
  on public.profiles for insert to authenticated with check (auth.uid() = id);

create policy "Modifier son propre profil"
  on public.profiles for update to authenticated using (auth.uid() = id);

create policy "Produits visibles par tous"
  on public.products for select to authenticated, anon using (true);

create policy "Le vendeur gère ses produits"
  on public.products for all to authenticated
  using (auth.uid() = vendeur_id) with check (auth.uid() = vendeur_id);

create policy "Voir ses propres commandes"
  on public.orders for select to authenticated
  using (auth.uid() = acheteur_id or auth.uid() = vendeur_id);

create policy "L'acheteur passe commande"
  on public.orders for insert to authenticated
  with check (auth.uid() = acheteur_id);

create policy "Gérer ses favoris"
  on public.favoris for all to authenticated
  using (auth.uid() = acheteur_id) with check (auth.uid() = acheteur_id);
