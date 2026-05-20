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
- the timeframe (optional)  
- the category (weather, global, personal, sports, etc.)  

### B. Holding a manifestation

Other users **hold** a manifestation by:

- choosing **Hold with intention** (or **Hold this manifestation** on the detail page)  
- writing a short **private commitment note** (stored with their account)  
- confirming a **good-faith checkbox** — deliberate, not a throwaway click  
- contributing to the collective count  

### C. Community feed

A list of active manifestations, sortable by:

- newest  
- widest circle (most people holding)  
- category  
- trending (future)  

### D. Guidelines

A clear, simple set of principles:

- do no harm  
- inclusivity  
- no targeting individuals  
- no negative or punitive intentions  
- no political manipulation  
- for good, for fun, for collective uplift  

### E. Outcome tracking (future)

A gentle, non-literal way of reflecting on outcomes:

- “Did this happen?”  
- “How did people feel participating?”  
- “What did the community notice?”  

No promises, no guarantees — just reflection.

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

## 7. Status & next steps

**Shipped (2026-05):** local dev, GitHub (`LuckiosP/Comanifest`), Vercel production, Supabase auth (magic link on live), manifest + hold flows, UI voice (manifest / hold).

**Ongoing:** edit locally → `git push` → Vercel redeploys — see **`docs/deploying.md`**.

**Not done yet:** custom domain, “my holds” / profile, anonymous→email linking UX, polish.

---

*End of brief.*
