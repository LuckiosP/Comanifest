# Comanifest logo — creative brief & prompt

Primary mark concept for favicon, header, OG images, and future brand work.

---

## Symbol meaning

- **Nail stars** — seventeen uneven “nail heads” around the ring
- **Cosmic thread** — string-art chords crossing between nails (not simple polygons)
- **Woven ring** — the threads collectively form a loose holding circle
- **Central manifestation** — layered glowing ember at the centre

Archetypal and Jungian, magical but **not** religious or doctrinal.

---

## Image-generation prompt (canonical)

Use for AI image tools, briefs to designers, or regenerating concepts:

> A whimsical, lightly mystical logo depicting an uneven ring of softly glowing stars drifting around a central ember. The stars represent individual people with their own manifestations gathering and holding towards a shared outcome. Organic, hand‑drawn linework, thin constellation‑like connections, soft cosmic gradients, gentle glow, dreamlike atmosphere. Archetypal, Jungian, symbolic, magical but not religious. Colour palette: deep indigo, lavender, electric teal, golden ember. Minimal, modern, elegant, slightly Ghibli‑inspired. Works as a clean logo on light or dark backgrounds.

### Favicon / UI prompt (v5 — current, string art)

> Logo like **string art**: **17 nail-stars** (uneven ring, subtle size variation), **cosmic thread** chords that **stay in the outer ring** — woven around but **not crossing the central manifestation**. Layered glowing ember at centre. Midnight + silver/white. **Midnight medallion** favicon. Reference: `.design/logo-reference-sketch.png`

---

## v7 refinements (current SVG)

- **Organic circular ring** — uneven arc spacing + wobbly radius (not 360/17 polygon)
- **Uniform star size** — equal nail heads throughout
- **17 stars**, ring-only threads, clear manifestation core
- Regenerate: `node scripts/gen-string-art-svg.mjs`

---

## v6 refinements (superseded)

- Equal angular spacing read too hexagonal; varied star sizes — relaxed in v7

---

## v2 refinements (superseded)

- Five equal stars, lavender + gold — replaced by v3 midnight/silver

---

## Colour references (mark)

| Role | Hex | Name |
|------|-----|------|
| Midnight field / ink | `#1A1B2E` | Deep midnight (light-bg variant) |
| Silver stars / threads | `#E2E8F0` – `#F8FAFC` | Moonlit silver |
| Centre ember | `#FFFFFF` | Bright silver-white (dark-bg variant) |

Site UI may still use the wider brand palette — the **icon** stays midnight/silver for a night-sky read.

See also [`docs/brand-guidelines.md`](../docs/brand-guidelines.md).

---

## Repo assets

| File | Use |
|------|-----|
| `public/brand/comanifest-logo-mark-on-light.svg` | Header / UI on light backgrounds |
| `public/brand/comanifest-logo-mark-on-dark.svg` | Header / UI on dark backgrounds |
| `public/brand/comanifest-logo-mark.svg` | Favicon medallion (midnight disc) |
| `app/icon.svg` | Browser tab (same as medallion) |

---

## Usage notes

- Prefer **SVG** in the UI for crisp scaling
- Minimum clear size: **16px favicon** (v2 SVG); wordmark pairing from ~24px+
- Pair with wordmark **Comanifest** in header — do not bake text into the icon
- Flat two-colour mark reads on light and dark headers; avoid glow filters in the SVG

---

## Regenerating

If iterating in Cursor or another image tool, keep the canonical prompt above and ask for **icon only, no text, transparent background**.
