import { headers } from "next/headers";

/** ISO 3166-1 alpha-2 codes we treat as unknown / unusable for aggregation. */
const UNKNOWN_COUNTRY_CODES = new Set(["XX", "T1"]);

/**
 * Coarse country from the hosting edge (Vercel or Cloudflare), not stored IP.
 * Returns null in local dev or when geo headers are missing.
 */
export async function getRequestCountryCode(): Promise<string | null> {
  const headerStore = await headers();
  const raw =
    headerStore.get("x-vercel-ip-country") ??
    headerStore.get("cf-ipcountry");
  const country = raw?.trim().toUpperCase();

  if (
    !country ||
    country.length !== 2 ||
    UNKNOWN_COUNTRY_CODES.has(country) ||
    !/^[A-Z]{2}$/.test(country)
  ) {
    return null;
  }

  return country;
}
