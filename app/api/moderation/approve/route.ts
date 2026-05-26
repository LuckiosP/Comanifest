import { NextResponse } from "next/server";

import { getPublicSiteUrl } from "@/lib/site-url";

/** Legacy GET links from older review emails — redirect to confirmation page (no side effects). */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token")?.trim();
  const siteUrl = getPublicSiteUrl();

  if (!token) {
    return NextResponse.redirect(
      `${siteUrl}/moderation/review?error=${encodeURIComponent("Missing review token.")}`,
    );
  }

  return NextResponse.redirect(
    `${siteUrl}/moderation/approve?token=${encodeURIComponent(token)}`,
  );
}
