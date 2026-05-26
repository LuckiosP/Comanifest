# Design branches — try appearances locally

**Production (`main`) is unchanged.** These branches only swap colours and atmosphere — same pages, same flows.

| Branch | Vibe |
|--------|------|
| **`design/cosmic-indigo`** | Brand “midnight + lavender” — deeper, dreamier |
| **`design/warm-dawn`** | Peach / rose / amber — softer human warmth |
| **`design/electric-teal`** | Teal accent — synchronicity / flow from brand guidelines |

Each branch shows a **bright yellow Design preview banner** at the top and **`[Design: …]` in the browser tab** — only on localhost, not on www.comanifest.org.

---

## View a design on localhost

**Important:** Design branches do **not** change the live site. You must use **`http://localhost:3000`**, not `www.comanifest.org`.

From the project folder (`C:\Projects\comanifest-app`):

### 1. Stop dev server if it’s running

In the terminal where `npm run dev` is running, press **Ctrl+C**.

### 2. Switch to a design branch

```powershell
cd C:\Projects\comanifest-app
git fetch origin
git checkout design/cosmic-indigo
```

Use `design/warm-dawn` or `design/electric-teal` instead for the other looks.

Check you’re on the right branch:

```powershell
git branch --show-current
```

### 3. Clear cache and start dev (recommended)

```powershell
npm run dev:fresh
```

Or manually: delete the `.next` folder, then `npm run dev`.

### 4. Open the site

[http://localhost:3000](http://localhost:3000) — **not** the production URL.

**You should see:**
- Yellow banner: “Design preview — …”
- Browser tab title starting with `[Design: …]`
- Obviously different page background and button colours per branch

| Branch | What to look for |
|--------|------------------|
| `design/cosmic-indigo` | Lavender / deep indigo buttons |
| `design/warm-dawn` | Peach / coral buttons and warm pink-tinted background |
| `design/electric-teal` | Teal / mint buttons and green-tinted background |

### 5. Try another design

Stop dev (**Ctrl+C**), then:

```powershell
git checkout design/warm-dawn
npm run dev:fresh
```

Hard refresh the browser (**Ctrl+Shift+R**) if needed.

### 6. Go back to normal / production code

```powershell
git checkout main
npm run dev:fresh
```

No yellow banner = you’re back on the live look locally.

---

## Troubleshooting — “colours aren’t changing”

1. **Wrong URL** — `www.comanifest.org` always shows **live** (`main`). Use **localhost:3000**.
2. **Wrong branch** — run `git branch --show-current`. Must be `design/…`, not `main`.
3. **Stale dev cache** — stop dev, run `npm run dev:fresh`.
4. **Dev still running from old branch** — always **Ctrl+C** before `git checkout`.
5. **No yellow banner** — you’re not on a design branch, or not on localhost.

---

## Compare to live production

| | Local design branch | Live site |
|--|---------------------|-----------|
| URL | `http://localhost:3000` | `https://www.comanifest.org` |
| Database | Same Supabase as `.env.local` | Same project |
| Code | Design branch only | `main` |

**Tip:** avoid creating real manifestations while screenshotting — or use obvious test titles like `DESIGN TEST`.

---

## If you pick a winner

1. `git checkout main`
2. `git merge design/cosmic-indigo` (or whichever branch)
3. Review diff, then `git push` → Vercel updates production

Or ask in Cursor to port the palette from the chosen branch into `main`.

---

## Delete a design you don’t want

```powershell
git checkout main
git branch -D design/electric-teal
git push origin --delete design/electric-teal
```
