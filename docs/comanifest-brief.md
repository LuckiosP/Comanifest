# Comanifest — project brief

**Intellectual property:** Comanifest is owned by **Promoderation Ltd** (not individuals). Concept, brief, brand, and code are company property. See [`LICENSE`](../LICENSE) and [`docs/intellectual-property.md`](./intellectual-property.md).

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

**While still active (planned — phase 12):** the creator may post optional **interim updates** — short notes on how things are going so far, visible to people already holding. This is separate from closure reflection; it does not archive the manifestation or block new holds.

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

### H. Share a manifestation

Users who **created** or **hold** a manifestation should be able to **share** it to social platforms — initially **Facebook**, **Instagram**, and **Bluesky**.

- Share from **detail page** and **`/account`** (started + holding lists).  
- Shared link opens the public **manifestation detail URL** with a good **link preview** (title, short description, Comanifest branding — Open Graph / Twitter / Bluesky meta).  
- Copy tuned for the product voice: inviting others to **hold** with intention, not “sign this petition”.  
- **Instagram** has no simple web “post to feed” URL — mobile **Web Share API** where available; otherwise **copy link** + optional pre-written caption. **Facebook** and **Bluesky** can use standard share-intent URLs.  
- Only **active**, non-deleted manifestations are shareable.

### I. Creator email updates (when someone holds)

Creators with an **email on their account** (magic-link sign-in) can opt in to updates when **someone new holds** a manifestation they started.

- **Frequency (user choice):** e.g. **each new hold**, **daily digest**, **weekly digest**, or **off**.  
- Email content stays **gentle** — e.g. “Your manifestation *[title]* was held — *N* people are holding it now.” **Do not** expose holders’ private commitment notes or emails.  
- Requires **notification preferences** stored per user; a **delivery pipeline** (Supabase Edge Function + transactional email provider, or similar) and a **scheduled job** for digests.  
- Tied to **stable identity** — guests without email cannot receive these until they sign in with email (see anonymous→email linking).

### J. Manifestation moderation (new manifestations)

Before a new manifestation appears in the public feed, the platform should **screen it lightly** and **hold anything uncertain** until a human approves it.

**Flow:**

1. **Filter on create** — when someone submits a new manifestation, run an **educated guess** (heuristic rules, keyword/context checks, and/or model-assisted scoring — TBD) as to whether the content **might** breach the **guidelines** (section **D**). Most submissions should pass automatically; only ambiguous or risky ones are flagged.
2. **Pending state** — flagged manifestations are stored as **`pending`**: **visible only to the manifestor** on their account and detail page; **hidden** from the public feed, search, similar-manifestation suggestions, and share until approved. An email goes to **`hello@manifest.org`** so an operator knows something needs review.
3. **Email approval** — the review email includes **Approve** and **Decline** actions (signed links or one-click tokens). **Decline** may include **optional feedback** to the manifestor (gentle copy — not a tribunal). On **approve**, status becomes **`active`** and the manifestation joins the public feed; on **decline**, it stays off the feed (archived or rejected — TBD) and the creator sees the feedback on their account/detail page.

**Principles:** default to **trust** for wholesome content; **pending** is a safety net, not a gate on every post. Operators need a minimal audit trail (who approved/declined, when). Revisit filter thresholds after launch data.

### K. Operator dashboard (“behind the scenes”)

A **private admin area** (not linked from the public site) for platform analysis:

- **Manifestations** — counts, by **category**, status, over time.  
- **Holds** — join activity, holds per manifestation, trends.  
- **Users** — sign-ups, anonymous vs email, active creators/holders (aggregated — no browsing private commitment notes from the dashboard unless explicitly required and audited).  
- **Geography** — country/region breakdown (TBD how collected: e.g. coarse IP at hold/create, optional profile country later — must respect privacy and disclose in guidelines).  

Access **restricted** to operators only (e.g. allowlisted admin emails, Supabase custom claim, or separate auth). Uses **service-role** or admin RLS policies — never expose service keys to the browser. Run **security review** before exposing real user data at scale.

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

Full visual identity (colours, typography, motion, imagery): **`docs/brand-guidelines.md`**.

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

**Shipped (2026-05):** local dev, GitHub (`LuckiosP/Comanifest`), Vercel production, Supabase auth (magic link on live), manifest + hold flows, UI voice (manifest / hold), compulsory **end date** on create, **`/account`** (started + holding), **edit** active manifestations you created (phase 3a).

**Ongoing:** edit locally → `git push` → Vercel redeploys — see **`docs/deploying.md`**.

### Recommended build order (from new requirements)

Work in **thin slices** — each step should ship something usable on live.

| Phase | What | Why first |
|-------|------|-----------|
| **1 — Data model** ✅ | Compulsory **`ends_at`** on manifestations; **`status`** (e.g. active / archived / deleted); optional creator **reflection** fields for post-end evaluation | Everything else (closure, feed filters, account lists) depends on dates and lifecycle |
| **2 — My account** ✅ | **`/account`**: manifestations I **started** + I’m **holding** | Core user need; uses existing `user_id` + joins |
| **3 — Own your manifestations** | **Edit** ✅; **withdraw hold** ✅; **archive** / **delete** ✅ | Account page needs actions, not just lists |
| **4 — Search** ✅ | Feed + header **search** (title / intention / category) via **`?q=`** | Needed before duplicate-nudge is credible |
| **5 — Similar on create** ✅ | On **Start a manifestation**, query similar rows and **suggest** before submit | Reuses search; reduces duplicate manifestations |
| **6 — Closure & evaluation** ✅ | After **`ends_at`**, prompt **creator only** to reflect on success (gentle copy) | Requires phase 1 dates + “ready to close” UI |
| **7 — Feature suggestions** | Simple **suggestion box** (Supabase table + form, or link to GitHub Issues) | Independent; can ship anytime after phase 2 |
| **8 — Share** ✅ | **Share** manifestations you **created** or **hold** — Facebook, Instagram, Bluesky + link preview (OG meta) | Growth; best after public detail URLs are stable |
| **9 — Creator email updates** ✅ | Notify creators when their manifestation is **held** — frequency: each hold / daily / weekly / off | Needs email identity + notification prefs + email provider |
| **10 — Manifestation moderation** | Screen **new** manifestations before they go public (see section **3 J**) | Safety before wide launch; share + feed must respect **`pending`** |
| **10a — Content filter** | On create, **educated guess** whether content might breach guidelines; auto-approve most posts | First slice — defines what gets flagged; needs moderation fields on **`manifestations`** |
| **10b — Pending & operator alert** | Flagged → **`pending`**; **creator-only** visibility (account + detail); email **`hello@manifest.org`** | Depends on 10a; feed, search, similar panel, and share exclude **`pending`** |
| **10c — Email approve / decline** | Review email with **Approve** / **Decline** links; optional **feedback** to manifestor on decline | Depends on 10b; signed one-click tokens; on approve → **`active`** + public feed |
| **11 — Operator dashboard** | Private **`/admin`** analytics: users, manifests, holds, category, geography (aggregated) | Needs admin auth, service role, privacy review — after core loop + moderation + pentest prep |
| **12 — Creator interim updates** | While **active**, creator posts optional “how it’s going” notes visible to holders; does not close or archive | Long-running manifestations stay connected between create and closure; reuses reflection UI / creator-update patterns |
| **Later** | Custom domain, anonymous→email linking, **security pentest** (`docs/security-pentest.md`), polish | Before wide launch |

**Phase 3 build order (recommended slices):** (a) **Edit** ✅ → (b) **Withdraw hold** ✅ → (c) **Archive / delete** ✅.

**Archive / delete (phase 3c) — rules:** creator-only; **archive** active posts (hidden from feed; creator + existing holders can still open); **delete** only when **`join_count ≤ 1`** (no other holders); delete requires confirmation checkbox.

**Phase 8 (share) — scope:** share button on detail + account; canonical URL; OG tags on detail page; platform intents (Facebook, Bluesky); Instagram via Web Share API + copy link; strings in **`intention-copy.ts`**.

**Phase 9 (email) — scope:** `notification_preferences` (or profile fields); trigger on new join for “instant”; cron/queue for digests; requires **custom SMTP** or provider (Supabase auth email alone is not enough for product notifications).

**Phase 10 (moderation) — build order:** (a) **Content filter** on create → (b) **`pending`** status + creator-only visibility + alert to **`hello@manifest.org`** → (c) **Email approve / decline** with optional feedback. Most manifestations should ship **`active`** immediately; only uncertain ones enter **`pending`**.

**Phase 10 (moderation) — scope:** extend **`status`** (or add **`moderation_status`**) with **`pending`**; RLS + queries hide **`pending`** from public feed/search/similar/share; creator sees “awaiting review” on **`/account`** and their detail page; filter implementation TBD (rules-first, model-assisted later); review emails via transactional provider (reuse Resend stack from phase 9); signed approve/decline URLs with expiry; audit fields (reviewed_at, reviewed_by, decline_feedback).

**Phase 11 (dashboard) — scope:** operator-only route; charts/tables from Supabase (aggregates); geography TBD; no public nav link; optional moderation queue view later (email-first for now).

**Phase 12 (interim updates) — scope:** creator-only compose on detail + **`/account`** while **`status = active`**; holders (and creator) see read-only updates on detail; optional soft sentiment (e.g. encouraging / steady / uncertain) — not success/failure scoring; strings in **`intention-copy.ts`**. **Data:** single latest note on **`manifestations`** or a **`manifestation_updates`** table if we want a timeline (TBD). **Optional later:** notify holders when the creator posts (reuse phase 9 stack). Does **not** change **`ends_at`**, archive, or closure reflection fields.

**Not done yet:** custom domain, phases 7 and 10–12 above, anonymous→email linking UX, **security pentest**.

### Backlog (not yet triaged)

Ideas captured for reference — **no priority or build order assigned yet.**

- **Granular closure / success reporting** — optional multi-axis *qualitative* evaluation at close (e.g. outcome shifted vs how holding felt vs what the circle noticed), alongside or instead of the current yes / unsure / no + free-text reflection. Keep non-scored (no ratings or “success %”); may overlap with richer free-text prompts alone. Revisit after phase 12 ships and we see how creators use closure today.

**Open product decisions (TBD when building):** Can creators close before `ends_at`? Delete vs archive when others still hold? Show archived manifestations in search? Can **`ends_at`** be moved earlier if others already hold? Share text/caption wording per platform? Include holder count only vs “someone new held” in emails? Which admin emails get dashboard access? How is geography collected and disclosed? **Moderation:** filter strictness and false-positive handling; decline → archive vs delete; can manifestor edit while **`pending`**; SLA copy for creators waiting on review; who receives **`hello@manifest.org`** in dev vs prod?

---

*End of brief.*
