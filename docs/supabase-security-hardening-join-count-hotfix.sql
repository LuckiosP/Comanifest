-- Hotfix: join_count starts at 1 (creator is already "in"), not 0.
-- Run this if you already applied supabase-security-hardening-migration.sql with join_count = 0.

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
