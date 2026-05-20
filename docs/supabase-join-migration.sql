-- Comanifest — Join flow (additive migration)
-- Run once in Supabase SQL Editor if you already created `manifestations` from an older `supabase-schema.sql`.
-- New projects can rely on the full `docs/supabase-schema.sql` instead (includes this block).

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

-- Joiner must be signed-in user row, and must not be the manifestation author (author is already counted in join_count).
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

-- Bump join_count on the parent row (SECURITY DEFINER so we do not need an UPDATE policy on manifestations for anon users).
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

drop trigger if exists manifestation_joins_increment_count on public.manifestation_joins;

create trigger manifestation_joins_increment_count
  after insert on public.manifestation_joins
  for each row
  execute function public.manifestation_joins_after_insert();
