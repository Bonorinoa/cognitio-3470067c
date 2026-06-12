# Sprint: AI Studio — Product Surface Polish & Drafts

A focused sprint that levels up the *working* product surfaces (Marketing hub + Blog Generator), introduces the missing Drafts library, captures demand for the Academic bundle, and finishes the visual consistency pass started on the landing / Conocimiento / Ajustes pages.

Throughout the sprint, two cross-cutting concerns guide every decision:
- **Consistency** — every page uses the editorial system (serif italic accents, hairline borders, coral eyebrows, `rounded-sm`, light weights, no colored icon chips).
- **Data management** — generation history becomes a first-class entity with proper retention rules, not a hidden 10-item rolling list.

---

## Phase 1 — Marketing Bundle Hub redesign

**Goal:** Replace the boilerplate "icon chip + 4 cards" hub with an editorial workshop entry point.

- Replace the `Megaphone`-in-a-chip header with the editorial header pattern: coral eyebrow (`DIVULGACIÓN`), light serif-accented title ("Su voz, *multiplicada.*"), short value-prop paragraph.
- Convert the 4 `FeatureCard`s into a single hairline-bordered grid:
  - **Blog** — live, primary CTA, coral arrow.
  - **LinkedIn / X / Newsletter** — muted, `Clock` icon, single-line "Próximamente · Avisame" link that feeds the same waitlist (Phase 4).
- Add a slim "Continuar trabajando" strip above the grid showing the last 1–2 drafts for the bundle (sourced from the Drafts hook). Empty state collapses gracefully.
- Show the generations-remaining indicator inline so users feel the budget before clicking into a tool.

## Phase 2 — Blog Generator polish

**Goal:** Bring the only working tool fully into the editorial system and fix a few UX rough edges.

- Editorial header (kicker `BLOG · DIVULGACIÓN`, serif-accented title, hairline divider). Drop the `FileEdit` chip.
- Restyle the "generations remaining" pill to match the hairline aesthetic (no rounded-full coral pill).
- Restyle the setup-required Alert as a hairline coral strip, not a tinted card.
- Tighten the two-panel layout: hairline borders on `BlogConfigPanel` and `BlogOutputPanel`, light section labels, coral-on-hover for active doc rows.
- Replace the in-page Collapsible "Generaciones recientes" with a single discreet link: *"Ver todos los borradores →"* pointing to the new Drafts page (Phase 3). This collapses duplication and unifies the entry point.
- Improve the "Style Profile not configured" CTA to deep-link to `/ai-studio/settings` (currently sends to `/ai-studio` landing).

## Phase 3 — Drafts library (new surface)

**Goal:** Promote `ai_generation_history` to a real workspace section, replacing the hidden 10-item rolling cap.

**Data changes (single migration):**
- The table and RLS policies already exist. Two additions:
  1. Add a `pinned boolean default false` column. Pinned items are exempt from the auto-archive cap.
  2. Add an index on `(user_id, content_type, is_active, created_at DESC)` to support filtered listings.
- *(No new tables.)*

**Code changes:**
- Add route `/ai-studio/drafts` (page `AIStudioDrafts.tsx`).
- Promote `useGenerationHistory` to a shared hook with:
  - `useDrafts({ contentType?, includeArchived?, search? })` — paginated query.
  - `pinDraft / unpinDraft` mutations.
  - `restoreDraft` (sets `is_active = true`).
  - Raise the soft-archive cap from 10 → 25, and skip pinned rows when archiving.
- Drafts page UI (editorial): coral eyebrow `BORRADORES`, hairline-segmented filter row (`Todos · Blog · LinkedIn (próx.)`), search input, list rows showing topic, content-type tag, relative time, pin / open / duplicate / delete actions.
- Add Drafts to `aiStudioNav` under the **Studio** section, between Conocimiento and Ajustes.
- The Blog Generator's `?load=<id>` deep-link continues to work and becomes the canonical "open" action from the Drafts page.

## Phase 4 — Academic waitlist

**Goal:** Turn the dead "Lista de Espera" label into actual demand capture.

**Data changes (single migration):**
- New table `public.ai_bundle_waitlist`:
  - `bundle text not null` (`'academic'` for now; future-proofs other bundles),
  - `email text not null`,
  - `user_id uuid` (nullable for logged-out signups),
  - `notes text` (optional free-text "what would you use it for?"),
  - `created_at timestamptz default now()`,
  - unique `(bundle, lower(email))`.
- Required GRANTs (`anon` + `authenticated` INSERT, `service_role` ALL, admin SELECT via `has_role`).
- RLS: anyone can insert (rate-limited at the edge function if needed later); only admins can read.

**Code changes:**
- Tiny inline form on the AI Studio landing's Academic card + on the Marketing hub's coming-soon items: email field → success toast → row stored.
- Pre-fill email when logged in. Auth not required.

## Phase 5 — Panel chrome consistency pass

**Goal:** Make the AI Studio sidebar/topbar visually agree with the restyled pages.

- `PanelSidebar` (only when the active nav is `aiStudioNav`):
  - Swap the rounded coral "C" logo block for the editorial wordmark variant used elsewhere on the AI Studio surface.
  - Replace `bg-sidebar` tint with the off-white surface.
  - Use light font weight for the role label.
  - Section labels stay uppercase tracked, but coral instead of muted.
- `PanelTopbar`: remove the heavy `backdrop-blur`, use hairline border + neutral background to match Conocimiento / Ajustes headers.
- Add the new **Borradores** nav entry (Phase 3).
- Add a "Generaciones restantes" inline indicator in the topbar's `actions` slot for any AI Studio route, so users see budget across every tool, not just Blog.

Scope guard: changes only apply when `nav.layoutId === "ai-studio-panel-indicator"`. Instructor / Student / Admin panels stay untouched in this sprint.

## Phase 6 — Translation + verification sweep

- Add all new keys to `es.json` and `en.json` with full parity (hub eyebrows, drafts strings, waitlist copy, empty states).
- Manual smoke pass on each touched route (landing → hub → blog → drafts → settings → knowledge) at 1280px and 768px to confirm visual consistency.
- Verify the soft-archive logic with a quick local script: insert 26 rows for a user, confirm one is archived and pinned rows are never touched.

---

## Out of scope (explicitly deferred)

- Implementing LinkedIn / X / Newsletter generators (waitlist captures demand first).
- Onboarding tour ("Primeros pasos" 3-step path) — better tackled once Drafts exists, so the tour can end on a real saved draft.
- Académico tool implementation.
- Stripe price/tier changes.

## Technical notes

- **Migrations:** two total — `add_pinned_to_ai_generation_history` and `create_ai_bundle_waitlist`. Both follow the four-step grant pattern.
- **Hook surface:** `useGenerationHistory` is renamed to `useDrafts` with a back-compat re-export to avoid touching every caller in one PR.
- **No new dependencies.**
- **Routing:** one new route (`/ai-studio/drafts`); the existing `?load=<id>` query param contract is preserved.
- **Edge functions:** none added. Waitlist insert goes through PostgREST with RLS.

```text
AI Studio surface after sprint
──────────────────────────────
/ai-studio                  landing (editorial, slim pricing)        ✓ done
/ai-studio/knowledge        Conocimiento (editorial)                 ✓ done
/ai-studio/settings         Ajustes + billing (editorial)            ✓ done
/ai-studio/drafts           Borradores (NEW)                         Phase 3
/ai-studio/marketing        Hub (redesigned)                         Phase 1
/ai-studio/marketing/blog   Blog Generator (polished)                Phase 2
```
