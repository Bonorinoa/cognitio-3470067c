# Checkpoint Cleanup Sprint

Four tracks, all low-risk. Track 0 is the CI fix — root cause confirmed.

---

## Track 0 — Fix CI (root cause found)

**Symptom:** every GitHub Actions run fails.

**Cause:** This is a classic Vite stack. `.env` holds `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`, and `src/integrations/supabase/client.ts` throws at import time if either is missing. But `.env` is listed in `.gitignore`, so CI checks out a repo without it, the Supabase client crashes on import, and every Vitest file that transitively imports it errors before a single test runs.

The publishable key is a public anon key (already shipped to every browser visitor) — committing it is the standard pattern for Lovable Vite projects.

**Change:** remove these three lines from `.gitignore`:

```text
.env
.env.local
.env*.local
```

That's it. CI will green up the moment `.env` is committed alongside the existing code. No workflow edits needed.

---

## Track 1 — Vitest suite refresh (the bulk of the work)

Once Track 0 lands, the 71 local failures still need fixing. They all stem from two causes: (a) tests assert English copy after the app went Spanish-first, and (b) `VideoPlayer.test.tsx` crashes inside `@mux/mux-player` under jsdom.

**Strategy:** stop coupling tests to literal copy. Refactor failing assertions to query by **role / label / test-id**, and pull any unavoidable text from `src/locales/es.json` so a future copy edit doesn't break the suite again.

### Files to rewrite

```text
src/components/Navbar.test.tsx
src/components/AccountDeletionSection.test.tsx
src/components/PasswordChangeForm.test.tsx
src/components/InstructorServicesManager.test.tsx
src/components/VideoPlayer.test.tsx          ← also mock @mux/mux-player
src/pages/AdminPanel.test.tsx
src/pages/AuthPage.test.tsx
src/pages/CoursesPage.test.tsx
src/pages/Dashboard.test.tsx
src/pages/CreateCourse.test.tsx
src/pages/Index.test.tsx
src/pages/InstructorDashboard.test.tsx
```

### Conventions going forward

- `getByRole('button', { name: /…/i })` over `getByText`.
- Add `data-testid` only where role+name is genuinely ambiguous.
- For copy that must be asserted, read it from `es.json` via a small `src/test/i18n-helpers.ts` exposing `t(key)`.

### VideoPlayer specific

`@mux/mux-player`'s web-component lifecycle blows up under jsdom (`removeEventListener is not a function` in `disconnectedCallback`). Add a module mock at the top of the test that renders a stub `<div data-testid="mux-player" />` and assert against that.

### Acceptance

`npx vitest run` → 0 failures, 0 uncaught exceptions. ~177/177 passing.

---

## Track 2 — Security hardening (small, targeted)

Scan triage:

| Finding | Verdict |
|---|---|
| 6× `SECURITY DEFINER` callable by anon/authenticated | **Intentional.** Required by the user-roles pattern to avoid RLS recursion (`has_role`, `has_course_access`, `get_public_profile`, `get_instructor_catalog`, `handle_new_user`). Document and ignore. |
| 2× public bucket listing (`avatars`, `course-images`) | **Intentional.** Public storefront assets. Document and ignore. |
| 1× "RLS policy always true" | Investigated 6 policies. 3 are `SELECT` on intentionally public tables. 3 are `service_role`-scoped (RLS bypassed anyway). **One real concern:** `ai_bundle_waitlist` INSERT is open to `anon` with no length caps. |

### Changes

1. **Waitlist defense-in-depth migration:**
   ```sql
   ALTER TABLE public.ai_bundle_waitlist
     ADD CONSTRAINT waitlist_email_len  CHECK (char_length(email) BETWEEN 3 AND 254),
     ADD CONSTRAINT waitlist_bundle_len CHECK (char_length(bundle) BETWEEN 1 AND 64),
     ADD CONSTRAINT waitlist_notes_len  CHECK (notes IS NULL OR char_length(notes) <= 1000);
   ```
2. **Client-side zod validation** in `WaitlistForm.tsx` mirroring those bounds with i18n error messages.
3. **Mark the 8 intentional findings as ignored** via `security--manage_security_finding` with explanations.
4. **Update `security-memory`** to record what's intentionally public.

---

## Track 3 — Smoke E2E that actually runs

Playwright's `webServer` is fine in CI but flaky in the sandbox. Two pragmatic moves:

1. **New `e2e/smoke.spec.ts`** — three assertions: `/` loads with H1, `/courses` renders the catalog grid, `/ai-studio` renders the editorial landing. No auth required.
2. **Bump `playwright.config.ts` webServer timeout** from 120s → 180s. `reuseExistingServer` is already correct.

CI workflow stays as the source of truth; sandbox runs Vitest only.

---

## Out of scope

- Rewriting production components (tests adapt to code, not the reverse).
- New features, copy, or routes.
- Stripe / Mux / edge-function logic.
- Auth provider configuration.

## Order of execution

1. **Track 0** — `.gitignore` edit. Unblocks CI immediately.
2. **Track 2** — DB migration (needs approval; types regenerate), then client validation + security memory + ignore findings.
3. **Track 1** — Test rewrites (largest diff, all isolated to `*.test.tsx`).
4. **Track 3** — Smoke spec + playwright config bump.
5. Run `npx vitest run` end-to-end and report green.

## Risk

Near zero. The only DB change is additive CHECK constraints (current rows are short, no backfill). The `.env` commit only exposes already-public keys.
