import { NextResponse, type NextRequest } from "next/server";

import { createServiceSupabaseClient } from "@/lib/notifications/config";

type DrainEvent = {
  schema?: string;
  eventType?: string;
  eventName?: string;
  eventData?: string;
  timestamp?: number;
  projectId?: string;
  ownerId?: string;
  sessionId?: number;
  deviceId?: number;
  origin?: string;
  path?: string;
  referrer?: string;
  queryParams?: string;
  route?: string;
  country?: string;
  region?: string;
  city?: string;
  osName?: string;
  osVersion?: string;
  clientName?: string;
  clientType?: string;
  clientVersion?: string;
  deviceType?: string;
  deviceBrand?: string;
  deviceModel?: string;
  browserEngine?: string;
  browserEngineVersion?: string;
  sdkVersion?: string;
  sdkName?: string;
  sdkVersionFull?: string;
  vercelEnvironment?: string;
  vercelUrl?: string;
  flags?: string;
  deployment?: string;
};

function getDrainSecret(): string | null {
  const secret = process.env.VERCEL_ANALYTICS_DRAIN_SECRET?.trim();
  return secret && secret.length > 0 ? secret : null;
}

function isAuthorized(request: NextRequest): boolean {
  const secret = getDrainSecret();
  if (!secret) return false;
  const auth = request.headers.get("authorization")?.trim() || "";
  return auth === `Bearer ${secret}`;
}

function toIsoTimestamp(ms: number | undefined): string | null {
  if (!ms || !Number.isFinite(ms)) return null;
  try {
    return new Date(ms).toISOString();
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const events: DrainEvent[] = Array.isArray(payload) ? (payload as DrainEvent[]) : [];
  if (events.length === 0) {
    return NextResponse.json({ ok: true, inserted: 0 });
  }

  const rows = events
    .map((event) => ({
      schema: event.schema ?? null,
      event_type: event.eventType ?? null,
      event_name: event.eventName ?? null,
      event_data: event.eventData ?? null,
      timestamp: toIsoTimestamp(event.timestamp) ?? null,
      project_id: event.projectId ?? null,
      owner_id: event.ownerId ?? null,
      session_id: typeof event.sessionId === "number" ? event.sessionId : null,
      device_id: typeof event.deviceId === "number" ? event.deviceId : null,
      origin: event.origin ?? null,
      path: event.path ?? null,
      referrer: event.referrer ?? null,
      query_params: event.queryParams ?? null,
      route: event.route ?? null,
      country: event.country ?? null,
      region: event.region ?? null,
      city: event.city ?? null,
      os_name: event.osName ?? null,
      os_version: event.osVersion ?? null,
      client_name: event.clientName ?? null,
      client_type: event.clientType ?? null,
      client_version: event.clientVersion ?? null,
      device_type: event.deviceType ?? null,
      device_brand: event.deviceBrand ?? null,
      device_model: event.deviceModel ?? null,
      browser_engine: event.browserEngine ?? null,
      browser_engine_version: event.browserEngineVersion ?? null,
      sdk_name: event.sdkName ?? null,
      sdk_version: event.sdkVersion ?? null,
      sdk_version_full: event.sdkVersionFull ?? null,
      vercel_environment: event.vercelEnvironment ?? null,
      vercel_url: event.vercelUrl ?? null,
      flags: event.flags ?? null,
      deployment: event.deployment ?? null,
    }))
    .filter((row) => row.timestamp);

  if (rows.length === 0) {
    return NextResponse.json({ ok: true, inserted: 0 });
  }

  const { error } = await supabase.from("vercel_analytics_events").insert(rows);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, inserted: rows.length });
}

