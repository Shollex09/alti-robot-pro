-- ============================================================
-- Marketplace Jardin — mise à niveau complète de la base
--
-- ⚠️ C'EST LE SEUL SCRIPT À CONNAÎTRE.
--
-- Il contient tout : tables, sécurité, automatismes, stockage des
-- photos, temps réel. Il est conçu pour être rejoué autant de fois
-- que voulu, sur une base neuve comme sur une base déjà en place :
-- ce qui existe est laissé tel quel, ce qui manque est ajouté.
--
-- À exécuter dans Supabase → SQL Editor → New query → Run.
-- Supabase affichera un avertissement (à cause des "drop policy") :
-- c'est normal, ces lignes ne suppriment que des règles aussitôt
-- recréées. Aucune donnée n'est touchée.
--
-- Les fichiers 01 à 07 restent là comme historique, mais rejouer
-- celui-ci suffit.
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================================
-- 1. TABLES
-- ============================================================

create table if not exists public.profiles (
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
alter table public.profiles add column if not exists couverture_url text;

create table if not exists public.products (
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

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  acheteur_id uuid not null references public.profiles(id),
  vendeur_id uuid not null references public.profiles(id),
  quantite numeric not null check (quantite > 0),
  prix_total numeric not null,
  statut text not null default 'commande' check (statut in ('commande', 'confirmee', 'annulee')),
  created_at timestamptz not null default now()
);

create table if not exists public.favoris (
  id uuid primary key default gen_random_uuid(),
  acheteur_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (acheteur_id, product_id)
);

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

create table if not exists public.reapprovisionnements (
  id uuid primary key default gen_random_uuid(),
  vendeur_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  date date not null default current_date,
  quantite numeric not null check (quantite > 0),
  commentaire text,
  created_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  acheteur_id uuid not null references public.profiles(id) on delete cascade,
  vendeur_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  dernier_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (acheteur_id, vendeur_id),
  check (acheteur_id <> vendeur_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  expediteur_id uuid not null references public.profiles(id) on delete cascade,
  texte text not null check (char_length(trim(texte)) between 1 and 2000),
  lu boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists messages_conversation_idx
  on public.messages (conversation_id, created_at desc);

create table if not exists public.signalements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  profil_signale_id uuid references public.profiles(id) on delete cascade,
  auteur_id uuid not null references public.profiles(id) on delete cascade,
  motif text not null,
  details text,
  traite boolean not null default false,
  created_at timestamptz not null default now(),
  check (num_nonnulls(product_id, profil_signale_id) = 1)
);
create unique index if not exists signalements_unicite_produit
  on public.signalements (auteur_id, product_id) where product_id is not null;
create unique index if not exists signalements_unicite_profil
  on public.signalements (auteur_id, profil_signale_id) where profil_signale_id is not null;

-- ============================================================
-- 2. AUTOMATISMES — le stock est tenu par la base, pas par l'appli
-- ============================================================

create or replace function public.appliquer_mouvement_stock(p_product uuid, p_delta numeric)
returns void language plpgsql security definer set search_path = public as $$
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
end; $$;

-- Refuse une commande qui dépasserait le stock. "for update" verrouille la
-- ligne : deux acheteurs simultanés ne peuvent pas passer chacun devant le
-- contrôle de l'autre.
create or replace function public.verifier_stock()
returns trigger language plpgsql security definer set search_path = public as $$
declare dispo numeric; etat text;
begin
  select quantite_disponible, statut into dispo, etat
    from public.products where id = new.product_id for update;
  if dispo is null then raise exception 'Ce produit n''existe plus.'; end if;
  if etat <> 'disponible' then raise exception 'Ce produit n''est plus disponible.'; end if;
  if new.quantite > dispo then
    raise exception 'Stock insuffisant : il reste % unité(s).', dispo;
  end if;
  return new;
end; $$;

create or replace function public.decrementer_stock()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform public.appliquer_mouvement_stock(new.product_id, -new.quantite);
  return new;
end; $$;

-- Une commande annulée remet la quantité en stock.
create or replace function public.restaurer_stock()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.statut = 'annulee' and old.statut <> 'annulee' then
    perform public.appliquer_mouvement_stock(new.product_id, old.quantite);
  end if;
  return new;
end; $$;

create or replace function public.verifier_stock_sortie()
returns trigger language plpgsql security definer set search_path = public as $$
declare dispo numeric;
begin
  if new.product_id is null then return new; end if;
  select quantite_disponible into dispo
    from public.products where id = new.product_id for update;
  if dispo is null then raise exception 'Ce produit n''existe plus.'; end if;
  if new.quantite > dispo then
    raise exception 'Stock insuffisant : il reste % unité(s).', dispo;
  end if;
  return new;
end; $$;

create or replace function public.mouvement_sortie()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    perform public.appliquer_mouvement_stock(new.product_id, -new.quantite);
    return new;
  else
    perform public.appliquer_mouvement_stock(old.product_id, old.quantite);
    return old;
  end if;
end; $$;

create or replace function public.mouvement_entree()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    perform public.appliquer_mouvement_stock(new.product_id, new.quantite);
    return new;
  else
    perform public.appliquer_mouvement_stock(old.product_id, -old.quantite);
    return old;
  end if;
end; $$;

create or replace function public.toucher_conversation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.conversations
    set dernier_message_at = new.created_at where id = new.conversation_id;
  return new;
end; $$;

-- Suppression de compte : la fonction atteint auth.users avec les droits de
-- son propriétaire, mais ne peut effacer que la ligne de la personne connectée.
create or replace function public.supprimer_mon_compte()
returns void language plpgsql security definer set search_path = public as $$
declare moi uuid := auth.uid();
begin
  if moi is null then raise exception 'Aucun compte connecté.'; end if;
  delete from auth.users where id = moi;
end; $$;
revoke all on function public.supprimer_mon_compte() from public;
grant execute on function public.supprimer_mon_compte() to authenticated;

drop trigger if exists on_order_check_stock on public.orders;
create trigger on_order_check_stock before insert on public.orders
  for each row execute function public.verifier_stock();

drop trigger if exists on_order_created on public.orders;
create trigger on_order_created after insert on public.orders
  for each row execute function public.decrementer_stock();

drop trigger if exists on_order_cancelled on public.orders;
create trigger on_order_cancelled after update on public.orders
  for each row execute function public.restaurer_stock();

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

drop trigger if exists message_touche_conversation on public.messages;
create trigger message_touche_conversation after insert on public.messages
  for each row execute function public.toucher_conversation();

-- ============================================================
-- 3. CONFIDENTIALITÉ — chacun ne voit et ne modifie que ce qui le concerne
-- ============================================================

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.favoris enable row level security;
alter table public.couts enable row level security;
alter table public.investissements enable row level security;
alter table public.consommations enable row level security;
alter table public.ventes_directes enable row level security;
alter table public.reapprovisionnements enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.signalements enable row level security;

drop policy if exists "Profils visibles par tous les connectés" on public.profiles;
create policy "Profils visibles par tous les connectés"
  on public.profiles for select to authenticated using (true);

drop policy if exists "Créer son propre profil" on public.profiles;
create policy "Créer son propre profil"
  on public.profiles for insert to authenticated with check (auth.uid() = id);

drop policy if exists "Modifier son propre profil" on public.profiles;
create policy "Modifier son propre profil"
  on public.profiles for update to authenticated using (auth.uid() = id);

drop policy if exists "Produits visibles par tous" on public.products;
create policy "Produits visibles par tous"
  on public.products for select to authenticated, anon using (true);

drop policy if exists "Le vendeur gère ses produits" on public.products;
create policy "Le vendeur gère ses produits"
  on public.products for all to authenticated
  using (auth.uid() = vendeur_id) with check (auth.uid() = vendeur_id);

drop policy if exists "Voir ses propres commandes" on public.orders;
create policy "Voir ses propres commandes"
  on public.orders for select to authenticated
  using (auth.uid() = acheteur_id or auth.uid() = vendeur_id);

drop policy if exists "L'acheteur passe commande" on public.orders;
create policy "L'acheteur passe commande"
  on public.orders for insert to authenticated with check (auth.uid() = acheteur_id);

-- Sans cette règle, "Confirmer" et "Annuler" ne font rien : la base refuse
-- la modification en silence, sans message d'erreur.
drop policy if exists "Le vendeur gère les commandes reçues" on public.orders;
create policy "Le vendeur gère les commandes reçues"
  on public.orders for update to authenticated
  using (auth.uid() = vendeur_id) with check (auth.uid() = vendeur_id);

drop policy if exists "Gérer ses favoris" on public.favoris;
create policy "Gérer ses favoris"
  on public.favoris for all to authenticated
  using (auth.uid() = acheteur_id) with check (auth.uid() = acheteur_id);

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

drop policy if exists "Voir ses conversations" on public.conversations;
create policy "Voir ses conversations" on public.conversations for select to authenticated
  using (auth.uid() = acheteur_id or auth.uid() = vendeur_id);

drop policy if exists "Ouvrir une conversation" on public.conversations;
create policy "Ouvrir une conversation" on public.conversations for insert to authenticated
  with check (auth.uid() = acheteur_id or auth.uid() = vendeur_id);

drop policy if exists "Voir les messages de ses conversations" on public.messages;
create policy "Voir les messages de ses conversations" on public.messages for select to authenticated
  using (exists (select 1 from public.conversations c where c.id = conversation_id
    and (auth.uid() = c.acheteur_id or auth.uid() = c.vendeur_id)));

drop policy if exists "Écrire dans ses conversations" on public.messages;
create policy "Écrire dans ses conversations" on public.messages for insert to authenticated
  with check (auth.uid() = expediteur_id and exists (
    select 1 from public.conversations c where c.id = conversation_id
      and (auth.uid() = c.acheteur_id or auth.uid() = c.vendeur_id)));

drop policy if exists "Marquer ses messages reçus comme lus" on public.messages;
create policy "Marquer ses messages reçus comme lus" on public.messages for update to authenticated
  using (expediteur_id <> auth.uid() and exists (
    select 1 from public.conversations c where c.id = conversation_id
      and (auth.uid() = c.acheteur_id or auth.uid() = c.vendeur_id)));

drop policy if exists "Signaler" on public.signalements;
create policy "Signaler" on public.signalements for insert to authenticated
  with check (auth.uid() = auteur_id);

drop policy if exists "Voir ses signalements" on public.signalements;
create policy "Voir ses signalements" on public.signalements for select to authenticated
  using (auth.uid() = auteur_id);

-- ============================================================
-- 4. PHOTOS
--
-- Le bucket est créé ici : inutile de passer par Storage → New bucket.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do update set public = true;

drop policy if exists "Photos visibles par tous" on storage.objects;
create policy "Photos visibles par tous"
  on storage.objects for select using (bucket_id = 'photos');

-- Chacun n'écrit que dans son propre dossier : produits/<son id>/…
drop policy if exists "Envoyer ses propres photos" on storage.objects;
create policy "Envoyer ses propres photos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'photos' and (storage.foldername(name))[2] = auth.uid()::text);

drop policy if exists "Supprimer ses propres photos" on storage.objects;
create policy "Supprimer ses propres photos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[2] = auth.uid()::text);

-- ============================================================
-- 5. TEMPS RÉEL — notifications de commande et messages
-- ============================================================

alter table public.orders replica identity full;
alter table public.messages replica identity full;

do $$ begin
  alter publication supabase_realtime add table public.orders;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then null; end $$;
