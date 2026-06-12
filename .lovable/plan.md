# Phase C — Cont'd: Decomposition, Lockdown, Architecture Cleanup

You asked for three big things at once. Bundling them into one turn is how regressions slip in. I propose three sequential batches, each independently reviewable and revertable. I will do them in order and pause after each so you can sanity-check the preview.

---

## Batch 1 — Centralize categories, hoist `AnimatedTabsTrigger`, move founder IDs to DB

Smallest, safest, highest UX leverage. Lands the architectural papercuts and unblocks future work.

**Centralized categories**
- New `src/lib/courseCategories.ts`: single source of truth — array of `{ slug, dbValue, labelKey }` objects, with helpers `getCategoryLabel(t, slug)` and `mapSlugToDbValue(slug)`.
- Refactor `CoursesPage.tsx`, `CreateCourse.tsx`, `EditCourse.tsx` to import from it. No more hardcoded Spanish array + duplicated mapping object.
- Labels go through `t()` so EN/ES both work; remove hardcoded "Todos / Destacados / Desarrollo…".

**Hoist `AnimatedTabsTrigger`**
- Move the inline forwardRef from `Dashboard.tsx` (lines 22-83) → `src/components/ui/animated-tabs.tsx`.
- Re-export and update `Dashboard.tsx` to import. Future tab UIs reuse it.

**Founder IDs in DB**
- New `platform_settings` row already exists (table is there). Add a `founder_user_ids` JSONB key — array of UUIDs.
- New hook `useFounderIds()` (TanStack Query, cached 10min) reads from `platform_settings`.
- Replace hardcoded references in `Index.tsx`, `InstructorsPage.tsx`, `InstructorCatalogCard.tsx`, `FoundersStorySection.tsx` with the hook.
- Seed migration inserts the current founder UUIDs (Gustavo, Augusto, Liliana) — I'll pull current values from the locale files / code before writing the migration.

---

## Batch 2 — Backend lockdown (SECURITY DEFINER audit, RLS, buckets)

**SECURITY DEFINER audit**
- Review each of the 11 functions. Confirm every one (a) has `SET search_path = public`, (b) does not return data the caller's RLS would otherwise forbid, (c) cannot be abused by a logged-in non-admin.
- `get_instructor_catalog` and `get_public_profile` are intentionally public-facing → keep but verify they only expose non-sensitive columns (they currently expose `email` via `get_public_profile` — that should likely be gated or removed).
- Triggers (`update_*_count`, `handle_new_user`) — verify they cannot be invoked directly with crafted input.

**Two permissive RLS policies**
- I will list the two flagged policies from the linter and tighten them (the survey called them out but didn't name them; I'll run `supabase--linter` first to get the exact policy names and table).

**Bucket exposure**
- `avatars`, `resources`, `course-images` are public. Public listing was flagged enumerable.
- Lock down: switch `resources` to private (signed URLs via existing edge function pattern) since it holds course-paid content. Keep `avatars` and `course-images` public (marketing surface) but document why in `security-memory`.
- Update any client code that read `resources` via public URL to use signed URLs.

---

## Batch 3 — Decompose remaining mega-files

Apply the `InstructorServicesManager` template to:

1. **`AIStudioBlog.tsx` (848 lines)** — highest leverage. Split into `features/ai-studio/blog/`: `BlogDraftList`, `BlogEditorPanel`, `BlogRefinePanel`, `BlogPublishDialog` + hooks `useBlogDrafts`, `useGenerateBlog`, `useRefineBlog`.
2. **`EditCourse.tsx` (731)** — split into `features/courses/edit/`: `CourseDetailsForm`, `CoursePricingForm`, `CourseVisibilityForm`, `CourseDangerZone` + `useCourseEditor` hook.
3. **`CreateCourse.tsx` (510)** — mirror EditCourse pieces (share form components).
4. **`AdminPanel.tsx` (456)** — split into `features/admin/`: `RolesTab`, `InstructorInvitesTab`, `PlatformSettingsTab`.
5. **`ChapterResourceManager.tsx` (533)** — split into `features/chapters/resources/`: `ResourceList`, `ResourceUploadDialog`, `ResourceEditDialog` + `useChapterResources` hook.

No behavior change. Each file becomes a thin orchestrator. Tests stay green.

---

## Order & checkpoints

1. Ship Batch 1 → you preview → green-light.
2. Ship Batch 2 (migration requires your approval anyway) → you preview → green-light.
3. Ship Batch 3 in two passes (AIStudioBlog + EditCourse/CreateCourse first; AdminPanel + ChapterResourceManager second) so PRs stay reviewable.

I'll start with Batch 1 the moment you approve.
