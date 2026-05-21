import { NextResponse } from "next/server";

import { sendHoldDigestEmails } from "@/lib/notifications/digest";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return false;
  }

  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const frequency = searchParams.get("frequency");

  if (frequency !== "daily" && frequency !== "weekly") {
    return NextResponse.json(
      { error: "Use ?frequency=daily or ?frequency=weekly" },
      { status: 400 },
    );
  }

  const result = await sendHoldDigestEmails(frequency);
  return NextResponse.json({ ok: true, frequency, ...result });
}
