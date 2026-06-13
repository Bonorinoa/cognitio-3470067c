# Restructure: Cognitio plans vs. instructor consulting

Clean split so the navigation maps 1:1 to revenue sources and stops conflating "what Cognitio sells" with "what instructors sell."

## New information architecture

```text
Cognitio sells (a + b)              Instructors sell (c, commissioned)
────────────────────────            ─────────────────────────────
/planes      ← NEW pricing page     /consultorias   ← renamed catalog
/ai-studio                          (also surfaced on each
/instituciones                       instructor profile)
/plataforma
```

### Navbar change
- "Servicios" → **"Planes"** (links to `/planes`)
- "Consultorías" stays out of the main nav; promoted contextually from instructor profiles and a small entry point on `/planes` + footer.

## Page-by-page changes

### 1. `/planes` (new, replaces current `/servicios`)
Cognitio-as-suite pricing. Three tiers, all framed as "what Cognitio offers":
- **Plataforma core** — Gratis (instructores invitados + alumnos)
- **AI Studio** — $19/mes add-on
- **Instituciones** — A medida (CTA to contact form / `/instituciones`)

Remove the "¿Buscás consultoría 1:1?" block and the long custom-build contact section (that content already lives on `/instituciones`; keep `/planes` focused and short).

### 2. `/consultorias` (rename of `/services/catalog`)
- Route rename: `/services/catalog` → `/consultorias`
- Add a short hero clarifying: *"Asesorías 1:1 ofrecidas por instructores de Cognitio. Cognitio facilita el contacto y el pago; el servicio lo presta el instructor."*
- Keep auth-gated (as today).

### 3. Instructor profile pages
- Already display `InstructorServicesDisplay`. Add a small "Reservar consultoría" CTA that deep-links into `/consultorias?instructor=<id>` (or scrolls to that instructor's section). No business-logic changes — presentation only.

### 4. `/servicios` → 301-style redirect
Keep the path alive by redirecting `/servicios` → `/planes` in `App.tsx` so existing links, sitemap entries, and `llms.txt` keep working until updated.

### 5. Footer + `llms.txt` + `sitemap.xml` + `es.json`
Update the four spots that reference "Servicios":
- `Footer.tsx` link label + href
- `public/llms.txt` entries
- `public/sitemap.xml` (and `scripts/generate-sitemap.ts`)
- `src/locales/es.json` nav keys

## Files touched (estimate)

- `src/App.tsx` — add `/planes`, `/consultorias` routes + redirect for `/servicios` and `/services/catalog`
- `src/pages/ServicesPage.tsx` → rename to `PlanesPage.tsx`, trim to plans-only
- `src/pages/ServicesCatalogPage.tsx` → rename to `ConsultoriasPage.tsx`, add hero
- `src/components/Navbar.tsx` — label/href update
- `src/components/Footer.tsx` — label/href update
- `src/pages/InstructorProfile.tsx` — add "Reservar consultoría" CTA near services
- `src/locales/es.json` — copy keys
- `public/sitemap.xml`, `scripts/generate-sitemap.ts`, `public/llms.txt`

No database or edge-function changes. Voseo and existing design tokens preserved throughout.

## Out of scope (for this pass)
- Actual pricing for AI Studio tiers beyond what already exists
- Commission % on consultorías (still TBD — flagged for a separate decision)
- Moving consulting payments through Stripe Connect (today they're handled via the existing services/inquiries flow)

## Open question before I build
Two small naming calls — happy to default if you don't care:
1. `/planes` vs `/precios` for the new pricing route?
2. Keep "Consultorías" as the user-facing label, or prefer "Asesorías"?
