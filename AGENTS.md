<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Supabase Auth reminders

When working on email/password sign-up, sign-in, or Auth hardening, mention if relevant: in the Supabase dashboard, **Authentication → Attack Protection → Leaked password protection** should usually stay **enabled** for password-based accounts.

## Project docs (read before UI or copy changes)

| Doc | Use when |
|-----|----------|
| [`docs/comanifest-brief.md`](docs/comanifest-brief.md) | Product vision, tone, **manifest / hold** vocabulary |
| [`docs/brand-guidelines.md`](docs/brand-guidelines.md) | Visual identity — colours, typography, layout, motion, imagery, brand voice |
| [`lib/manifestations/intention-copy.ts`](lib/manifestations/intention-copy.ts) | User-facing UI strings (do not hardcode new manifest/hold phrases) |

For look, feel, and brand direction, follow **`docs/brand-guidelines.md`**. For UI copy rules, follow the brief and **`intention-copy.ts`**.
