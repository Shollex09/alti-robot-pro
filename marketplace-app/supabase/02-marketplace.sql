-- ============================================================
-- Marketplace Jardin — complément pour les écrans v1
-- À exécuter dans Supabase → SQL Editor → New query → Run
--
-- Ajoute :
--   1. le droit pour le vendeur de confirmer/annuler une commande
--   2. un garde-fou anti-survente (on ne peut pas commander plus que le stock)
--   3. le retour du stock quand une commande est annulée
--   4. le stockage des photos (produits et profils)
-- ============================================================

-- ------------------------------------------------------------
-- 1. Le vendeur peut confirmer ou annuler les commandes reçues
-- ------------------------------------------------------------
drop policy if exists "Le vendeur gère les commandes reçues" on public.orders;
create policy "Le vendeur gère les commandes reçues"
  on public.orders for update to authenticated
  using (auth.uid() = vendeur_id)
  with check (auth.uid() = vendeur_id);

-- ------------------------------------------------------------
-- 2. Impossible de commander plus que le stock disponible
-- ------------------------------------------------------------
create or replace function public.verifier_stock()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  dispo numeric;
  etat text;
begin
  -- "for update" verrouille la ligne : deux acheteurs simultanés ne peuvent
  -- pas passer chacun devant le contrôle de stock de l'autre.
  select quantite_disponible, statut into dispo, etat
    from public.products where id = new.product_id for update;

  if dispo is null then
    raise exception 'Ce produit n''existe plus.';
  end if;
  if etat <> 'disponible' then
    raise exception 'Ce produit n''est plus disponible.';
  end if;
  if new.quantite > dispo then
    raise exception 'Stock insuffisant : il reste % unité(s).', dispo;
  end if;
  return new;
end;
$$;

drop trigger if exists on_order_check_stock on public.orders;
create trigger on_order_check_stock
  before insert on public.orders
  for each row execute function public.verifier_stock();

-- ------------------------------------------------------------
-- 3. Une commande annulée remet la quantité en stock
-- ------------------------------------------------------------
create or replace function public.restaurer_stock()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.statut = 'annulee' and old.statut <> 'annulee' then
    update public.products
      set quantite_disponible = quantite_disponible + old.quantite,
          statut = case when statut = 'epuise' then 'disponible' else statut end
      where id = new.product_id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_order_cancelled on public.orders;
create trigger on_order_cancelled
  after update on public.orders
  for each row execute function public.restaurer_stock();

-- ------------------------------------------------------------
-- 4. Stockage des photos
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

drop policy if exists "Photos visibles par tous" on storage.objects;
create policy "Photos visibles par tous"
  on storage.objects for select
  using (bucket_id = 'photos');

-- Chaque utilisateur n'écrit que dans son propre dossier (ex: produits/<son id>/…)
drop policy if exists "Envoyer ses propres photos" on storage.objects;
create policy "Envoyer ses propres photos"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'photos'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

drop policy if exists "Supprimer ses propres photos" on storage.objects;
create policy "Supprimer ses propres photos"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'photos'
    and (storage.foldername(name))[2] = auth.uid()::text
  );
