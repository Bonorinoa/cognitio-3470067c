# Contributing to Cognitio

This guide is for **non-technical admins** (founders, instructors) who need to keep Cognitio running without writing code.

If you are a developer modifying the codebase, also read `README.md` and the architecture notes inside `src/hooks/queries/README.md`.

---

## What you can do without code

These tasks are done through the **Lovable Cloud backend panel** (the "View Backend" button in the Lovable editor) — never by editing files.

### Invite a new instructor

1. The person signs up at `/auth` as a normal student.
2. In Backend → **Table Editor** → `user_roles`, insert a row with:
   - `user_id`: their auth user ID (copy from the `profiles` table)
   - `role`: `instructor`
3. They can now access `/instructor` on next login.

> Only admins should do this. There is **no public "Become an instructor" signup** — this is by design.

### Grant admin to a new co-founder

Same as above, but `role: admin`. Admins can also see `/admin`.

### Make a course "Featured" in the catalog

Backend → Table Editor → `courses` → set `is_featured = true` on that row. The Cursos page picks it up immediately.

### Refund a purchase

1. Refund the charge inside **Stripe Dashboard** (not Lovable).
2. Backend → Table Editor → `purchases` → delete the corresponding row (or set a `refunded_at` if you add one later). The student loses access on next page load.

### Handle support tickets / data deletion requests

A user can delete their own account from `/settings`. If they email instead, ask them to do it themselves; if they can't, an admin can delete their row from `auth.users` (via the auth UI), which cascades through profiles, purchases, and progress.

---

## What requires a developer

These changes need code edits + a deployment:

- **Pricing or tier limits** for AI Studio (live in the `ai_tier_limits` table — values are data, but the UI labels are translated strings in `src/locales/*.json`).
- **Categories** for courses (`src/lib/categories.ts`, soon).
- **Anything visual**: copy, layout, colors, fonts.
- **New course visibility rules** or RLS policies.
- **Edge functions**: Stripe webhook, Mux upload/webhook, AI generation.

When in doubt, open a chat with the Lovable agent and describe what you need — it can usually make the change in minutes.

---

## Project north star (re-read before approving any new feature)

Cognitio is an **invite-only, instructor-first academic ecosystem** — not a marketplace. Before saying yes to a feature, ask:

1. Does it increase instructor autonomy or revenue retention?
2. Does it keep the architecture simple for a small team relying on AI tools?
3. Is it explicitly **NOT** a quiz engine, gradebook, SCORM importer, SAML SSO, AI grader, or anything from the "Non-Goals" section of `README.md`?

If a feature fails any of these, push back.

---

## Repository docs map

| File                                   | Purpose                                  |
| -------------------------------------- | ---------------------------------------- |
| `README.md`                            | Project overview, stack, routes          |
| `CONTRIBUTING.md`                      | **You are here**                         |
| `TESTING.md` / `E2E_TESTING.md`        | How to run unit and end-to-end tests     |
| `docs/history/CHANGELOG.md`            | Historical change log (frozen archive)   |
| `docs/history/DEVELOPMENT_PLAN.md`     | Old roadmap (frozen, kept for context)   |
| `src/hooks/queries/README.md`          | Data-access pattern for developers       |

Old planning docs are intentionally archived so they don't mislead future readers.
