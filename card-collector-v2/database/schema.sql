-- QUENQUEN CORP / Card Collector Volume 2
-- PHASE 1: schema only. Run manually in Supabase SQL Editor after review.
-- This does not alter existing analytics tables.
-- Important: no client-side INSERT/UPDATE/DELETE on inventories.
create table if not exists public.qc_v2_cards (
  card_code text primary key,
  tier text not null check (tier in ('standard','h')),
  card_number integer not null,
  check (
    (tier='standard' and card_number between 1 and 113 and card_code = card_number::text)
    or (tier='h' and card_number between 1 and 7 and card_code = 'H'||card_number::text)
  )
);
create table if not exists public.qc_v2_collection_entries (
  id bigint generated always as identity primary key,
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  card_code text not null references public.qc_v2_cards(card_code),
  redemption_id text not null unique,
  acquired_at timestamptz not null default now()
);
create index if not exists qc_v2_collection_owner_idx on public.qc_v2_collection_entries(owner_user_id,acquired_at desc);
alter table public.qc_v2_cards enable row level security;
alter table public.qc_v2_collection_entries enable row level security;
revoke all on public.qc_v2_cards from anon, authenticated;
revoke all on public.qc_v2_collection_entries from anon, authenticated;
grant select on public.qc_v2_cards to authenticated;
grant select on public.qc_v2_collection_entries to authenticated;
drop policy if exists qc_v2_cards_read on public.qc_v2_cards;
create policy qc_v2_cards_read on public.qc_v2_cards for select to authenticated using (true);
drop policy if exists qc_v2_own_entries_read on public.qc_v2_collection_entries;
create policy qc_v2_own_entries_read on public.qc_v2_collection_entries
for select to authenticated using ((select auth.uid()) = owner_user_id);
-- Deliberately NO client-side write policies. A verified server-side
-- redemption handler will be added in a later phase.
-- Seed exactly 113 standard cards and 7 H cards:
insert into public.qc_v2_cards(card_code,tier,card_number)
select n::text,'standard',n from generate_series(1,113) as n
on conflict (card_code) do nothing;
insert into public.qc_v2_cards(card_code,tier,card_number)
select 'H'||n,'h',n from generate_series(1,7) as n
on conflict (card_code) do nothing;
