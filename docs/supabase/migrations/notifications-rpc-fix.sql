-- Fix: get_creator_hold_notification_plan type mismatch
-- Error seen in production: "structure of query does not match function result type"
-- Cause: auth.users.email is varchar; function declares text. Cast explicitly.
-- Safe to re-run.

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
    m.user_id,
    u.email::text,
    coalesce(p.hold_updates_frequency, 'off')::text,
    m.title::text,
    m.join_count::integer
  from public.manifestations m
  join auth.users u on u.id = m.user_id
  left join public.notification_preferences p on p.user_id = m.user_id
  where m.id = p_manifestation_id;
end;
$$;

revoke all on function public.get_creator_hold_notification_plan(uuid) from public;
grant execute on function public.get_creator_hold_notification_plan(uuid) to authenticated;
grant execute on function public.get_creator_hold_notification_plan(uuid) to service_role;
