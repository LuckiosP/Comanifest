# Deploying Comanifest (public URL and custom domain)

Durable checklist for taking the app from a local checkout to **production**, and **keeping local dev in sync with GitHub/Vercel**. For local setup, env keys, and file layout, see **`docs/project-handoff.md`**.

---

## Where everything lives

| Location | Purpose |
|----------|---------|
| **Local checkout** (e.g. `C:\Projects\comanifest-app`, Git Bash `/c/Projects/comanifest-app`) | Where you edit and run `npm run dev` / `npm run build`. |
| **GitHub** ([`LuckiosP/Comanifest`](https://github.com/LuckiosP/Comanifest)) | Source of truth for **code**. Vercel pulls from here. |
| **Vercel** | Builds and serves **`https://<project>.vercel.app`** (production). |
| **Supabase** | Database + auth (shared by local and live unless you split projects later). |

**Flow:** laptop → `git push` → GitHub → Vercel auto-deploy (usually 1–2 minutes).

---

## Keeping localhost and production in sync

### What syncs automatically

| What | How |
|------|-----|
| App **code** | `git push` to `main` → Vercel starts a new deployment |
| **Database rows** | Same Supabase project = manifestations created locally appear on live (and vice versa) |

### What you sync manually

| What | Local | Production |
|------|--------|--------------|
| Supabase keys | `.env.local` | Vercel → **Settings → Environment Variables** |
| Auth redirect allow-list | (optional localhost URLs) | Supabase → **Authentication → URL configuration** |
| Custom domain | — | Vercel → **Domains** + DNS registrar |

**`.env.local` is never committed** (see `.gitignore`). After adding a new env var locally, add the same name in Vercel and **Redeploy**.

### Daily workflow (plain English)

1. **`git pull`** — get latest from GitHub before you start (good habit).
2. **`npm run dev`** — edit and test on `http://localhost:3000`.
3. **`git add -A`** → **`git commit -m "…"`** → **`git push`** — upload changes.
4. **Vercel → Deployments** — wait for **Ready**, then **Visit**.

Do **not** edit app code in the Vercel or GitHub website UI; change files locally and push.

### Git remote (already set up)

```bash
git remote -v
# origin  https://github.com/LuckiosP/Comanifest (fetch/push)
```

If `remote origin already exists`, update the URL with:

```bash
git remote set-url origin https://github.com/LuckiosP/Comanifest.git
```

---

## Step 1 — Public host (working `https://…` URL)

**Status (2026-05):** Production deploy on Vercel is **working** (sign-in, manifest, hold tested).

For a **new** machine or fresh Vercel project:

1. **GitHub:** clone or push this repo to **`LuckiosP/Comanifest`** (or your fork).
2. **Vercel:** [vercel.com](https://vercel.com) → import the GitHub repo.
3. **Framework Preset:** must be **Next.js** (not **Other** — “Other” caused broken Edge deploys).
4. **Environment variables** (Vercel project settings — **not** read from `.env.local` on disk):

   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://YOUR_PROJECT.supabase.co` (no `/rest/v1/`) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / publishable key from Supabase API settings |
   | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | only if Supabase Auth CAPTCHA is enabled |

5. **Deploy** → open the generated `https://….vercel.app` URL.

### Vercel deploy gotcha — middleware (Edge)

Root **`middleware.ts`** refreshes Supabase sessions. For Vercel **Edge**:

- **Do not** import from `@/lib/*` inside `middleware.ts` (deploy fails with “referencing unsupported modules”).
- Env vars are read **inline** in `middleware.ts` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- **`/auth/callback`** is skipped in middleware so PKCE magic links are not disturbed.

If deploy fails after “Build Completed”, check **Build Logs** for `middleware` / Edge errors and confirm **Framework Preset = Next.js**.

---

## Step 2 — Supabase Auth URL configuration (required for magic links)

After you have a live Vercel URL, replace `YOUR-VERCEL-HOST` below with your real host (e.g. `comanifest-abc123.vercel.app` — copy from Vercel **Visit**).

1. Supabase Dashboard → your project → **Authentication** → **URL configuration**.
2. **Site URL** (one exact URL, no wildcard):

   ```
   https://YOUR-VERCEL-HOST
   ```

3. **Redirect URLs** — add **each line separately** (whitelist: Supabase may only redirect here after sign-in):

   ```
   https://YOUR-VERCEL-HOST/**
   https://YOUR-VERCEL-HOST/auth/callback
   ```

   - `/**` = any path on your live site (Supabase wildcard syntax).
   - `/auth/callback` = where magic links land (`SignInForm` → `emailRedirectTo`).

4. **Also add localhost** if you still develop locally (same Supabase project):

   ```
   http://localhost:3000/**
   http://localhost:3000/auth/callback
   ```

   Use **`localhost` consistently** (not mixed with `127.0.0.1`).

5. **Save**, then test **Sign in** on the **live** Vercel URL.

See [Supabase redirect URL docs](https://supabase.com/docs/guides/auth/redirect-urls).

---

## Step 3 — Custom domain (e.g. `www.comanifest.org`) — optional later

1. Vercel → **Domains** → add **`www.comanifest.org`** (and optionally apex **`comanifest.org`**).
2. At your **DNS registrar**: create the records Vercel shows (usually **CNAME** for `www`). Copy from Vercel; do not guess.
3. For **apex only**: follow Vercel’s **A / ALIAS** instructions or redirect `https://comanifest.org` → `https://www.comanifest.org`.
4. Update Supabase **Site URL** and **Redirect URLs** to the new domain (same two-line pattern as Step 2).
5. Wait for DNS + TLS (minutes to hours).

---

## Quick reference — Git Bash (Windows)

```bash
cd /c/Projects/comanifest-app
pwd    # should show /c/Projects/comanifest-app
git pull
npm run dev
# … later …
git add -A
git commit -m "Your message"
git push
```

Always run installs and builds from the directory that contains **`package.json`**.

---

*Last updated: 2026-05-19 — production on Vercel; sync workflow; Supabase redirect examples; middleware Edge notes.*
