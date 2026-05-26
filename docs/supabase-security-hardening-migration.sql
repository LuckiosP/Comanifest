-- Security hardening — RLS, creator update guards, join rules, notification RPC lockdown
-- Safe to re-run on an existing project. Run once in Supabase SQL Editor after moderation migration.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.is_service_role_request()
returns boolean
language sql
stable
as $$
  select coalesce(
    (current_setting('request.jwt.claims', true)::jsonb ->> 'role') = 'service_role',
    false
  );
$$;

-- ---------------------------------------------------------------------------
-- manifestations: INSERT policy + BEFORE INSERT/UPDATE triggers
-- ---------------------------------------------------------------------------

drop policy if exists "Users can insert their own manifestations" on public.manifestations;

create policy "Users can insert their own manifestations"
  on public.manifestations
  for insert
  with check (
    auth.uid() = user_id
    and status in ('active', 'pending')
    and join_count = 1
    and moderation_reviewed_at is null
    and moderation_reviewed_by is null
    and moderation_decline_feedback is null
  );

create or replace function public.enforce_manifestation_insert()
returns trigger
language plpgsql
as $$
begin
  if public.is_service_role_request()
     or current_user in ('postgres', 'supabase_admin') then
    return new;
  end if;

  if new.user_id is distinct from auth.uid() then
    return new;
  end if;

  if new.status not in ('active', 'pending') then
    raise exception 'invalid manifestation status on insert';
  end if;

  if new.moderation_flagged_reason is not null and new.status <> 'pending' then
    raise exception 'flagged manifestations must be pending';
  end if;

  if new.join_count <> 1 then
    raise exception 'join_count must start at one (creator is already holding)';
  end if;

  if new.moderation_reviewed_at is not null
     or new.moderation_reviewed_by is not null
     or new.moderation_decline_feedback is not null then
    raise exception 'moderation audit fields are read-only';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_manifestation_insert on public.manifestations;

create trigger enforce_manifestation_insert
  before insert on public.manifestations
  for each row
  execute function public.enforce_manifestation_insert();

create or replace function public.enforce_manifestation_creator_update()
returns trigger
language plpgsql
as $$
begin
  if public.is_service_role_request()
     or current_user in ('postgres', 'supabase_admin') then
    return new;
  end if;

  -- Allow join_count bumps from manifestation_joins SECURITY DEFINER trigger only.
  if (to_jsonb(new) - 'join_count') is not distinct from (to_jsonb(old) - 'join_count')
     and new.join_count is distinct from old.join_count then
    return new;
  end if;

  if old.user_id is distinct from auth.uid() then
    return new;
  end if;

  if new.join_count is distinct from old.join_count then
    raise exception 'join_count is read-only';
  end if;

  if new.moderation_reviewed_at is distinct from old.moderation_reviewed_at
     or new.moderation_reviewed_by is distinct from old.moderation_reviewed_by
     or new.moderation_decline_feedback is distinct from old.moderation_decline_feedback
     or new.moderation_flagged_reason is distinct from old.moderation_flagged_reason then
    raise exception 'moderation fields are read-only';
  end if;

  if new.status is distinct from old.status then
    if old.status = 'pending' and new.status = 'active' then
      raise exception 'cannot self-approve pending manifestation';
    end if;

    if new.status = 'active' and old.status <> 'active' then
      raise exception 'cannot set manifestation to active';
    end if;

    if old.status = 'archived' or old.status = 'deleted' then
      raise exception 'cannot change status of archived or deleted manifestation';
    end if;

    if new.status not in ('archived', 'deleted') then
      raise exception 'invalid status transition';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_manifestation_creator_update on public.manifestations;

create trigger enforce_manifestation_creator_update
  before update on public.manifestations
  for each row
  execute function public.enforce_manifestation_creator_update();

-- ---------------------------------------------------------------------------
-- manifestation_joins: only join active, open manifestations
-- ---------------------------------------------------------------------------

drop policy if exists "Users can insert join rows when not the creator" on public.manifestation_joins;

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
        and m.status = 'active'
        and m.ends_at > now()
    )
  );

-- ---------------------------------------------------------------------------
-- Notification RPCs: service role only (no authenticated caller)
-- ---------------------------------------------------------------------------

revoke execute on function public.get_creator_hold_notification_plan(uuid) from authenticated;
revoke execute on function public.queue_hold_notification_event(uuid, uuid, text, integer, text) from authenticated;

grant execute on function public.get_creator_hold_notification_plan(uuid) to service_role;
grant execute on function public.queue_hold_notification_event(uuid, uuid, text, integer, text) to service_role;
