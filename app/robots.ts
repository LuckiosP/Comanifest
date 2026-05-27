import type { MetadataRoute } from "next";

import { getPublicSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = getPublicSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: [
        "/design-preview",
        "/auth",
        "/sign-in",
        "/account",
        "/admin",
        "/moderation",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}

