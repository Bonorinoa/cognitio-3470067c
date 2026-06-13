# Admin QA sweep — findings

Tested as admin (`agbonorino21`) across `/`, `/courses`, `/instructors`, `/services`, `/course/:id`, `/dashboard`, `/admin`, `/admin/ai-tutor`, `/instructor`, `/instructor/courses`, `/instructor/analytics`, `/ai-studio`, `/ai-studio/blog`.

## Bugs / inconsistencies found

**Spanish-only memory violations (English strings leaking through):**
1. `/admin/ai-tutor` — entire settings card is in English: "AI Tutor Settings", "Configure the AI tutor…", "AI Tutor Enabled", "When disabled, students cannot use…", "System Prompt", "Reset to Default", "AI Model", "Temperature", "Max Tokens", "Save AI Settings".
2. Course category badges render English DB values: "Development", "Data Science", "AI & ML" — while the filter chips on `/courses` show "Desarrollo", "Ciencia de Datos", "IA & ML".
3. Course cards show "1 chapters" / "2 chapters" / "5m" (English plurals and unit).
4. `/dashboard` course cards: "100% complete" → should be "100% completado".
5. `/instructor/analytics` H1 says "Analytics" (breadcrumb + sidebar say "Analíticas"). Date column shows "07 Jan 2026", "04 Jan 2026", "30 Dec 2025" — English month abbreviations.

**Voseo / tone inconsistency** (home is voseo, several pages slip into formal "usted" or neutral "tú"):
6. `/instructor`: "Tienes 3 cursos publicados" → "Tenés".
7. `/ai-studio`: "Su base de conocimiento", "Su Biblioteca Digital", "Cargue sus artículos", "Defina el tono", "Asegure que cada palabra", "Genere artículos…", "Preserve su voz". Formal usted, breaks the warm Argentine tone.
8. `/ai-studio` pricing footer: "¿Eres instructor de Cognitio? Disfruta de 50 generaciones diarias." → "¿Sos instructor…? Disfrutá de…".
9. `/ai-studio/blog`: "Selecciona documentos para incluir como contexto" → "Seleccioná".
10. `/services`: "Construimos contigo el ed-tech…" → "con vos".

**Visual / layout:**
11. AI Studio topbar shows "GENERACIONES RESTANTES …" truncated; the number is hidden behind the ellipsis on a 1440px viewport.
12. Home "Quiénes somos" section: the three founder photo cards are empty gray placeholders — no avatar images load. Likely missing `avatar_url` on the founder profiles or a fetch path issue.
13. Course detail right-rail copy is generic Udemy-style: "Certificado de finalización" (conflicts with `Certificados` sidebar item marked **Pronto** elsewhere), "Acceso de por vida", "Acceso móvil y TV" (no TV app exists). Reads as boilerplate vs. handcrafted.

**Information architecture:**
14. The legacy `/admin` page (AdminPanel.tsx) renders `AITutorSettingsCard` + `UserManagementCard` + `WaitlistManagementCard` stacked, while the new admin sidebar splits these into `Usuarios y roles` and `AI Tutor` routes. Result: the AI Tutor settings appear in two places (and only the standalone route gets visited via the sidebar).
15. The admin sidebar shows four items pinned as **Pronto** (`Invitaciones`, `Cursos`, `Instituciones`, `Seguridad`). Instructor sidebar shows three more (`Ingresos`, `Estudiantes`, `Perfil público`). AI Studio sidebar shows seven (`LinkedIn`, `X/Twitter`, `Newsletter`, `Revisión de literatura`, `Formateador de papers`, `Editor de papers`). The cumulative effect is "this product is mostly placeholders." For soft launch we should hide most of them or collapse under a single "Próximamente" affordance.

**Data hygiene:**
16. Production DB still contains obvious test rows: courses `Test Final`, `test 1`, `final test`, `Test privado`, plus a `$1.00` course. The admin will need a clean-up pass before any external link is shared.

**Pricing currency:**
17. All prices display as USD (`$35`, `$19/mes`). For Argentina‑first launch we need to decide: keep USD as a strategic anchor (common in AR for digital goods), or localize to ARS. Not a bug, but a launch decision.

---

# Sprint plan — "Polish & Onboard"

This sprint fixes the QA findings above and tackles items #2 (instructor onboarding), #3 (mobile audit), #4 (empty/error states polish) from the previous proposal. Item #5 (launch checklist doc) closes it out.

## 1. Localization & tone pass (fixes findings 1–10)
- Translate `/admin/ai-tutor` (`AITutorSettingsCard`) to Spanish.
- Translate course category labels at the render layer (map DB enum → Spanish label in `lib/courseCategories.ts`, used by `CourseCard`, `CourseOverview`, and dashboard cards). Keep DB values English.
- Replace "X chapters" with `{n} {n === 1 ? "capítulo" : "capítulos"}` in `CourseCard`, `ProgressCard`, dashboard cards.
- `ProgressCard`: "100% complete" → "100% completado".
- `/instructor/analytics`: H1 → "Analíticas"; date formatting via `Intl.DateTimeFormat('es-AR')` so months render as `ene`, `feb`, etc.
- Voseo sweep on instructor dashboard greeting, AI Studio landing copy, AI Studio blog/knowledge form labels, and Services page. Add a project memory line under "Core" pinning Argentine voseo (vos / tenés / contás / sos / cargá / definí / asegurá / generá) as the default tone for all user-facing copy.

## 2. Visual / IA fixes (findings 11–15)
- AI Studio topbar: shrink the "Generaciones restantes" pill, drop the uppercase label, show the number always (e.g. "47 generaciones"). Truncate on overflow only below 320px.
- Founders section: check `useFounderIds` query + `profiles.avatar_url` for Gustavo / Augusto / Liliana. Either upload the founder avatars or render the salmon initial-circle fallback (used in the navbar) instead of an empty gray box.
- Course detail right-rail: rewrite copy to match Cognitio reality — "X capítulos de video", "Acceso permanente como invitado/a", "Foros y tutor IA por capítulo". Remove certificate + TV claims until we ship them.
- Retire the legacy `/admin` aggregated page: make it redirect to `/admin/users` so AI Tutor settings live only at `/admin/ai-tutor`.
- Sidebar `Pronto` hygiene: hide disabled items behind a single "Próximamente" expandable section per sidebar (admin, instructor, AI Studio). Surface only what currently works.

## 3. First-time instructor onboarding (#2)
- 3-step welcome modal shown once after admin grants the `instructor` role (flagged via `profiles.onboarding_completed_at`):
  1. Profile basics (display name, short bio).
  2. "Crea tu primer borrador" — opens `/instructor/create` with empty form.
  3. AI Studio tour — short tooltip walkthrough of Conocimiento → Blog → Borradores.
- Dismissible; reachable later from the existing `/instructor/guide`.

## 4. Mobile audit (#3)
- Snapshot `/instructor`, `/instructor/courses`, `/instructor/analytics`, `/ai-studio`, `/ai-studio/blog` on 375×812.
- Fix obvious breakage: stat cards stacking, analytics charts overflow, AI Studio side-nav opens as Sheet on mobile, blog generator form switches to single column with sticky generate button.

## 5. Empty & error states polish (#4)
- Audit every list view: `/courses` (no results from filter), `/dashboard` (no enrollments), `/instructor/courses` (no courses → CTA), `/ai-studio/drafts` (no drafts), admin Users (no matches), admin Waitlist (empty), discussion threads (no posts yet).
- Each gets a Spanish, voseo-tone empty message with a single primary action and a small illustration or icon (reuse existing `EmptyState` component).
- Add a generic `<ErrorState />` for query failures with a retry button; wire it through TanStack Query error boundaries on the same list views.

## 6. Launch checklist (#5)
- New `LAUNCH.md` at repo root documenting:
  - What's shipped vs. what's `Pronto`.
  - Pricing/payments deferred to Mercado Pago decision.
  - Email infra deferred until paid domain.
  - Admin runbook: how to grant `instructor` role, review waitlist, export CSV, clean up test courses.
  - Known data to purge before public launch (the 4 test courses).

---

## Technical notes
- All copy lives in `src/locales/es.json` already; voseo + plural fixes happen there + in components that hardcode strings (most violations above are hardcoded, not via `t()`).
- Category label map: extend `src/lib/courseCategories.ts` with `label` field consumed by every card.
- Date formatting helper: add `src/lib/dateUtils.ts` exporting `formatShortDate(date) → "07 ene 2026"` via `Intl.DateTimeFormat('es-AR', { day:'2-digit', month:'short', year:'numeric' })`.
- Onboarding: new column `profiles.onboarding_completed_at timestamptz null` + migration with proper `GRANT` block; modal state driven by it.
- Sidebar hygiene: edit `src/config/panelNav.ts` to gate `comingSoon: true` items behind a single grouped section.
- Founder avatars: query already exists in `useFounderIds`; if a profile has no `avatar_url`, render the initial-circle fallback used in `Navbar`.

## Out of scope
- Payments (Stripe vs. Mercado Pago) — deferred to business setup.
- Transactional email — deferred until paid domain.
- ARS pricing — keep USD for now; revisit with payments.
- Test data cleanup — admin task during launch, not engineering.

## Open question (need your call before I start)
**Pricing currency**: keep USD or switch to ARS for the AR market? If ARS, do we also want to localize the format (e.g. `$ 35.000` with thousand separator)?
