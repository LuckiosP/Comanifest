-- Optional follow-up if hold emails still fail after deploy.
-- Grants notification RPCs to service_role (safe to re-run).

grant execute on function public.get_creator_hold_notification_plan(uuid) to service_role;
grant execute on function public.queue_hold_notification_event(uuid, uuid, text, integer, text) to service_role;
