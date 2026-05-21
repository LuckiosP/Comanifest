-- Comanifest — Supabase database setup
-- Run this in the Supabase Dashboard: SQL Editor → New query → Run.
--
-- If you already ran an older version of this file, run the incremental migrations instead
-- of re-running the full script:
--   - **`docs/supabase-join-migration.sql`** — hold rows + join_count trigger
--   - **`docs/supabase-phase1-lifecycle-migration.sql`** — ends_at, status, creator reflection
--   - **`docs/supabase-withdraw-hold-migration.sql`** — withdraw hold (delete join + decrement count)
--
-- Before testing the app:
-- 1. Create a project at https://supabase.com
-- 2. Project Settings → API: copy "Project URL" and "anon public" key into .env.local
-- 3. Authentication → Providers → enable "Anonymous" sign-ins
-- 4. Bot protection: Authentication → Attack Protection → enable CAPTCHA (Cloudflare Turnstile recommended).
--    Add the provider secret in Supabase; add the Turnstile *site* key to `.env.local` as NEXT_PUBLIC_TURNSTILE_SITE_KEY.
--    Allow localhost in the Turnstile widget hostnames for local dev.
-- 5. Run this script

create table public.manifestations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 3 and 200),
  intention text not null check (char_length(intention) between 10 and 2000),
  category text not null,
  timeframe text,
  join_count integer not null default 1,
  ends_at timestamptz not null,
  status text not null default 'active'
    check (status in ('active', 'archived', 'deleted')),
  creator_reflection text
    check (creator_reflection is null or char_length(trim(creator_reflection)) between 10 and 2000),
  creator_reflection_success boolean,
  reflected_at timestamptz
);

create index manifestations_created_at_idx
  on public.manifestations (created_at desc);

create index manifestations_join_count_idx
  on public.manifestations (join_count desc);

create index manifestations_status_created_at_idx
  on public.manifestations (status, created_at desc);

create index manifestations_status_ends_at_idx
  on public.manifestations (status, ends_at);

alter table public.manifestations enable row level security;

create policy "Manifestations are readable by everyone"
  on public.manifestations
  for select
  using (true);

create policy "Users can insert their own manifestations"
  on public.manifestations
  for insert
  with check (auth.uid() = user_id);

create policy "Creators can update their own manifestations"
  on public.manifestations
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Join rows: one per user per manifestation; commitment text; trigger keeps join_count in sync.
create table public.manifestation_joins (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users (id) on delete cascade,
  manifestation_id uuid not null references public.manifestations (id) on delete cascade,
  commitment_note text not null
    check (char_length(trim(commitment_note)) between 20 and 500),
  unique (user_id, manifestation_id)
);

create index manifestation_joins_manifestation_id_idx
  on public.manifestation_joins (manifestation_id);

create index manifestation_joins_user_id_idx
  on public.manifestation_joins (user_id);

alter table public.manifestation_joins enable row level security;

create policy "Users can read their own joins"
  on public.manifestation_joins
  for select
  using (auth.uid() = user_id);

create policy "Users can insert join rows when not the creator"
  on public.manifestation_joins
  for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.manifestations m
      where m.id = manifestation_id
        and m.user_id is distinct from auth.uid()
    )
  );

create policy "Users can delete their own joins"
  on public.manifestation_joins
  for delete
  using (auth.uid() = user_id);

create or replace function public.manifestation_joins_after_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.manifestations
  set join_count = join_count + 1
  where id = new.manifestation_id;
  return new;
end;
$$;

create trigger manifestation_joins_increment_count
  after insert on public.manifestation_joins
  for each row
  execute function public.manifestation_joins_after_insert();

create or replace function public.manifestation_joins_after_delete()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.manifestations
  set join_count = greatest(1, join_count - 1)
  where id = old.manifestation_id;
  return old;
end;
$$;

create trigger manifestation_joins_decrement_count
  after delete on public.manifestation_joins
  for each row
  execute function public.manifestation_joins_after_delete();

create or replace function public.withdraw_manifestation_hold(p_manifestation_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_deleted int;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  delete from public.manifestation_joins
  where manifestation_id = p_manifestation_id
    and user_id = v_user_id;

  get diagnostics v_deleted = row_count;
  if v_deleted = 0 then
    raise exception 'You are not holding this manifestation';
  end if;
end;
$$;

grant execute on function public.withdraw_manifestation_hold(uuid) to anon, authenticated;
