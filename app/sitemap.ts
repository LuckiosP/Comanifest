import type { MetadataRoute } from "next";

import { getPublicSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getPublicSiteUrl();

  const staticPaths: MetadataRoute.Sitemap = [
    "",
    "/manifestations",
    "/manifestations/new",
    "/privacy",
    "/guidelines",
    "/about",
  ].map((path) => ({
    url: `${base}${path || "/"}`,
    changeFrequency: "daily",
    priority: path === "" ? 1 : 0.6,
  }));

  return staticPaths;
}

