-- Coarse country at create/hold — for aggregated operator analytics only (phase 11 prep).
-- Safe to re-run.

alter table public.manifestations
  add column if not exists creator_country char(2)
    check (creator_country is null or creator_country ~ '^[A-Z]{2}$');

alter table public.manifestation_joins
  add column if not exists holder_country char(2)
    check (holder_country is null or holder_country ~ '^[A-Z]{2}$');

create index if not exists manifestations_creator_country_idx
  on public.manifestations (creator_country)
  where creator_country is not null;

create index if not exists manifestation_joins_holder_country_idx
  on public.manifestation_joins (holder_country)
  where holder_country is not null;

comment on column public.manifestations.creator_country is
  'ISO 3166-1 alpha-2 from edge geo at create time; aggregated in operator analytics only.';

comment on column public.manifestation_joins.holder_country is
  'ISO 3166-1 alpha-2 from edge geo at hold time; aggregated in operator analytics only.';

-- Keep creator_country immutable for end-user updates (service role may backfill).
create or replace function public.enforce_manifestation_creator_update()
returns trigger
language plpgsql
as $$
begin
  if public.is_service_role_request()
     or current_user in ('postgres', 'supabase_admin') then
    return new;
  end if;

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

  if new.creator_country is distinct from old.creator_country then
    raise exception 'creator_country is read-only';
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
