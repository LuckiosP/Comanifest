-- Security linter hardening — clears Supabase Database Linter WARN advisories.
-- Safe + idempotent: re-running has no ill effect. Run once in the Supabase SQL Editor.
--
-- Covers 9 of the 15 warnings. Deliberately NOT changed here (by design):
--   * auth_allow_anonymous_sign_ins on manifestations / manifestation_joins /
--     notification_preferences — Comanifest intentionally supports guest (anonymous)
--     browsing + holding. Restricting these to `authenticated` would break the guest model.
--   * withdraw_manifestation_hold executable by anon/authenticated — intentional; guests
--     and signed-in users call it directly from their own session to withdraw a hold.
--   * auth_leaked_password_protection — enable in the dashboard:
--     Authentication -> Attack Protection -> Leaked password protection.

-- ---------------------------------------------------------------------------
-- 1. Function Search Path Mutable (lint 0011) — pin search_path on 3 functions.
--    These are the only functions missing an explicit search_path; the join /
--    withdraw / notification functions already set it in their definitions.
-- ---------------------------------------------------------------------------

alter function public.is_service_role_request()
  set search_path = public, pg_temp;

alter function public.enforce_manifestation_insert()
  set search_path = public, pg_temp;

alter function public.enforce_manifestation_creator_update()
  set search_path = public, pg_temp;

-- ---------------------------------------------------------------------------
-- 2. SECURITY DEFINER trigger functions callable via the REST API
--    (lint 0028 anon + 0029 authenticated).
--    These only ever run from AFTER INSERT/DELETE triggers on
--    manifestation_joins — they should never be invoked directly as RPCs.
--    Revoking EXECUTE does NOT stop the triggers from firing (triggers run
--    regardless of the caller's EXECUTE privilege).
-- ---------------------------------------------------------------------------

revoke all on function public.manifestation_joins_after_insert()
  from public, anon, authenticated;

revoke all on function public.manifestation_joins_after_delete()
  from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. Notification RPCs callable by anon (lint 0028).
--    These are server-only helpers (called service-role-first from the app).
--    get_creator_hold_notification_plan even returns the creator's email, so
--    anon/authenticated must not be able to call it. Lock to service_role only.
-- ---------------------------------------------------------------------------

revoke all on function public.get_creator_hold_notification_plan(uuid)
  from public, anon, authenticated;
grant execute on function public.get_creator_hold_notification_plan(uuid)
  to service_role;

revoke all on function public.queue_hold_notification_event(uuid, uuid, text, integer, text)
  from public, anon, authenticated;
grant execute on function public.queue_hold_notification_event(uuid, uuid, text, integer, text)
  to service_role;
