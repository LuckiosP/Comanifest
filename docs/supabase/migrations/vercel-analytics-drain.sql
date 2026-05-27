-- Vercel Web Analytics Drains ingestion table (operator dashboard traffic).
-- Safe to re-run.

create table if not exists public.vercel_analytics_events (
  id bigserial primary key,
  received_at timestamptz not null default now(),
  schema text,
  event_type text,
  event_name text,
  event_data text,
  timestamp timestamptz,
  project_id text,
  owner_id text,
  session_id bigint,
  device_id bigint,
  origin text,
  path text,
  referrer text,
  query_params text,
  route text,
  country text,
  region text,
  city text,
  os_name text,
  os_version text,
  client_name text,
  client_type text,
  client_version text,
  device_type text,
  device_brand text,
  device_model text,
  browser_engine text,
  browser_engine_version text,
  sdk_name text,
  sdk_version text,
  sdk_version_full text,
  vercel_environment text,
  vercel_url text,
  flags text,
  deployment text
);

create index if not exists vercel_analytics_events_timestamp_idx
  on public.vercel_analytics_events (timestamp desc);

create index if not exists vercel_analytics_events_path_idx
  on public.vercel_analytics_events (path);

create index if not exists vercel_analytics_events_session_idx
  on public.vercel_analytics_events (session_id);

alter table public.vercel_analytics_events enable row level security;

-- No public policies: this table is written by the server (service_role) only.

