
# Cognitio Positioning, Pricing & Copy Rewrite Plan

## 1. Positioning (the thesis)

**One-line pitch (ES):** *Tecnología educativa con IA, diseñada para que instructores enseñen mejor y ganen más — no para reemplazarlos.*

**One-line pitch (EN):** *Ed-tech with AI, built so instructors teach better and earn more — not to replace them.*

**What Cognitio is:** An ed-tech studio specializing in AI-augmented learning. We build and operate a light, innovative LMS that complements institutional platforms (Canvas, Moodle), with thoughtful AI features baked in. The LMS is the showcase; add-ons, bundles, and custom work extend it.

**Audiences (dual, no split home page):**
- **Instructors & academics** — self-serve, mostly free, optional paid add-ons.
- **Institutions, programs, small businesses** — contact us for custom solutions; their fees subsidize instructor features.

## 2. Pricing model

A **Core + Add-ons + Tiers + Custom** structure. Three surfaces:

### A. Free Core (always free for verified instructors and their students)
The "public good" baseline. Showcases our craft.
- Light LMS: courses, chapters, video (Mux), resources, progress, discussions
- Student–instructor messaging
- Basic AI features that are *education-specific* (not generic copywriting):
  - **AI Tutor** in chapters (already built) — limited daily questions
  - **AI-generated transcripts & chapter summaries** (already built via Mux webhook)
  - **AI study guide / flashcards from a chapter** (new, small)
- Instructor public profile + course catalog listing

### B. Paid Add-ons (à la carte, one-time or low monthly)
For instructors who want more reach or revenue.
- **Consultorías marketplace listing** — small monthly fee or revenue share (enforce: all consultants must be instructors)
- **AI Studio · Marketing bundle** ($19/mo) — Blog (live), LinkedIn, Twitter, Newsletter (keep as Coming Soon, ship next)
- **AI Studio · Academic bundle** ($19/mo) — Lit review, paper formatter, editor (Coming Soon)
- **AI Studio · Pro** ($29/mo) — both bundles

Keeps the existing Stripe subscription plumbing; just reframes it as add-ons to a free core instead of the whole product.

### C. Institutional / Custom (contact form)
A single **"Para Instituciones"** page with a short intake form:
- White-label LMS deployment
- Custom AI workflows (grading assistants, curriculum tools, cohort analytics)
- Private cohort hosting (the existing `private` course visibility)
- Training & integration with Canvas/Moodle

Pricing: "Desde $X" anchor, real number quoted after the form. These fees explicitly subsidize the free core — we say this on the page.

## 3. Information architecture changes

Current nav: Home, Courses, Instructores, Consultorías, AI Studio.

Proposed nav: **Home, Plataforma, Cursos, Instructores, Consultorías, Para Instituciones, AI Studio.**

- **/** (Home) — rewritten around the thesis, not the founders' bios
- **/plataforma** (new) — what the LMS does, AI features, free for instructors
- **/courses** — unchanged structurally, lighter copy
- **/instructores** — unchanged, add "Solicitar invitación" subtle CTA
- **/consultorias** — clarify these are services by enrolled instructors
- **/instituciones** (new) — custom solutions + contact form
- **/ai-studio** — reframed as one of several add-ons to the free core
- **Founders' Story** — demoted from home hero to an "Equipo" section lower on home, or moved to `/about`

## 4. Home page rewrite (structure)

```text
[Hero]
  H1: Tecnología educativa con IA, hecha para instructores.
  Sub: Una plataforma ligera que complementa Canvas y Moodle,
       con IA pensada para enseñar mejor — no para reemplazar.
  CTAs: [Explorar la plataforma]  [Soy una institución]

[Three pillars — what we do]
  1. Plataforma LMS gratuita para instructores
  2. AI Studio: herramientas de contenido y publicación
  3. Soluciones a medida para instituciones

[Por qué existimos] — short manifesto (the thesis, 2 paragraphs)

[Producto en acción] — 3 screenshots/clips of LMS + AI Tutor + Transcripts

[Add-ons disponibles] — compact grid: Marketing, Academic, Consultorías marketplace
  with "Próximamente" badges intact

[Quiénes somos] — Founders' Story (demoted, condensed to 2 cards + link to /about)

[CTA institucional] — "¿Representas a una institución?" → /instituciones
```

## 5. Copy rewrite scope

Rewrite the visible copy on these pages in both `es.json` and `en.json` (Spanish primary):
- `Index.tsx` (home) — full rewrite
- `CoursesPage.tsx` — tighten hero, add "Cursos públicos de instructores Cognitio" framing
- `InstructorsPage.tsx` — keep, add invite-only note
- `ServicesPage.tsx` (Consultorías) — clarify "ofrecidas por instructores Cognitio"
- `AIStudioLanding.tsx` — reframe as add-on, not standalone product; keep Coming Soon
- `PricingSection.tsx` — add a "Free Core" tier at the front; keep Marketing/Academic/Pro
- **New:** `PlatformPage.tsx` at `/plataforma`
- **New:** `InstitutionsPage.tsx` at `/instituciones` with intake form
- `Navbar.tsx` and `Footer.tsx` — new links
- `FoundersStorySection.tsx` — keep component, move off home hero

No business logic, Stripe, or schema changes in this pass except:
- One new table `institution_inquiries` (name, email, organization, message, created_at) for the contact form, with RLS allowing anonymous insert + admin read.

## 6. What we are NOT doing in this pass
- Not shipping LinkedIn/Twitter/Newsletter/Academic tools yet — they stay Coming Soon as you requested (separate plan after this).
- Not changing existing Stripe products or subscription tiers.
- Not removing the Founders' Story — just demoting it.
- Not building white-label deployment infra — that's sold via the contact form, delivered as consulting.

## 7. Order of execution (once you approve)
1. Update `es.json` / `en.json` with the new copy keys (Spanish first, English mirror).
2. Rewrite `Index.tsx` around the new structure; demote Founders' Story.
3. Build `PlatformPage.tsx` and `InstitutionsPage.tsx` + route them in `App.tsx`.
4. Update `Navbar.tsx` + `Footer.tsx`.
5. Rewrite copy on Courses, Instructores, Consultorías, AI Studio Landing, Pricing.
6. Migration: `institution_inquiries` table + RLS + GRANTs; wire the form.
7. QA: visit each page in preview, verify ES/EN parity, verify Coming Soon badges still render.

## 8. Open question before I implement
**Spanish brand voice:** should the home manifesto read more **academic & sober** (matches the founders' bios) or **warm & accessible** (matches the coral palette and "para instructores no técnicos" persona)? I'll default to **warm & accessible** unless you say otherwise — easier for non-technical instructors to feel invited.
