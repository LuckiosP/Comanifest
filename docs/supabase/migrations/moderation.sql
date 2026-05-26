-- Phase 10 — manifestation moderation (pending review + email approve/decline)
-- Safe to re-run on an existing project.

alter table public.manifestations
  drop constraint if exists manifestations_status_check;

alter table public.manifestations
  add constraint manifestations_status_check
  check (status in ('active', 'pending', 'archived', 'deleted'));

alter table public.manifestations
  add column if not exists moderation_flagged_reason text,
  add column if not exists moderation_reviewed_at timestamptz,
  add column if not exists moderation_reviewed_by text,
  add column if not exists moderation_decline_feedback text;

create table if not exists public.moderation_review_tokens (
  id uuid primary key default gen_random_uuid(),
  manifestation_id uuid not null unique references public.manifestations (id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists moderation_review_tokens_token_idx
  on public.moderation_review_tokens (token);

alter table public.moderation_review_tokens enable row level security;

-- No public policies: service role only.

drop policy if exists "Manifestations are readable by everyone" on public.manifestations;

drop policy if exists "Public can read active manifestations" on public.manifestations;
create policy "Public can read active manifestations"
  on public.manifestations
  for select
  using (status = 'active');

drop policy if exists "Creators can read their own manifestations" on public.manifestations;
create policy "Creators can read their own manifestations"
  on public.manifestations
  for select
  using (auth.uid() = user_id);

drop policy if exists "Holders can read manifestations they joined" on public.manifestations;
create policy "Holders can read manifestations they joined"
  on public.manifestations
  for select
  using (
    exists (
      select 1
      from public.manifestation_joins j
      where j.manifestation_id = id
        and j.user_id = auth.uid()
    )
  );
