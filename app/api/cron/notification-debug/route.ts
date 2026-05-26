import { NextResponse } from "next/server";

import {
  createServiceSupabaseClient,
  isEmailNotificationsConfigured,
} from "@/lib/notifications/config";
import { sendTransactionalEmail } from "@/lib/notifications/email";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return false;
  }

  return request.headers.get("authorization") === `Bearer ${secret}`;
}

/** Protected diagnostics for hold-email delivery. */
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const manifestationId = searchParams.get("manifestation_id")?.trim();
  const sendTest = searchParams.get("send") === "test";

  const service = createServiceSupabaseClient();
  const diagnostics: Record<string, unknown> = {
    resendConfigured: isEmailNotificationsConfigured(),
    hasServiceKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()),
    hasResendKey: Boolean(process.env.RESEND_API_KEY?.trim()),
    hasFromEmail: Boolean(process.env.NOTIFICATION_FROM_EMAIL?.trim()),
    serviceClientOk: Boolean(service),
    manifestationId: manifestationId ?? null,
  };

  if (!manifestationId || !service) {
    return NextResponse.json(diagnostics);
  }

  const { data, error } = await service.rpc("get_creator_hold_notification_plan", {
    p_manifestation_id: manifestationId,
  });

  if (error) {
    diagnostics.rpcError = error.message;
    return NextResponse.json(diagnostics);
  }

  const plan = data?.[0] as
    | {
        creator_email: string | null;
        hold_updates_frequency: string;
        manifestation_title: string;
        join_count: number;
      }
    | undefined;

  if (!plan) {
    diagnostics.plan = null;
    return NextResponse.json(diagnostics);
  }

  const email = plan.creator_email?.trim() ?? "";
  diagnostics.plan = {
    frequency: plan.hold_updates_frequency,
    hasCreatorEmail: Boolean(email),
    emailDomain: email.includes("@") ? email.split("@")[1] : null,
    title: plan.manifestation_title,
    joinCount: plan.join_count,
    wouldSendInstant:
      plan.hold_updates_frequency === "instant" && Boolean(email) && isEmailNotificationsConfigured(),
  };

  if (sendTest && plan.hold_updates_frequency === "instant" && email) {
    const isProduction =
      process.env.VERCEL_ENV === "production" ||
      process.env.NODE_ENV === "production";

    if (isProduction) {
      diagnostics.testSend = {
        ok: false,
        error: "Test sends are disabled in production.",
      };
    } else {
      const result = await sendTransactionalEmail({
        to: email,
        subject: `Comanifest test: hold update for “${plan.manifestation_title}”`,
        html: "<p>This is a test hold-update email from Comanifest.</p>",
      });
      diagnostics.testSend = result;
    }
  }

  return NextResponse.json(diagnostics);
}
