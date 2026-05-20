# Comanifest

Collective intention, together — manifest hopeful outcomes and hold them with a community.

**Live:** deployed on **Vercel** (auto-builds from GitHub). **Local:** `npm run dev` → [http://localhost:3000](http://localhost:3000).

## Docs (read these first)

| Doc | What it's for |
|-----|----------------|
| [`docs/comanifest-brief.md`](docs/comanifest-brief.md) | Product vision, tone, **manifest / hold** vocabulary |
| [`docs/project-handoff.md`](docs/project-handoff.md) | What's built, file map, Supabase setup, troubleshooting |
| [`docs/deploying.md`](docs/deploying.md) | GitHub → Vercel → Supabase URLs; **keeping local & live in sync** |

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in Supabase URL + anon key
npm run dev
```

On macOS/Linux use `npm run dev:posix` if Supabase `fetch` fails (see handoff).

## Keep localhost and production in sync

```
Edit on laptop  →  git push  →  GitHub  →  Vercel redeploys
```

```bash
cd /c/Projects/comanifest-app   # or C:\Projects\comanifest-app
git pull                        # before starting work (optional but good habit)
# … edit, test with npm run dev …
git add -A
git commit -m "Describe what you changed"
git push
```

- **Code** syncs via **git push** (GitHub remote: **`LuckiosP/Comanifest`**).
- **Secrets:** `.env.local` stays on your machine; copy the same variable **names** into **Vercel → Settings → Environment Variables**.
- **Database:** local and live share the **same Supabase project** unless you create a separate dev project later.

Full checklist: **`docs/deploying.md`**.

## Stack

Next.js 16 (App Router), React, TypeScript, Tailwind, Supabase.
