# Supabase SQL

Run scripts in the **Supabase Dashboard → SQL Editor** for the same project as your app env vars.

## Fresh project

Run once:

1. [`schema.sql`](./schema.sql) — `manifestations`, `manifestation_joins`, RLS, join-count triggers

Then run migrations below that post-date the bundled schema (moderation, security, notifications if not in schema yet).

## Existing project (incremental)

Run only what you have not applied yet, in order:

| Order | File | Purpose |
|------:|------|---------|
| 1 | [`migrations/join.sql`](./migrations/join.sql) | Hold rows + `join_count` trigger |
| 2 | [`migrations/phase1-lifecycle.sql`](./migrations/phase1-lifecycle.sql) | `ends_at`, `status`, creator reflection |
| 3 | [`migrations/withdraw-hold.sql`](./migrations/withdraw-hold.sql) | Withdraw hold + decrement count |
| 4 | [`migrations/notifications.sql`](./migrations/notifications.sql) | Hold email prefs + digest queue |
| 5 | [`migrations/notifications-rpc-fix.sql`](./migrations/notifications-rpc-fix.sql) | Fix RPC type mismatch (if hold emails fail) |
| 6 | [`migrations/notifications-service-role-grants.sql`](./migrations/notifications-service-role-grants.sql) | Grant notification RPCs to `service_role` |
| 7 | [`migrations/moderation.sql`](./migrations/moderation.sql) | Pending review + moderation fields |
| 8 | [`migrations/security-hardening.sql`](./migrations/security-hardening.sql) | RLS/trigger hardening + RPC lockdown |
| 9 | [`migrations/security-hardening-join-count-hotfix.sql`](./migrations/security-hardening-join-count-hotfix.sql) | Only if hardening was run with `join_count = 0` |
| 10 | [`migrations/geo-country.sql`](./migrations/geo-country.sql) | Coarse country on create/hold (aggregated analytics) |

Most migration files are **safe to re-run** (use `if not exists`, `drop policy if exists`, etc.).

## Utilities

| File | Purpose |
|------|---------|
| [`recover-guest-manifestations.sql`](./recover-guest-manifestations.sql) | One-off recovery when guest and email accounts split |

## Troubleshooting

- **Missing table** → run [`schema.sql`](./schema.sql) or the relevant migration from the table above.
- **Hold email prefs won't save** → [`migrations/notifications.sql`](./migrations/notifications.sql)
- **Withdraw hold fails** → [`migrations/withdraw-hold.sql`](./migrations/withdraw-hold.sql)

See also **`docs/project-handoff.md`** for app setup and env vars.
