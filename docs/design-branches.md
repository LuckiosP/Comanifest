# Design preview — try appearances locally

**Production (`main`) is unchanged.** Preview palettes swap accent colours only — same pages, same flows.

| Palette | Vibe |
|---------|------|
| **Cosmic indigo** | Midnight and lavender — deeper, dreamier |
| **Warm dawn** | Peach, rose, and amber — softer human warmth |
| **Electric teal** | Teal and mint — synchronicity and flow |

---

## How to preview (recommended)

Stay on **`main`**. One dev server, no git branch switching.

### 1. Start dev (Windows PowerShell)

```powershell
cd C:\Projects\comanifest-app
npm.cmd run dev
```

### 2. Open the picker

[http://localhost:3000/design-preview](http://localhost:3000/design-preview)

Click a palette. Colours update **instantly** across the site (cookie + CSS variables). Browse home, feed, create, detail, account. Take screenshots.

### 3. Switch or reset

- **Another palette:** go back to `/design-preview` and pick another
- **Back to live look:** click **Reset to default**
- A small amber banner at the top confirms when a preview palette is active

---

## Compare to production

| | Local preview | Live site |
|--|---------------|-----------|
| URL | `http://localhost:3000` | `https://www.comanifest.org` |
| Code | `main` | `main` |
| Palette | Your cookie choice | Default (no preview) |

**Tip:** avoid creating real manifestations while screenshotting — use obvious test titles like `DESIGN TEST`.

Preview is **dev-only** by default. To enable on a staging deploy, set `NEXT_PUBLIC_ENABLE_DESIGN_PREVIEW=true`.

---

## If you pick a winner

Copy the chosen palette block from `app/design-themes.css` into `app/globals.css` (or ask in Cursor to port it). Push `main` → Vercel updates production.

---

## Deprecated: design/* git branches

The earlier `design/cosmic-indigo`, `design/warm-dawn`, and `design/electric-teal` branches required git checkout and often broke Turbopack cache on Windows. **Do not use them.** They can be deleted when convenient:

```powershell
git branch -D design/cosmic-indigo design/warm-dawn design/electric-teal
git push origin --delete design/cosmic-indigo design/warm-dawn design/electric-teal
```

Palette source files remain in `.design/` for reference. Logo brief and prompt: [`.design/logo-prompt.md`](../.design/logo-prompt.md).
