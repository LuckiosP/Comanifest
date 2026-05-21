# Comanifest — project brief

For a concise record of what has been implemented in the repo and how to run it, see the [project handoff](./project-handoff.md).

Reference document for product vision, tone, and build direction.  
Open this file anytime you need the full picture.

---

## 1. Concept overview

Comanifest is an online community platform where people come together to collectively manifest specific outcomes. It is inspired by the mechanics of platforms like 38 Degrees (petitions), but instead of signatures, users contribute intention, focus, and collective attention toward a desired outcome.

Users can **manifest** new **manifestations** — outcomes they want to see in the world — and others can **hold** them with deliberate intention. These outcomes can be light, playful, global, personal, or symbolic, as long as they align with the platform’s ethos of doing no harm and inclusiveness.

**Examples:**

- manifesting sunshine for a wedding  
- manifesting peace in a region  
- manifesting a sports team victory  
- manifesting collective calm or kindness  

The platform is intentionally open-ended and imaginative.

---

## 2. Purpose and philosophy

Comanifest is built on the idea that collective intention has power, whether psychological, symbolic, social, or energetic. The platform is **not** about guaranteeing outcomes — it is about:

- shared focus  
- community participation  
- positive collective energy  
- a sense of agency and connection  
- playful experimentation  
- doing good  

It is **not** a spiritual doctrine, **not** a political tool, and **not** a place for harmful or exclusionary intentions.

**Tone:**

- inclusive  
- optimistic  
- imaginative  
- light but sincere  
- community-oriented  
- calm and deliberate — not transactional (avoid petition-style “sign”, “join”, or “publish” language in the UI)

### Voice & vocabulary

**Keep *manifest* / *manifestation* central.** They are the product name and the core object in the feed — do not replace them with generic verbs like “create”, “start”, or “publish” in user-facing copy.

Use this **two-verb pattern** everywhere in the UI:

| User action | Preferred language | Notes |
|-------------|-------------------|--------|
| Start something new | **Manifest** (verb) / **Start a manifestation** (links & page titles) | Header nav: **Manifest**; form submit: **Manifest this** → **Manifesting…** |
| Stand with someone else’s post | **Hold** / **Hold this manifestation** | After success: **You're holding this manifestation**; card expand: **Hold with intention** |
| The shared post in the feed | **Manifestation** (noun) | Count copy: “X people holding this manifestation”; feed sort **Widest circle** (not “most joined”) |

**Intention** is the *inner* layer — the private note, the “why”, the deliberate step before holding. Use it in form labels and **Hold with intention**, not as a substitute for **manifestation** when referring to the post itself.

**Avoid in UI copy:** join, publish, create (as the primary CTA), sign, like, follow — they feel wrong for this community.

**Implementation:** all shared strings live in **`lib/manifestations/intention-copy.ts`**. Import from there; do not hardcode new manifest/hold phrases in components.

---

## 3. Core features (eventual)

### A. Manifestation creation

Users **manifest** a new **manifestation** by describing:

- the desired outcome  
- the intention behind it  
- a **compulsory end date** — when this manifestation closes for evaluation (see **F** below)  
- the category (weather, global, personal, sports, etc.)  

**Before they submit:** the app **searches for similar manifestations** already in the feed and **suggests** them. Finding one that is basically the same is **more powerful** than duplicating — the UI should nudge people toward holding an existing manifestation rather than starting a near-copy.

**Optional today, required in product:** `timeframe` as free text may remain for human-readable context, but **end date** is the authoritative close.

### B. Holding a manifestation

Other users **hold** a manifestation by:

- choosing **Hold with intention** (or **Hold this manifestation** on the detail page)  
- writing a short **private commitment note** (stored with their account)  
- confirming a **good-faith checkbox** — deliberate, not a throwaway click  
- contributing to the collective count  

Holders must be able to **withdraw their hold** later — remove their row and drop out of the circle without deleting the manifestation itself.

### C. Community feed

A list of active manifestations, sortable by:

- newest  
- widest circle (most people holding)  
- category  
- trending (future)  

Manifestations must be **searchable** (by title, intention, category, and eventually other fields) so people can find existing work before creating duplicates.

### D. Guidelines

A clear, simple set of principles:

- do no harm  
- inclusivity  
- no targeting individuals  
- no negative or punitive intentions  
- no political manipulation  
- for good, for fun, for collective uplift  

### E. Closure & evaluation (when a manifestation ends)

Every manifestation has an **end date**. When that date passes (or the creator closes it early — TBD), the manifestation enters a **reflection** phase.

- **Only the person who created the manifestation** may evaluate whether it was a success.  
- Evaluation is **gentle and reflective**, not a court verdict — aligned with section 2 (no guarantees, collective meaning matters).  
- Prompts might include: did the outcome happen as hoped? how did holding it feel? what did the circle notice?  
- Holders may see the creator’s reflection; they do not grade success themselves (unless we add optional private holder notes later).

This replaces the vague “outcome tracking (future)” idea with a **creator-led closure** tied to **compulsory end dates**.

### F. My account

Signed-in users need an **account home** where they can easily see:

- **Manifestations I started** (created)  
- **Manifestations I’m holding** (active holds)  

From here (or from detail pages), they need lifecycle actions:

- **Archive** or **delete** a manifestation they created (with clear rules: e.g. cannot delete if others hold without archiving first — TBD)  
- **Withdraw hold** on someone else’s manifestation  

Anonymous users may still browse; **“my stuff”** requires a stable identity (magic link / linked account).

### G. Feature suggestion box

A simple **suggestion box** in the product for ideas about Comanifest itself (not manifestations). Low friction: short text + optional contact, stored safely (Supabase table or link to GitHub Issues — implementation TBD). Tone: “Help us grow Comanifest.”

---

## 4. Technical direction

**Stack:**

- Next.js (App Router)  
- TypeScript  
- Tailwind CSS  
- Supabase (planned for auth + data)  
- React Server Components where appropriate  
- Client Components for interactive UI  

**Implementation habits:**

- follow idiomatic Next.js patterns  
- keep components small and clean  
- use Tailwind for styling  
- avoid unnecessary complexity  
- scaffold features in a modular way  

---

## 5. Design principles

The UI should feel:

- simple  
- playful  
- uplifting  
- community-driven  
- modern  
- minimal  

**Avoid:**

- corporate design  
- dark, heavy themes  
- anything that feels like a petition site clone  
- anything that feels like a productivity app  

**Think:**

- soft colours  
- rounded shapes  
- friendly typography  
- gentle animations  

---

## 6. Working style (with Cursor)

- ask for clarification when needed  
- keep changes scoped  
- avoid rewriting unrelated files  
- maintain a clean, readable codebase  
- explain architectural decisions when helpful  
- generate components that are easy to extend  

---

## 7. Status & roadmap

**Shipped (2026-05):** local dev, GitHub (`LuckiosP/Comanifest`), Vercel production, Supabase auth (magic link on live), manifest + hold flows, UI voice (manifest / hold). Optional `timeframe` text on create; **no end date, search, account home, or closure flow yet**.

**Ongoing:** edit locally → `git push` → Vercel redeploys — see **`docs/deploying.md`**.

### Recommended build order (from new requirements)

Work in **thin slices** — each step should ship something usable on live.

| Phase | What | Why first |
|-------|------|-----------|
| **1 — Data model** | Compulsory **`ends_at`** on manifestations; **`status`** (e.g. active / archived / deleted); optional creator **reflection** fields for post-end evaluation | Everything else (closure, feed filters, account lists) depends on dates and lifecycle |
| **2 — My account** | **`/account`** (or `/me`): manifestations I **started** + I’m **holding** | Core user need; uses existing `user_id` + joins |
| **3 — Lifecycle actions** | **Withdraw hold**; **archive** / **delete** own manifestation (rules TBD) | Account page needs actions, not just lists |
| **4 — Search** | Feed + header **search** (title / intention / category) | Needed before duplicate-nudge is credible |
| **5 — Similar on create** | On **Start a manifestation**, query similar rows and **suggest** before submit | Reuses search; reduces duplicate manifestations |
| **6 — Closure & evaluation** | After **`ends_at`**, prompt **creator only** to reflect on success (gentle copy) | Requires phase 1 dates + notifications or “ready to close” UI |
| **7 — Feature suggestions** | Simple **suggestion box** (Supabase table + form, or link to GitHub Issues) | Independent; can ship anytime after phase 2 |
| **Later** | Custom domain, anonymous→email linking, **security pentest** (`docs/security-pentest.md`), polish | After core product loop is trustworthy |

**Not done yet:** custom domain, full roadmap phases above, anonymous→email linking UX, **security pentest**.

**Open product decisions (TBD when building):** Can creators close before `ends_at`? Delete vs archive when others still hold? Show archived manifestations in search?

---

*End of brief.*
