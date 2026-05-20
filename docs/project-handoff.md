# Comanifest — project handoff & history

This file is the **durable project memory** when you open the repo in a **new folder**, a **new machine**, or a **new Cursor workspace** (where chat history may not carry over). It summarizes what was built, why, and where things live.

For product vision, tone, and roadmap, use **`docs/comanifest-brief.md`** — that is the source of truth for *what* Comanifest is.

**Documentation split:** the **brief** = product vision and tone. **This handoff** = implementation map, setup, file pointers, and project history — keep it **up to date** when behaviour, routes, env, or notable fixes change (see [Keeping this document current](#keeping-this-document-current)).

---

## Project location

- **Primary checkout (Windows):** `C:\Projects\comanifest-app` — local **`C:\Projects`** tree, **not** Dropbox.
- **GitHub:** [`LuckiosP/Comanifest`](https://github.com/LuckiosP/Comanifest) — push here to update production.
- **Production:** **Vercel** (`https://….vercel.app`) — auto-deploys from GitHub `main`. Sign-in, manifest, and hold verified on live (2026-05).
- **Custom domain:** see **`docs/deploying.md`** when ready.
- **Why local path matters:** Moving off Dropbox avoids selective-sync duplicate folders (e.g. `.next (Selective Sync Conflict…)`) and flaky lint/build paths.

---

## Keeping localhost, GitHub, and Vercel in sync

**Mental model:** laptop (edit) → **`git push`** → GitHub → Vercel rebuilds the live site.

| Syncs how | What |
|-----------|------|
| **`git push`** | App code → live site (1–2 min after push) |
| **Same Supabase project** | Manifestations / holds in DB appear on localhost and live |
| **Manual** | Env vars: `.env.local` ↔ Vercel settings; auth URLs in Supabase dashboard |

**Typical session:** `git pull` → `npm run dev` → edit → `git add -A` → `git commit -m "…"` → `git push` → check Vercel **Deployments** → **Ready**.

**Do not commit:** `.env.local` (secrets). **Do edit code in:** local files only, not the Vercel UI.

Full checklist and Supabase redirect examples: **`docs/deploying.md`**.

---

## Conventions the team agreed on

- **Product name:** **Comanifest** — not `CoManifest`, not hyphenated, capital **C** only.
- **Author context:** Primary author is newer to coding; prefer **clear explanations** and **small, scoped changes** unless asked otherwise.
- **UI voice:** See **`docs/comanifest-brief.md` → Voice & vocabulary** (manifest / hold / manifestation). User-facing strings: **`lib/manifestations/intention-copy.ts`**.

---

## Product principles (hold & identity) — 2026-05-14

These are **implementation-facing** preferences agreed in chat (the **brief** remains the vision source of truth).

- **Hold is deliberate, not a throwaway click.** Holding requires a **short private commitment note** (stored with the user’s auth id) and a **good-faith checkbox** before the app counts them in.
- **Accountability without full sign-up yet.** Holds use **Supabase anonymous `auth.uid()`** under the hood (same session model as **manifesting**). **Magic link email sign-in** is available on **`/sign-in`**; optional **anonymous linking** and “my holds” can build on the same `user_id` model later.
- **Progressive gates.** **Browse** stays open. **Hold / manifest / “my stuff”** can require stronger identity over time as you learn from behaviour — design the data model so gates can tighten without a rewrite.
- **Creator is already “in”.** The author’s `join_count` starts at **1**; other people add rows in **`manifestation_joins`**; a trigger increments **`join_count`**. The creator cannot hold their own post via the hold flow.

---

## Tech stack (as implemented)

- **Next.js** 16 (App Router), **React** 19, **TypeScript**, **Tailwind CSS** v4  
- **Supabase** (`@supabase/supabase-js`, `@supabase/ssr`) for data + auth session in the browser  
- **Anonymous sign-in** is used so “create manifestation” can attach `user_id` without email UI yet (must be **enabled in Supabase**: Authentication → Providers → **Anonymous**)

---

## Routes & behaviour

| Route | Purpose |
|--------|--------|
| `/` | Marketing-style **home**: hero, CTAs to feed + create, short “Ground rules” + link to full guidelines |
| `/manifestations` | **Feed** of manifestations; **sort** via `?sort=joined` or default newest |
| `/manifestations/new` | **Start a manifestation** form (`MANIFEST_CTA`); server action **`createManifestation`** |
| `/manifestations/[id]` | **Detail** for one manifestation: full intention, metadata, **hold** UI (`JoinManifestationControl`); **`getManifestationById`** returns sample rows, live UUID rows, and **`viewer_has_joined` / `viewer_is_creator`** for the current session |
| `/sign-in` | **Magic link** email sign-in (`?next=/path` supported); **`SignInForm`** uses `signInWithOtp` with redirect to **`/auth/callback`** |
| `/auth/callback` | **Client page** finishes PKCE in the **browser** (verifier cookie from “Send magic link” is visible): **`auth.initialize()`** (with default `detectSessionInUrl`) performs the code exchange once, then **`getSession()`** confirms and the app redirects to **`next`** |
| `/guidelines` | Full **community guidelines** page |
| `/about` | Minimal about stub (may be expanded later) |

**Feed data:** If Supabase env vars are missing or the query errors, the app shows **sample/example cards** (`lib/manifestations/sample-data.ts`) and a yellow **hint** banner — never a blank broken page.

**Manifest page:** The form shows an amber hint when **keys are missing** (`CreateManifestationForm`). When keys are present, **`/manifestations/new`** runs **`probeManifestationsTable`** so **network / table errors** (e.g. `fetch failed`) show the same yellow hint style as the feed.

**Manifest (live Supabase only):** **`/manifestations/new`** uses **`CreateManifestationForm`** — anonymous session prep, **`createManifestation`** server action. Copy from **`intention-copy.ts`**: nav **Manifest**, CTA **Start a manifestation**, submit **Manifest this**.

**Hold (live Supabase only):** Feed and detail use **`JoinManifestationControl`** — anonymous session, **Hold with intention** expand on cards, **commitment note** (20–500 chars) + **required checkbox**, server action **`joinManifestation`**. Copy: **Hold this manifestation**, badge **You're holding this manifestation**. **`manifestation_joins`** + RLS + trigger (see SQL docs). Sample/example cards do not enable hold.

**Detail navigation:** Feed card **titles** link to **`/manifestations/[id]`**.

**Auth:** **`AuthNav`** in the header shows **Guest** + **Sign in** + **Sign out** for anonymous sessions, or truncated **email** + **Sign out** after magic link. **Sign in** preserves the current path via **`?next=`** (validated).

---

## Supabase: what you must configure

1. Copy **`.env.example`** → **`.env.local`** in the repo root.  
2. Set **`NEXT_PUBLIC_SUPABASE_URL`** to the **Project URL** only (`https://….supabase.co`) — **do not** append `/rest/v1/`.  
3. Set **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** to the **anon** (JWT, `eyJ…`) or **publishable** (`sb_publishable_…`) key from **Project Settings → API** — **not** `sb_secret_…` or **service_role**.  
4. Run **`docs/supabase-schema.sql`** in the Supabase SQL Editor (**`manifestations`** + **`manifestation_joins`**, RLS, join-count trigger). If you **already** ran an older schema that only created **`manifestations`**, run **`docs/supabase-join-migration.sql`** once instead of re-running the full file.  
5. Enable **Anonymous** provider in Supabase Auth.  
6. Enable **Email** provider (Authentication → Providers → **Email**) so magic links work. Under **Authentication → URL configuration**, set **Site URL** and **Redirect URLs** for **both** dev and production — see **`docs/deploying.md` → Step 2** for exact lines (`https://YOUR-VERCEL-HOST/**`, `…/auth/callback`, and localhost equivalents).

**Auth flow (manifest + hold + sign-in):** Anonymous session for guests; **`signInWithOtp`** sends a link to **`/auth/callback?next=…`**; the **callback page** awaits **`auth.initialize()`** in the browser (PKCE exchange happens there, once — do not also call **`exchangeCodeForSession`** or the verifier is already gone), then **`router.replace(next)`**. Server actions use **`getServerAuthUser`**.

**If holds fail with “relation `manifestation_joins` does not exist” (or similar):** run **`docs/supabase-join-migration.sql`** in the same project as your `.env.local` URL.

**If you see “Could not find the table `public.manifestations` in the schema cache”:** the app is talking to Supabase, but that project **does not have the `manifestations` table yet** (or you are on the wrong Supabase project). Open **SQL** → **New query** in the **same** project as your `.env.local` URL, paste and run **`docs/supabase-schema.sql`**, then check **Table Editor** for **`manifestations`**. If the script errors with “already exists”, the table is there — refresh the app; if policies failed halfway, say what error you got.

**If sign-in shows “email rate limit exceeded”:** Supabase caps how many auth emails the **built-in** sender can send per hour (easy to hit while testing). **Wait** and try again less often; for real use, configure **custom SMTP** (Supabase **Authentication** → **Settings** / **SMTP**) so limits are higher and deliverability is better.

**If magic link fails with “PKCE code verifier not found”:** open the link in the **same browser** (and same profile) where you clicked **Send magic link**; avoid opening only inside a mail app’s embedded browser if it doesn’t share cookies with your normal browser. Use a **consistent host** (`localhost` vs `127.0.0.1` — pick one and stick to it in the address bar and Supabase redirect URLs).

**If you see `TypeError: fetch failed` (yellow hint on `/manifestations`):** the dev server could not complete HTTPS to your **Project URL**. Common causes: **wrong URL shape** (must be `https://….supabase.co` with **no** `/rest/v1/`); **wrong key** (use **anon** / **publishable**, not **`sb_secret_`** or **service_role**); **typo or hidden character** in `.env.local` (re-paste from Supabase **Project Settings → API**; no smart quotes); **UTF-8 BOM** on the first line of `.env.local` (can make the first variable invisible to Node — re-save as UTF-8 without BOM, or put a blank comment line first); **corporate VPN / proxy / antivirus HTTPS inspection** (try off VPN, allow Node, or fix the machine trust store — your repo handoff also noted `npm` sometimes needing `--strict-ssl=false`, which can point to the same TLS issue); **firewall** blocking Node outbound. After changing `.env.local`, **restart** `npm run dev`. The app **trims** URL/key and strips a leading BOM; error hints append **`error.cause`** when present. **`/manifestations/new`** runs the same kind of server check as browse, so **both** pages look “disconnected” when the server still cannot reach Supabase — that is expected, not a split bug.

---

## Important files (by area)

### App & UI

- `app/layout.tsx` — root layout, **metadata** (title/description for Comanifest), body classes  
- `app/page.tsx` — homepage (uses `min-h-screen` + gradient shell)  
- `app/globals.css` — Tailwind import; **body** no longer forces `background`/`color` (those come from layout) so Tailwind on `<body>` is not overridden  
- `app/components/SiteHeader.tsx` — logo + nav + **`AuthNav`**  
- `app/components/AuthNav.tsx` — client: session summary, **Sign in** / **Sign out**  
- `app/components/SignInForm.tsx` — magic link email form  
- `app/components/ManifestationCard.tsx` — card (title links to detail) + **`FeedSortLinks`** (**Widest circle**) + hold UI via **`JoinManifestationControl`** when feed is live  
- `app/components/JoinManifestationControl.tsx` — client hold form (anonymous session, note + checkbox); UI copy from **`intention-copy.ts`**  
- `app/components/CreateManifestationForm.tsx` — client manifest form + anonymous session prep; UI copy from **`intention-copy.ts`**  
- `app/sign-in/page.tsx` — sign-in shell + query errors from callback  
- `app/auth/callback/page.tsx` — magic-link landing shell  
- `app/auth/callback/CallbackClient.tsx` — client PKCE via **`auth.initialize()`** + **`getSession()`** + redirect  
- `app/manifestations/page.tsx` — server page: loads list via `listManifestations`  
- `app/manifestations/[id]/page.tsx` — detail page; **`generateMetadata`** from row title / intention  
- `app/manifestations/new/page.tsx` — wraps create form  
- `app/guidelines/page.tsx` — guidelines content  
- `app/actions/manifestations.ts` — **`createManifestation`** server action  
- `app/actions/join-manifestation.ts` — **`joinManifestation`** server action  
- `app/about/page.tsx` — simple about page (no unused imports)

### Data & Supabase helpers

- `lib/types/manifestation.ts` — `Manifestation`, **`ManifestationListRow`** (feed/detail viewer flags), categories, labels  
- `lib/auth/safe-next-path.ts` — **`safeNextPath`** for post-login redirects  
- `lib/auth/format-auth-error.ts` — normalise Supabase Auth errors for UI (avoids empty/`{}` messages)  
- `lib/manifestations/sample-data.ts` — example rows for offline / error fallback  
- `lib/manifestations/join-bounds.ts` — shared min/max length for commitment note  
- `lib/manifestations/intention-copy.ts` — **single source** for manifest/hold user-facing strings (see brief → Voice & vocabulary)  
- `lib/manifestations/queries.ts` — **`listManifestations`**, **`getManifestationById`**, **`probeManifestationsTable`** (live vs sample; hold flags for live)  
- `lib/supabase/config.ts` — **`isSupabaseConfigured()`**  
- `lib/supabase/client.ts` — browser Supabase client (returns `null` if not configured)  
- `lib/supabase/server.ts` — server Supabase client (cookies)  
- `middleware.ts` (repo root) — Supabase session refresh on Edge; **skips** `/auth/callback`. Must **not** import from `@/lib/*` (Vercel Edge deploy rejects it); reads `NEXT_PUBLIC_*` env vars inline.  

### Docs & env

- `docs/comanifest-brief.md` — product brief (pinned reference)  
- `docs/deploying.md` — **GitHub → Vercel → Supabase URLs**; **sync workflow**  
- `docs/supabase-schema.sql` — DB + RLS + joins (full fresh install)  
- `docs/supabase-join-migration.sql` — **additive** joins table + trigger + policies (existing projects)  
- `.env.example` — template for public Supabase vars (safe to commit)

---

## Tooling & repo hygiene changes

- **`eslint.config.mjs`:** ignore **`**/*Selective Sync Conflict*/**`** so duplicate build trees from **file sync tools** (historically Dropbox) are not linted — avoids mass false errors if a copy ever appears again.  
- **`.gitignore`:** explicit env file list; added **`/.next */`** so sync-style duplicate folders named like `.next (…)` are ignored by Git.  
- **`package.json`:** `dev` / `build` / `start` set **`NODE_OPTIONS=--dns-result-order=ipv4first`** and **`NODE_USE_SYSTEM_CA=1`** (Windows `cmd` `set` syntax) so Node reaches `*.supabase.co` and trusts the **Windows CA store**; **`dev:posix`** sets the same for macOS/Linux.  
- **Build cache:** the main **`.next`** folder is local-only; **`.next` regenerates** on `npm run dev` / `npm run build`. Old Dropbox conflict copies were removed during the Dropbox → `C:\Projects` move.

### npm / SSL note

On at least one machine, `npm install` failed with **certificate** errors; **`npm install --strict-ssl=false`** succeeded. Prefer fixing system/proxy CA long-term; the workaround is documented here in case it recurs. Node 20+ can use **`node --use-system-ca`** (or set **`NODE_USE_SYSTEM_CA=1`**) so HTTPS (including to Supabase) trusts the OS certificate store — see [Node.js docs](https://nodejs.org/api/cli.html) if `fetch failed` persists after the IPv4 DNS mitigations below.

### Supabase `fetch failed` (Windows dev)

The dev scripts set **`NODE_OPTIONS=--dns-result-order=ipv4first`** and **`NODE_USE_SYSTEM_CA=1`** (see **`package.json`**). **`lib/supabase/server.ts`** also imports **`prefer-ipv4-dns`**. On **macOS/Linux**, use **`npm run dev:posix`** (or set the same env vars yourself).

---

## Bugs fixed along the way

1. **Homepage looked blank** — `globals.css` had a plain `body { background; color }` rule that could override Tailwind on `<body>`. Removed those from `body` so **`app/layout.tsx`** controls surface colours; homepage wrapper uses **`min-h-screen`**.  
2. **ESLint explosion** — caused by linting sync-tool conflict copies of `.next`; fixed via `globalIgnores` + removed real lint issues (`about` unused import, **`react-hooks/set-state-in-effect`** in create form by moving sync `setState` into the async path).  
3. **Magic link PKCE errors** — callback page must not call **`exchangeCodeForSession`** after **`auth.initialize()`**; middleware must **skip** `/auth/callback`.  
4. **Vercel deploy failed (Edge middleware)** — `middleware.ts` must not import `@/lib/*`; read `NEXT_PUBLIC_*` env inline. Vercel **Framework Preset** must be **Next.js** (not **Other**).

---

## Known follow-ups (not done yet)

- **Custom domain** on Vercel + update Supabase redirect URLs — see **`docs/deploying.md` Step 3**  
- **Anonymous → email linking** — dedicated UX when a guest upgrades (Supabase supports linking; magic link from an existing anon session should be tested per project settings)  
- **“My holds” / profile** — list manifestations the signed-in user holds or has manifested  
- **Separate Supabase dev project** — optional later so local experiments do not touch production data  
- **Next.js 16** warns that **`middleware`** convention may move to **`proxy`** — migrate when you adopt the new API  
- **Polish** (motion, typography, empty states): explicitly deferred by author  
- **If any clone still lives under Dropbox (or similar sync):** exclude **`.next`** (and ideally the whole repo) from sync to reduce conflict folders

---

## Keeping this document current

When you (or an assistant) ship **meaningful behaviour changes**, **new/changed routes**, **env or Supabase setup changes**, **important file moves**, or **non-trivial bug fixes**, update **this file** in the same effort — not only code — so it stays the **structural documentation** for the repo. Short bullets are enough; mirror the sections above (routes, files, setup, follow-ups).

---

## How to use this file in Cursor

In a **new** chat after moving the repo, say something like:

> Read `docs/project-handoff.md` and `docs/comanifest-brief.md`, then continue from there.

That gives the assistant the same structural context chat history used to hold.

---

*Last updated: 2026-05-19 — production on Vercel; sync workflow; middleware Edge deploy; manifest/hold voice.*
