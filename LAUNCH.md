# Cognitio — Launch checklist

This is the working soft-launch checklist for Cognitio (Argentina-first). Update it as we ship.

## What's shipped (live in production)

- **Marketing site** in Spanish (voseo): home, `/courses`, `/instructors`, `/planes`, `/consultorias`, `/instituciones`, `/about`, `/faq`, `/terms`, `/privacy`. (`/servicios` and `/services/catalog` redirect for compatibility.)
- **Auth**: email/password + magic link via Lovable Cloud.
- **Student**: catálogo, enrollment via Stripe Checkout (placeholder), `/dashboard`, course player with chapters, transcript, resources, discussions, AI tutor by chapter, rating & reviews.
- **Instructor** (invite-only, admin-granted): panel, course CRUD, chapter editor, Mux video upload + auto-transcription, services manager, analytics (revenue / students / completion), guide.
- **AI Studio** (instructors only): knowledge base upload (PDF / .docx / text), blog generator, drafts, style profile, subscription tiers (Académico/Pro; Marketing archived to waitlist) — Stripe wiring exists, billing button currently goes to placeholder.
- **Admin**: `/admin` (asignar/quitar instructor), `/admin/ai-tutor` (modelo, prompt base, temperatura), waitlist review with CSV export.
- **Security**: Supabase RLS on every public table, security definer `has_role` / `has_course_access`, no realtime leak on votes, scoped storage policies for resources.

## Deferred / not yet shipped

- **Payments**: deferred by decision — all pilot users are private (free, hand-enrolled), so no payment processing is needed. When payments ship, the provider is **Mercado Pago**: Stripe does not operate in Argentina / parts of South America. Existing Stripe wiring stays dormant.
- **Transactional email**: no paid domain yet; do not call `email_domain--*` tools or wire Resend / SES until the business account exists. Contact and waitlist submissions live in the database; admin reviews via `/admin`.
- **Certificates** of completion — sidebar shows "Pronto".
- **AI Studio extras**: LinkedIn, X/Twitter, Newsletter generators, Academic bundle (literature review, paper formatter, paper editor) — "Pronto".
- **Instructor invitations workflow** — for now, admin grants the role manually from `/admin`.
- **Mobile audit** of instructor + AI Studio dashboards.
- **Currency**: prices display USD. ARS localization to be revisited when Mercado Pago integration ships.
- **Chapter resources are not read by the AI** — only stored and downloadable.

(Instructor onboarding modal and empty/error-state polish shipped.)

## Classroom pilot

See [`docs/piloto-aula.md`](./docs/piloto-aula.md) for the operational checklist
(language selection on video upload, tutor limits, what the knowledge base accepts).

## Admin runbook

### Granting the instructor role

1. Go to `/admin`.
2. Search the target user by name or email.
3. Click **Hacer instructor**. The badge updates in place; the user can sign back in and access `/instructor`.
4. To revoke, click **Remover instructor** on the same row.

> Admins cannot demote themselves — there's always at least one admin.

### Reviewing the waitlist

1. `/admin` is the user management page (assign/remove instructor); the waitlist with CSV export lives on the same page.

### Tuning the AI tutor

1. Go to `/admin/ai-tutor`.
2. Toggle **AI Tutor activado** to kill-switch the feature platform-wide.
3. Adjust model, temperature, max tokens, system prompt. Click **Guardar configuración**.
4. Changes propagate immediately on next student request (no cache invalidation needed).

### Pre-launch data cleanup

Production currently contains test courses. Before the first public share, delete them:

```
delete from courses
where title in ('Test Final', 'test 1', 'final test', 'Test privado');
```

(Use the database migration tool — RLS allows the row owner or admin to delete; admin runs via service role.)

## Open questions

- Mercado Pago integration details (checkout, webhooks, ARS pricing) — provider chosen, implementation pending.
- Keep USD as the display currency, or localize to ARS (`$ 35.000` format).
- Custom domain (cognitio.com.ar?) and the matching paid email mailbox.
