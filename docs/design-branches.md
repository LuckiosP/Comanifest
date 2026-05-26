# Design branches — try appearances locally

**Production (`main`) is unchanged.** These branches only swap colours and atmosphere — same pages, same flows.

| Branch | Vibe |
|--------|------|
| **`design/cosmic-indigo`** | Brand “midnight + lavender” — deeper, dreamier |
| **`design/warm-dawn`** | Peach / rose / amber — softer human warmth |
| **`design/electric-teal`** | Teal accent — synchronicity / flow from brand guidelines |

Each branch shows a small **Design preview** banner at the top so you know you’re not on live.

---

## View a design on localhost

From the project folder (`C:\Projects\comanifest-app`):

### 1. Stop dev server if it’s running

In the terminal where `npm run dev` is running, press **Ctrl+C**.

### 2. Switch to a design branch

```powershell
git fetch origin
git checkout design/cosmic-indigo
```

Use `design/warm-dawn` or `design/electric-teal` instead for the other looks.

### 3. Install (only if prompted) and run

```powershell
npm install
npm run dev
```

### 4. Open the site

[http://localhost:3000](http://localhost:3000) — browse home, feed, create, detail, account. Take screenshots.

### 5. Try another design

Stop dev (**Ctrl+C**), then:

```powershell
git checkout design/warm-dawn
npm run dev
```

Reload the browser (hard refresh **Ctrl+Shift+R** if colours look stuck).

### 6. Go back to normal / production code

```powershell
git checkout main
npm run dev
```

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
