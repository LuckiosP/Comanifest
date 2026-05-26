import { NextResponse } from "next/server";

import { approveManifestationByToken } from "@/lib/moderation/review-actions";
import { getPublicSiteUrl } from "@/lib/site-url";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token")?.trim();
  const siteUrl = getPublicSiteUrl();

  if (!token) {
    return NextResponse.redirect(
      `${siteUrl}/moderation/review?error=${encodeURIComponent("Missing review token.")}`,
    );
  }

  const result = await approveManifestationByToken(token);
  if (!result.ok) {
    return NextResponse.redirect(
      `${siteUrl}/moderation/review?error=${encodeURIComponent(result.error)}`,
    );
  }

  return NextResponse.redirect(
    `${siteUrl}/moderation/review?approved=1&title=${encodeURIComponent(result.title)}`,
  );
}
