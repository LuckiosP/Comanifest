/**
 * Prefer IPv4 when resolving hostnames in this Node process.
 * Helps on some Windows setups where IPv6 is misconfigured and `fetch` to
 * cloud APIs (e.g. Supabase) fails with `TypeError: fetch failed`.
 */
import dns from "node:dns";

if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}
