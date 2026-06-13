# Launch-Readiness Sprint — Status

Single-day execution of the approved plan. Stripe, email infra, third-party analytics, and the i18n sweep were explicitly deferred.

## Shipped

### 1. SEO & social metadata
- `index.html`: Spanish-first title/description, OG + Twitter tags, `Organization` JSON-LD, `lang="es"`, favicon link.
- Branded **1216×640 OG image** generated and saved to `public/og-image.jpg`.
- `public/robots.txt`: allows public surface, disallows `/admin`, `/dashboard`, `/instructor`, `/ai-studio`, `/settings`. Points crawlers at the sitemap.
- `public/sitemap.xml`: static sitemap with 12 public routes.
- `react-helmet-async` installed and wired in `src/main.tsx`.
- Reusable `<SEO>` component (`src/components/SEO.tsx`) added to: Index, CoursesPage, CoursePage (dynamic per course), InstructorsPage, ServicesCatalogPage, AboutPage, FAQPage (with `FAQPage` JSON-LD), AIStudioLanding.
- NotFound now sets its own `<SEO>` tag too.

### 2. Branded NotFound + global error boundary
- `src/pages/NotFound.tsx` restyled in Spanish with primary CTAs (Volver al inicio, Ver cursos) and quick-links (Instructores, Servicios, FAQ).
- `src/components/ErrorBoundary.tsx` wraps the entire app in `App.tsx`. Shows a branded fallback with Recargar / Volver al inicio actions; logs the stack to the console in all envs and shows the error message in dev only.

### 3. E2E coverage expansion
- `e2e/student/purchase-flow.spec.ts`: catalog → first course → auth-gate CTA. Stripe checkout marked `.skip` with TODO until business setup.
- `e2e/instructor/create-course.spec.ts`: verifies `/instructor` redirects unauthenticated users to `/auth`. Full create-course flow `.skip` until a seeded instructor exists in CI.
- `e2e/admin/role-assignment.spec.ts`: verifies `/admin` redirects unauthenticated users to `/auth`. Role-grant flow `.skip` until seeded admin exists in CI.

### 4. Security audit
- `supabase--linter` + `security--run_security_scan` run. 14 findings, all WARN level (0 critical/error).
- All findings are intentional trade-offs: public storage bucket listing (course images + avatars), SECURITY DEFINER helpers required for RLS to work.
- Security memory updated with the full posture, accepted risks, and access-control model.

### 5. Accessibility quick-pass
- `<html lang="es">` set in `index.html`.
- Navbar mobile menu toggle already has `aria-label`; verified.
- ErrorBoundary icons marked `aria-hidden`.
- NotFound icons marked `aria-hidden`, semantic `<main>` wrapper, single `<h1>`.

### Test suite
- **147/147 vitest tests passing.**
- Test setup updated to wrap renders in `HelmetProvider` so SEO-using components render in tests.

## Out of scope (carried into next sprint)
- Stripe live keys / Argentina tax setup (waiting on business setup, possible Mercado Pago switch).
- Email infrastructure (waiting on paid domain).
- Mobile audit of instructor dashboards.
- First-time instructor onboarding walkthrough.
- Hooking up real seeded test users so the `.skip`'d E2E specs can run.

## Notes
- Social preview crawlers (LinkedIn, WhatsApp, Slack) read the static `index.html` head only since they don't execute JS — that's covered. Per-route titles via Helmet only benefit JS-executing crawlers (Googlebot) and the in-tab title.
- After publishing, the OG image won't update in already-shared links until each platform re-fetches; force a refresh via each platform's link debugger if needed.
