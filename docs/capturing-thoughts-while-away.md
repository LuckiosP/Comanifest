# Capturing thoughts while the app isn't running

You **cannot email or WhatsApp Cursor's AI directly** — the assistant only runs when you open this project in Cursor and chat. There is no Comanifest inbox that reaches the AI while you're offline.

These workflows get your thoughts **saved somewhere sensible** so you (or Cursor) can pick them up next session.

---

## Recommended: GitHub (phone-friendly)

**Best for:** ideas, bugs, "remember to…", security worries, copy tweaks.

### Option A — GitHub mobile app

1. Install **GitHub** on your phone and sign in.
2. Open **`LuckiosP/Comanifest`**.
3. **Issues** → **New issue** → choose **Thought or idea** (template).
4. Write and submit.

Next time in Cursor:

> Review my open GitHub issues on Comanifest, especially labeled `thought`.

*(Requires [GitHub CLI `gh`](https://cli.github.com/) on your laptop for the assistant to list issues — or paste issue links manually.)*

### Option B — Edit the inbox file in the browser

1. On your phone, open:  
   `https://github.com/LuckiosP/Comanifest/edit/main/docs/thoughts-inbox.md`
2. Add bullets under **Inbox**.
3. Commit (GitHub walks you through it).

Next time in Cursor:

> Read `docs/thoughts-inbox.md` and help me with what's there.

Changes sync like normal code (`git pull` on your laptop if you edited from another device).

---

## Email (simple, manual)

**Best for:** quick notes to yourself.

1. Email **yourself** from your phone (subject e.g. `Comanifest thought`).
2. When you're back at the laptop, **paste** the email into Cursor or add it to `docs/thoughts-inbox.md`.

There is no address that delivers mail **to the AI**.

---

## WhatsApp

**WhatsApp does not connect to Cursor.** Practical alternatives:

| Instead of… | Do this… |
|-------------|----------|
| WhatsApp message to "the app" | WhatsApp **yourself** (Saved Messages) or email yourself |
| Voice note | Transcribe or paste summary into a GitHub Issue or `thoughts-inbox.md` |

Automating WhatsApp → GitHub needs a business API and extra services — not worth it for personal notes unless you outgrow the options above.

---

## What does *not* sync automatically

| Thing | Reality |
|-------|---------|
| Cursor chat history | Stays in Cursor; use Issues/inbox for durable notes |
| Email → AI | Not supported |
| WhatsApp → AI | Not supported |
| Local `npm run dev` | Only runs when your laptop is on and you start it |

**Code and `thoughts-inbox.md`** sync via **GitHub** once committed.

---

## Quick pick

| You want… | Use… |
|-----------|------|
| Structured ideas from phone | **GitHub Issue** (Thought template) |
| Messy bullet list | **`docs/thoughts-inbox.md`** on GitHub |
| Fastest, zero setup | **Email yourself** → paste in Cursor later |

---

*See also: `docs/project-handoff.md`, `docs/security-pentest.md` (when you're ready for a security review).*
