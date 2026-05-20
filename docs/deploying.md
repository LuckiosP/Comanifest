# Deploying Comanifest (public URL and custom domain)

Durable checklist for taking the app from a local checkout to **production**. For local setup, env keys, and file layout, see **`docs/project-handoff.md`**.

---

## Where the code lives vs what gets deployed

| Location | Purpose |
|----------|---------|
| **Local checkout** (e.g. Windows `C:\Projects\comanifest-app`, Git Bash `/c/Projects/comanifest-app`) | Where you edit and run `npm run dev` / `npm run build`. |
| **Git remote (usually GitHub)** | What hosts like Vercel **pull** to build. Your laptop path is not read directly in the normal flow. |
| **Host (e.g. Vercel)** | Runs the build and serves **`https://<project>.vercel.app`** until you attach a custom domain. |

Until this folder is a **git** repository with commits **pushed** to GitHub (or you use another upload path), the usual “import repo → deploy” step has nothing to import.

---

## Step 1 — Public host (get a working `https://…` URL)

Typical path with **Next.js** + **Vercel**:

1. **GitHub:** `git init` (if needed), commit, add `origin`, `git push` from the project root.
2. **Vercel:** [vercel.com](https://vercel.com) → Add New → Project → Import the GitHub repo.
3. **Environment variables** in the Vercel project (not read from `.env.local` on disk). At minimum:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
   Match **`docs/project-handoff.md`** / `.env.example` for any additional keys.
4. **Deploy**, then open the generated URL and smoke-test the app (especially anything that talks to Supabase).

---

## Step 2 — Custom domain (e.g. `www.comanifest.org`)

1. In the host: **Domains** → add **`www.comanifest.org`** (and optionally apex **`comanifest.org`**).
2. At your **DNS registrar** (where the domain is managed): create the records the host shows (commonly a **CNAME** for `www` to their target). Do not guess values; copy from the host after adding the domain.
3. For **apex only**: either follow the host’s **A / ALIAS** instructions or use a registrar-level **redirect** from `https://comanifest.org` to `https://www.comanifest.org`.
4. Wait for **DNS propagation** and **TLS** (can be minutes to hours).

---

## Step 3 — Supabase Auth URL configuration

The app uses Supabase. After you have a real site URL:

1. Supabase Dashboard → your project → **Authentication** → **URL configuration**.
2. Set **Site URL** to the canonical public URL, e.g. `https://www.comanifest.org`.
3. Add **Redirect URLs** for that origin (and the apex if you use it), e.g. `https://www.comanifest.org/**` — follow [Supabase redirect URL docs](https://supabase.com/docs/guides/auth/redirect-urls) for wildcards and any OAuth callback routes you use (this repo includes **`/auth/callback`**).

Skipping this step often breaks magic links, OAuth return paths, and email confirmation redirects.

---

## Quick reference — Git Bash paths

```bash
cd /c/Projects/comanifest-app
pwd    # should show /c/Projects/comanifest-app
```

Always run installs and builds from the directory that contains **`package.json`**.
