
## Goal

Bring the three logged-in panels — **Mi Aprendizaje**, **Panel de Instructor**, **Panel de Admin** — under a single, cohesive shell that matches the warm/editorial direction of the new public site, while rethinking what each panel surfaces. Start with the Instructor panel (biggest surface, highest priority).

## What exists today

- `InstructorLayout` + `InstructorSidebar` already provide a collapsible sidebar with sub-routes (`/instructor`, `/courses`, `/create`, `/analytics`, `/guide`, `/settings`) and a link to AI Studio.
- `Dashboard.tsx` (student) and `AdminPanel.tsx` are flat pages that just render the public `<Navbar />` on top — no shell, no sidebar.
- A reusable `src/components/sidebar/` primitive set already exists (`SidebarHeader`, `SidebarNavItem`, `SidebarUserDropdown`, `SidebarCollapseButton`) — we'll build on these.
- `AdminPanel` is tiny (28 lines, 2 cards). It needs IA work, not just paint.

## Phase 1 — Unified Panel shell (foundation)

Build one `PanelLayout` shell used by all three panels, role-aware.

```text
┌─────────────────────────────────────────────────────────┐
│ Sidebar (role-aware)        │ Topbar: breadcrumbs · ⌘K  │
│  • Logo / "Volver al sitio" │───────────────────────────│
│  • Section 1 (Visión)       │                           │
│  • Section 2 (Trabajo)      │  Page content (Outlet)    │
│  • Section 3 (Crecimiento)  │                           │
│  • ─────────                │                           │
│  • AI Studio / Help         │                           │
│  • User dropdown            │                           │
└─────────────────────────────────────────────────────────┘
```

Concretely:

- New `src/components/panel/PanelLayout.tsx` — sidebar + sticky topbar + `<Outlet />`.
- New `src/components/panel/PanelSidebar.tsx` — generalizes `InstructorSidebar` to accept a `sections` config (grouped nav with labels like *Visión*, *Trabajo*, *Crecimiento*) and a role badge under the logo.
- New `src/components/panel/PanelTopbar.tsx` — breadcrumbs derived from the route, a quick-action slot per page, and the user avatar dropdown (replaces the public Navbar inside panels).
- Wire role config in one file: `src/config/panelNav.ts` exports `studentNav`, `instructorNav`, `adminNav`.
- Keep the public `<Navbar />` for unauthenticated and marketing routes only; panels stop rendering it.

## Phase 2 — Instructor panel redesign (first delivery)

### Information architecture

Regroup the existing six items into three labelled sections so the sidebar reads like a mental model, not a flat list:

- **Mi trabajo** — Resumen (dashboard), Cursos, Crear curso
- **Crecimiento** — Analíticas, Ingresos *(new — split from Analytics)*, Estudiantes *(new — directory of enrolled students across courses)*
- **Mi presencia** — Perfil público, Guía, Ajustes

AI Studio stays as a pinned shortcut at the bottom of the sidebar.

### Dashboard (`/instructor`) redesign

Replace the current "stats row + courses table + recent enrollments" with an editorial layout:

1. **Welcome strip** — greeting, today's date, primary CTA (Crear curso) and secondary (Abrir AI Studio).
2. **Pulse row** — four KPI tiles (Estudiantes, Ingresos del mes, Cursos publicados, Borradores) with delta vs. last month and a sparkline.
3. **Two-column working area**
   - Left (2/3): "Tus cursos" — card list (not table) showing thumbnail, status pill, students, last edit, quick actions. Sort by recently updated. Empty state keeps the existing onboarding card.
   - Right (1/3): stacked panels — *Actividad reciente* (recent enrollments + last published chapter), *Próximos pasos* (contextual suggestions: complete profile, publish a draft, record first chapter), *AI Studio* teaser card.
4. **Onboarding card** (`InstructorGettingStartedCard`) moves into the right column and auto-hides once all four steps are done.

### Visual language

Adopt the warm/editorial direction from the public site inside the panel:
- Warm off-white surface (`--background`), card surfaces in soft cream, coral primary reserved for CTAs and the active sidebar pill.
- Generous spacing, single-weight section headers in the display font, lighter body.
- Soft shadows + 1px hairline borders, no heavy chrome.
- All values via design tokens — no hardcoded colors.

We'll generate three rendered design directions for the dashboard hero+pulse area before implementing, so you pick the exact composition.

## Phase 3 — Student & Admin (follow-ups, separate turns)

- **Mi Aprendizaje** moves into `PanelLayout` with a slimmer sidebar (Resumen, Mis cursos, Certificados *(coming soon)*, Ajustes). Dashboard body keeps current data but adopts the new editorial tile/card language and gets a "Continuar donde dejaste" hero card.
- **Panel de Admin** moves into `PanelLayout` with sections: *Personas* (usuarios, roles, invitaciones), *Contenido* (cursos, reportes), *Plataforma* (AI tutor settings, flags). Existing `AITutorSettingsCard` + `UserManagementCard` become the first two pages instead of stacking on a single screen.

## Out of scope for this plan

- Pricing/billing UI inside panels.
- New backend tables or RLS changes — IA work uses existing data only.
- AI Studio internal redesign (separate effort).
- The marketing-side cleanup of orphan pages (`PlatformPage`, `InstitutionsPage`).

## Suggested order of implementation

1. Build `PanelLayout` + `PanelSidebar` + `PanelTopbar` primitives (no behavior change yet — Instructor still works).
2. Migrate `/instructor` routes to the new shell, regroup sidebar into three sections, add the two new sub-routes as Coming Soon stubs.
3. Generate 3 design directions for the new Instructor dashboard, you pick one, we implement.
4. (Next turn) Migrate Student dashboard into the shell.
5. (Next turn) Split Admin panel into sections inside the shell.
