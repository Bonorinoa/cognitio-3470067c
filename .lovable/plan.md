
# Cognitio — Codebase Survey & Modernization Plan

## 1. What's already strong

- **Solid architecture**: React 18 + Vite + TS, Supabase RLS, TanStack Query, lazy-loaded routes, semantic design tokens in `index.css`, shadcn primitives, i18n (es/en), tests (Vitest + Playwright + MSW).
- **Backend discipline**: 22 well-scoped tables, separate `user_roles` (no privilege escalation), Edge Functions for Stripe / Mux / LLM / account deletion — consistent with the invite-only philosophy.
- **Real product surface**: full course lifecycle (Mux video, chapters, resources, transcripts, ratings, discussions, AI tutor), instructor analytics + services, AI Studio (knowledge base, style profile, blog generator, tiered subscriptions), admin panel, public/private course visibility, account deletion, terms/privacy/FAQ.
- **No critical security debt** per the changelog and the role/grant patterns observed.

## 2. Honest critique — where it feels dated

### Functional / architectural friction

1. **Mega-files** — `AIStudioBlog.tsx` (848 lines), `EditCourse.tsx` (731), `CreateCourse.tsx` (510), `AdminPanel.tsx` (456), `ChapterResourceManager.tsx` (533), `InstructorServicesManager.tsx` (414). Hard for non-technical co-admins to navigate; need decomposition into focused subcomponents + hooks.
2. **Duplicated category logic** in `CoursesPage.tsx` (Spanish UI labels mapped to English DB values inline) — should be centralized in `lib/categories.ts` and ideally driven by a DB enum or `platform_settings`.
3. **`Dashboard.tsx` defines an `AnimatedTabsTrigger`** locally with a MutationObserver — that logic belongs in `src/components/ui/tabs.tsx` as a shared variant; it's reinvented per page.
4. **Hardcoded founder IDs** in `InstructorsPage.tsx` — should be a boolean column `is_founder` on `profiles` (or stored in `platform_settings`) so admins can manage it without code changes.
5. **`useEffect` polling for purchase verification** in `CoursePage.tsx` is fine, but the Stripe webhook should be the source of truth; consider a Supabase Realtime subscription on `purchases` instead of exponential-backoff polling.
6. **No dark mode** despite `next-themes` being installed and `darkMode: ["class"]` in tailwind config — the salmon/cream palette only exists in light mode.
7. **SEO is bare** — `index.html` likely has generic title/meta; no per-route `<title>`/meta updates, no JSON-LD for courses/instructors, no OG images. The published site at cognitio.lovable.app will not rank.
8. **Loading UX** — full-screen spinner during route lazy-load on every navigation (visible on `/ai-studio`). Replace with route-level skeletons that match destination layout.
9. **Mobile navbar** still uses a hamburger that opens a stacked text list — no AI Studio CTA, no auth status surfaced when collapsed. The mobile experience hasn't been audited end-to-end.
10. **Accessibility gaps**: icon-only buttons sometimes missing `aria-label`, headings stack jumps (h1→h3 in some pages), `h-screen` used in places where `h-dvh` is correct on mobile.
11. **Old docs in repo** (`DEVELOPMENT_PLAN.md`, `CHANGELOG.md` last touched Jan 2026) — outdated, will mislead a returning admin.

### Aesthetic critique

The visual identity reads as *competent shadcn*, not as a *crafted academic boutique*. Concretely:

- **Typography is generic**: Roboto everywhere despite Libre Caslon Text being imported. Headings should pull a serif/display face — exactly what differentiates "academic elegance" from "another SaaS."
- **Hero is a wash of orange-cream** — pretty but vague. No anchoring imagery, no instructor faces, no actual proof of value. The 3D-cubes background fights the editorial tone.
- **Cards are uniformly rounded-2xl + soft shadow**, no hierarchy or compositional rhythm. Course catalog cards look like every other course catalog (Udemy-grade).
- **Color use is monotone salmon**. The palette needs a quiet second accent (deep ink, paper, or ochre) to carry headings, dividers, and editorial flourishes.
- **Footer is sparse and disconnected** — no contact, no social, no newsletter signup; just legal + copyright.
- **AI Studio landing** uses the same generic three-step "Upload → Configure → Generate" card row — does not feel premium for a paid product ($19–$29/mo).
- **No motion language**. Framer Motion is installed but used sparingly (just the founders section). Page transitions, hover states, and section reveals could carry the "no-nonsense academic elegance" with subtle, slow, considered motion.

## 3. Proposed "level-up" roadmap (no new features, only modernization)

Three phases, each shippable on its own. I'd suggest tackling them in order.

### Phase A — Visual & brand polish (highest impact, lowest risk)

1. Introduce a real type scale: serif display face (Libre Caslon Text or swap for **Instrument Serif** / **Fraunces**) for h1/h2, Roboto for body, keep Roboto Mono only for accents (logo, tags, code).
2. Extend the design token palette in `index.css`: add `--ink`, `--paper`, `--ochre`/secondary accent, and revise `--gradient-*` and shadows. Add a working **dark theme** block.
3. Rebuild the landing **hero** with editorial composition (asymmetric type, real instructor photography, quiet motion, no 3D cubes).
4. Redesign **CourseCard** and **InstructorCatalogCard** with stronger hierarchy (cover-led, instructor avatar inline, rating + price as quiet metadata, not chips).
5. Redesign the **footer**: add tagline, contact, social, language switcher, newsletter placeholder.
6. Audit **Navbar mobile** (drawer with auth state, AI Studio CTA, language toggle).

### Phase B — UX & flow refinements

1. Replace the global `PageLoader` with **per-route skeletons** matching destination layout.
2. Course purchase: swap polling for a **Realtime subscription** on `purchases` (or at minimum a single retry + manual refresh CTA).
3. Centralize **categories** (single source of truth, no inline mapping).
4. Hoist **AnimatedTabsTrigger** into a shared `ui/animated-tabs.tsx`.
5. Move **founders flag** to DB (`profiles.is_founder` boolean).
6. Full **a11y pass**: focus rings, `aria-label`s, heading order, `h-dvh`, tap target sizes.
7. **SEO pass**: add `react-helmet-async` (or native `<title>` updates), per-route titles/meta/OG, JSON-LD for `Course` and `Person`, sitemap, robots tweaks.

### Phase C — Codebase hygiene (for the non-technical handoff)

1. Decompose the six mega-files into a `features/<domain>/` folder per area (`ai-studio/blog/`, `instructor/course-editor/`, `admin/`), with one component per responsibility and colocated hooks.
2. Standardize data fetching: every Supabase query goes through a typed hook in `src/hooks/queries/`.
3. Refresh `README.md`, archive `DEVELOPMENT_PLAN.md` / `CHANGELOG.md` as `docs/history/`, write a one-page **CONTRIBUTING.md** for non-technical admins (how to add a course, how to invite an instructor, how to publish).
4. Run `supabase--linter` + `security--run_security_scan` and burn down anything new.
5. Smoke-test the existing Playwright + Vitest suites against the post-refactor code.

## 4. What I need from you before building

To avoid me steering the brand based on my own taste:

- Do you want to **commit to a refined visual direction** (Phase A) first, or fix the **UX/architecture papercuts** (Phase B+C) first?
- For Phase A: should I generate **three design directions** for the landing + course card (rendered prototypes) so you can pick, or do you trust me to apply the academic-editorial direction in one pass?
- Anything I called "dated" that you actually want to keep (e.g. the 3D-cubes hero, the salmon-only palette, the current footer)?

```text
SUGGESTED ORDER
A. Visual & brand polish   ──►  B. UX refinements   ──►  C. Code hygiene
   (1–2 sessions, big WOW)      (1–2 sessions)            (background)
```
