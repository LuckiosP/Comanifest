-- Phase 9 — creator hold notifications (email preferences + digest queue)
-- Run once in Supabase SQL Editor.

create table if not exists public.notification_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  updated_at timestamptz not null default now(),
  hold_updates_frequency text not null default 'off'
    check (hold_updates_frequency in ('off', 'instant', 'daily', 'weekly'))
);

alter table public.notification_preferences enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'notification_preferences'
      and policyname = 'Users manage their own notification preferences'
  ) then
    create policy "Users manage their own notification preferences"
      on public.notification_preferences
      for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;

create table if not exists public.hold_notification_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  creator_id uuid not null references auth.users (id) on delete cascade,
  manifestation_id uuid not null references public.manifestations (id) on delete cascade,
  manifestation_title text not null,
  join_count integer not null,
  digest_frequency text not null check (digest_frequency in ('daily', 'weekly')),
  sent_at timestamptz
);

create index if not exists hold_notification_events_pending_idx
  on public.hold_notification_events (digest_frequency, sent_at, creator_id);

alter table public.hold_notification_events enable row level security;

-- No public policies: only service role / security definer functions touch the queue.

create or replace function public.queue_hold_notification_event(
  p_creator_id uuid,
  p_manifestation_id uuid,
  p_manifestation_title text,
  p_join_count integer,
  p_digest_frequency text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_digest_frequency not in ('daily', 'weekly') then
    return;
  end if;

  insert into public.hold_notification_events (
    creator_id,
    manifestation_id,
    manifestation_title,
    join_count,
    digest_frequency
  ) values (
    p_creator_id,
    p_manifestation_id,
    p_manifestation_title,
    p_join_count,
    p_digest_frequency
  );
end;
$$;

revoke all on function public.queue_hold_notification_event(uuid, uuid, text, integer, text) from public;
grant execute on function public.queue_hold_notification_event(uuid, uuid, text, integer, text) to authenticated;
grant execute on function public.queue_hold_notification_event(uuid, uuid, text, integer, text) to service_role;

create or replace function public.get_creator_hold_notification_plan(
  p_manifestation_id uuid
)
returns table (
  creator_id uuid,
  creator_email text,
  hold_updates_frequency text,
  manifestation_title text,
  join_count integer
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  return query
  select
    m.user_id as creator_id,
    u.email as creator_email,
    coalesce(p.hold_updates_frequency, 'off') as hold_updates_frequency,
    m.title as manifestation_title,
    m.join_count as join_count
  from public.manifestations m
  join auth.users u on u.id = m.user_id
  left join public.notification_preferences p on p.user_id = m.user_id
  where m.id = p_manifestation_id;
end;
$$;

revoke all on function public.get_creator_hold_notification_plan(uuid) from public;
grant execute on function public.get_creator_hold_notification_plan(uuid) to authenticated;
grant execute on function public.get_creator_hold_notification_plan(uuid) to service_role;
