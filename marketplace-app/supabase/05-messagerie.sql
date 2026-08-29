-- ============================================================
-- Marketplace Jardin — messagerie simple
-- À exécuter dans Supabase → SQL Editor → New query → Run
--
-- Permet à un acheteur et un producteur de discuter avant de valider
-- une commande : ajuster une quantité, organiser un retrait.
-- Une seule conversation par paire acheteur / vendeur.
-- ============================================================

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  acheteur_id uuid not null references public.profiles(id) on delete cascade,
  vendeur_id uuid not null references public.profiles(id) on delete cascade,
  -- Le produit qui a lancé la discussion, gardé pour le contexte.
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

-- ------------------------------------------------------------
-- La conversation remonte en haut de la liste à chaque message
-- ------------------------------------------------------------
create or replace function public.toucher_conversation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.conversations
    set dernier_message_at = new.created_at
    where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists message_touche_conversation on public.messages;
create trigger message_touche_conversation
  after insert on public.messages
  for each row execute function public.toucher_conversation();

-- ------------------------------------------------------------
-- Confidentialité : seuls les deux participants voient et écrivent
-- ------------------------------------------------------------
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

drop policy if exists "Voir ses conversations" on public.conversations;
create policy "Voir ses conversations" on public.conversations for select to authenticated
  using (auth.uid() = acheteur_id or auth.uid() = vendeur_id);

drop policy if exists "Ouvrir une conversation" on public.conversations;
create policy "Ouvrir une conversation" on public.conversations for insert to authenticated
  with check (auth.uid() = acheteur_id or auth.uid() = vendeur_id);

drop policy if exists "Voir les messages de ses conversations" on public.messages;
create policy "Voir les messages de ses conversations" on public.messages for select to authenticated
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (auth.uid() = c.acheteur_id or auth.uid() = c.vendeur_id)
    )
  );

-- On n'écrit qu'en son propre nom, et seulement dans ses conversations.
drop policy if exists "Écrire dans ses conversations" on public.messages;
create policy "Écrire dans ses conversations" on public.messages for insert to authenticated
  with check (
    auth.uid() = expediteur_id
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (auth.uid() = c.acheteur_id or auth.uid() = c.vendeur_id)
    )
  );

-- Marquer comme lus les messages reçus.
drop policy if exists "Marquer ses messages reçus comme lus" on public.messages;
create policy "Marquer ses messages reçus comme lus" on public.messages for update to authenticated
  using (
    expediteur_id <> auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (auth.uid() = c.acheteur_id or auth.uid() = c.vendeur_id)
    )
  );

-- ------------------------------------------------------------
-- Temps réel, pour recevoir les messages sans rafraîchir
-- ------------------------------------------------------------
alter table public.messages replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.messages;
exception
  when duplicate_object then null; -- déjà activé
end
$$;
