-- Phase 1 — lifecycle columns on manifestations
-- Run in Supabase Dashboard → SQL Editor if you already have the base schema.
-- Safe to run once; uses IF NOT EXISTS / guarded constraints where possible.

alter table public.manifestations
  add column if not exists ends_at timestamptz,
  add column if not exists status text not null default 'active',
  add column if not exists creator_reflection text
    check (creator_reflection is null or char_length(trim(creator_reflection)) between 10 and 2000),
  add column if not exists creator_reflection_success boolean,
  add column if not exists reflected_at timestamptz;

-- Backfill end dates for rows created before this migration.
update public.manifestations
set ends_at = created_at + interval '90 days'
where ends_at is null;

alter table public.manifestations
  alter column ends_at set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'manifestations_status_check'
  ) then
    alter table public.manifestations
      add constraint manifestations_status_check
      check (status in ('active', 'archived', 'deleted'));
  end if;
end $$;

create index if not exists manifestations_status_created_at_idx
  on public.manifestations (status, created_at desc);

create index if not exists manifestations_status_ends_at_idx
  on public.manifestations (status, ends_at);

-- Creators can update their own rows (archive, reflection, etc. in later phases).
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'manifestations'
      and policyname = 'Creators can update their own manifestations'
  ) then
    create policy "Creators can update their own manifestations"
      on public.manifestations
      for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;
