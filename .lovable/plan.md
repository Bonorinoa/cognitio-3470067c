# One-Day Sprint — Five Tracks

Sequenced so backend approvals (migration, email infra) kick off first and unblock everything else while I work on UI in parallel.

---

## Track 1 · Course visibility `unlisted` (backend first — needs approval)

- Migration: extend `courses.visibility` check to allow `'unlisted'` alongside `'public' | 'private'`.
- `CoursesPage` catalog query: filter `visibility = 'public'`.
- `CoursePage`: allow render for `unlisted` via direct URL (still gated on purchase for paid).
- Edit + Create course UI: 3-way radio with helper copy.
- Update `mem://features/course-platform` visibility rule.
- Test: one unit test for catalog filter.

## Track 2 · Waitlist → real funnel

Two halves; the email half depends on infra status.

**Admin export (always ships today):**
- New `/admin` "Waitlist" tab: table (bundle, email, signed_up_at, user_id, notes) + CSV download.
- Sort by date desc, search by email.

**Confirmation email (ships today if domain configured, else CSV-only with a TODO):**
- `email_domain--check_email_domain_status` first.
- If ready: `setup_email_infra` (if not already) → `scaffold_transactional_email` → add `waitlist-confirmation` template → call from `WaitlistForm` after successful insert with `idempotencyKey: waitlist-${bundle}-${email}`.
- If not ready: surface the setup dialog at the end; ship CSV export now.

## Track 3 · AI Studio Drafts — complete the flow

`useDrafts` already has the hooks. Wire UI in `AIStudioDrafts.tsx`:
- Rename (inline edit on topic) — new `renameDraft(id, topic)` in `useDrafts`.
- Duplicate — new `duplicateDraft(id)` (insert copy, topic suffixed " (copia)").
- Delete with `AlertDialog` confirm.
- Search input → `useDrafts({ search })` debounced 250ms.
- Filter chips: Todos / Blog / Newsletter / Anclados / Archivados.
- Load-more pagination at `DRAFTS_CAP` (25).
- Empty / loading / error states.
- Tests: handlers + filter logic.

## Track 4 · Mux upload UX

In `VideoUpload.tsx`:
- Explicit state machine: `idle | uploading | processing | ready | failed`.
- Progress % during upload (Mux uploader already emits).
- After upload success, poll `chapters.mux_playback_id` every 5s, max 3 min, then mark `ready` or surface "still processing".
- Retry button on `failed`: re-request upload URL, reset state.
- Inline help copy ("~1-2 min for a 10-min video").
- Tests: state transitions.

## Track 5 · i18n hygiene (the tedious one)

Sweep hardcoded Spanish into `t()` across:
- `InstructorDashboard`, `Dashboard`, `AdminPanel`, `AdminUsers`, `AdminAITutor`
- `InstructorCourses`, `InstructorAnalytics`, `InstructorSettings`, `InstructorProfile`, `InstructorGuide`
- `AIStudioDrafts`, `AIStudioKnowledge`, `AIStudioSettings`

Add keys to `es.json` + `en.json` in parallel. After the sweep: `rg` for remaining Spanish literals in `src/pages` and `src/components` (excluding `ui/`) and patch stragglers.

---

## Execution order

1. **Submit migration** (Track 1) — approval runs in background.
2. **Check email domain status** (Track 2) — decides waitlist scope.
3. While both pend: **Track 5 i18n sweep** + **Track 3 Drafts UI** + **Track 4 Mux UX** in batched edits.
4. Once migration approved + types regenerated: finish Track 1 UI.
5. Once email infra confirmed: finish Track 2 email half (or defer with note).
6. Run full vitest + smoke E2E. Target: 147+ passing, zero new failures.

## Risks / honest caveats

- **Email infra**: if no domain is configured, the confirmation email slips to a follow-up — CSV export still ships.
- **i18n sweep volume**: largest diff of the day. If a page is bigger than expected I'll prioritize Dashboards + Admin and defer AI Studio i18n to a fast follow-up.
- **Migration approval latency**: gates Track 1 UI but nothing else.

## Out of scope today

E2E expansion beyond current smoke, Lighthouse/SEO/a11y audits, error boundary rollout, branded 404/500, analytics install. Those were the "launch hardening" items — separate conversation when you're ready to schedule launch.
