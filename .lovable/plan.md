# Launch-Readiness Sprint

Scope = ship-safe for an Argentina-first public launch. Stripe, email infra, and the i18n sweep are explicitly out of scope.

## Tracks

### 1. SEO & social metadata
- Replace placeholder `<title>`, `<meta name="description">`, OG + Twitter tags in `index.html` with Spanish-first Cognitio copy.
- Add `<link rel="canonical">` and `lang="es"` on `<html>`.
- Add sitewide `Organization` JSON-LD (name, url, description, sameAs if applicable).
- Generate a branded **1200×630 OG image** (salmon/charcoal palette, Cognitio wordmark + Spanish tagline) → save to `public/og-image.jpg`, reference from OG/Twitter tags.
- Update `public/robots.txt` (allow all, point to sitemap).
- Add `public/sitemap.xml` listing public routes: `/`, `/courses`, `/instructors`, `/services`, `/about`, `/faq`, `/privacy`, `/terms`, `/ai-studio` landing.
- **Per-route titles**: install `react-helmet-async`, wrap app, add `<Helmet>` to ~8 top public pages (Index, CoursesPage, InstructorsPage, ServicesCatalogPage, AboutPage, FAQPage, AIStudioLanding, CoursePage with dynamic title from course data).

### 2. Branded NotFound + global error boundary
- Restyle `src/pages/NotFound.tsx` to match Cognitio (warm bg, salmon CTA, helpful links back to `/courses` / `/`, Spanish copy).
- Create `src/components/ErrorBoundary.tsx` (React class boundary) wrapping the router in `App.tsx`. Show branded fallback with reload + back-home actions and a `console.error` for debugging.
- Add a simple `src/pages/ErrorFallback.tsx` for the 500-style screen used by the boundary.

### 3. E2E coverage expansion
- Add three Playwright specs in `e2e/`:
  - `student/purchase-flow.spec.ts` — browse catalog → open course → checkout button visible (stub the Stripe redirect, just assert intent).
  - `instructor/create-course.spec.ts` — login as seeded instructor → create draft course → verify it appears in `/instructor/courses`.
  - `admin/role-assignment.spec.ts` — login as admin → open user manager → grant instructor role → verify badge updates.
- Reuse existing `e2e/common/fixtures.ts` and `helpers.ts`; add seed data helpers if needed.
- Update `.github/workflows/test.yml` only if new specs require env vars.

### 4. Security & RLS audit
- Run `supabase--linter` + `security--run_security_scan`; review every public-schema table for RLS + GRANTs.
- Address any critical/high findings discovered (with user confirmation before non-trivial schema changes).
- Update `security--update_memory` with the post-audit posture (intentionally public surfaces, founder allow-list, deferred email infra).

### 5. Accessibility quick-pass
- Audit and fix in one go:
  - `<html lang="es">` (covered in Track 1).
  - Alt text on all instructor avatars + course covers (fallback to "Avatar de {name}" / course title).
  - Visible focus rings on salmon CTA buttons (verify contrast against bg).
  - Form labels properly associated on `AuthPage`, `CreateCourse`, `EditCourse`, `UserSettings`.
  - Add `aria-label` to icon-only buttons in `Navbar` (mobile menu toggle, sidebar collapse).
  - Heading hierarchy spot-check on landing + course page (single `<h1>` per route).

## Execution order

1. **Track 4 first** (read-only scan) — surfaces blockers while I work on visual stuff.
2. **Track 1** (metadata + OG image generation in parallel).
3. **Track 2** (NotFound + ErrorBoundary) — small, independent.
4. **Track 5** (a11y pass) — touches many files; batch edits.
5. **Track 3** (E2E specs) — last because it depends on stable UI selectors.
6. Run full `vitest` + `playwright` smoke. Target: 147+ vitest passing, 3 new E2E specs green.

## Out of scope (confirmed)

- Stripe live keys / Argentina tax setup (defer to business setup; possible switch to Mercado Pago).
- Email infrastructure (deferred until paid domain).
- Third-party analytics (using built-in Lovable/host telemetry only).
- i18n sweep of remaining hardcoded Spanish strings (Spanish-only stack makes this cosmetic).
- Mobile audit of instructor dashboards (next sprint).
- First-time instructor onboarding walkthrough (next sprint).

## Risks

- **Helmet adoption**: requires removing `<link rel="canonical">` from `index.html` to avoid duplicates; will handle in same commit.
- **E2E flakiness**: new specs against real auth flow may need mock-mode or seed users. If real seeding is blocked, I'll mark them `.skip` with a TODO rather than ship flake.
- **Security findings**: if the scan surfaces a critical schema issue, I'll pause and ask before mutating the database.

## Estimated effort

Single agent run, ~25–40 minutes of tool calls. No external approvals required except possible DB migration if the security audit surfaces something.
