
# AI Infrastructure Hardening Sprint

Goal: make the AI layer secure, efficient, observable, and properly documented before we design any new AI features. No new user-facing features — only foundation work.

## Scope at a glance

| Area | Status today | After sprint |
|---|---|---|
| Default model | `gemini-2.5-flash` hardcoded in 2 of 3 functions | `gemini-3-flash-preview` everywhere, admin-configurable |
| Transcript context | Full transcript injected every turn | Chunked window around student timestamp + "expand" |
| Per-minute rate limit | Schema-only, not enforced | Enforced per user, per function |
| Token metering | Only call count | Tokens in/out persisted per call |
| Prompt injection | Untreated | Sandboxed user content with delimiters + system guard |
| Dashboards | None for AI usage | Admin AI overview, instructor "AI in my courses", student "your AI use" |
| Documentation | None | `docs/ai.md` + in-app explainers |
| Marketing bundle | Live but waitlisted | Removed from UI; data preserved |

---

## Day 1 — Database & metering foundation

**Migration 1: extend `ai_usage_logs`**
- Add `prompt_tokens int`, `completion_tokens int`, `total_tokens int`, `latency_ms int`, `function_name text`, `course_id uuid null`, `chapter_id uuid null`.
- Backfill `function_name` from `content_type` where possible.
- Index on `(user_id, created_at desc)` and `(function_name, created_at desc)`.

**Migration 2: per-minute rate limiting**
- New table `ai_rate_limit_events(user_id, function_name, created_at)` with TTL-style cleanup (delete > 1h).
- Or simpler: reuse `ai_usage_logs` with the new `function_name` column and count last 60s. Pick reuse to avoid a second write path.
- Read `ai_tier_limits.requests_per_minute` (already exists) inside each edge function.

**Migration 3: platform settings keys**
- Add `ai_default_model`, `ai_default_temperature`, `ai_default_max_tokens` rows so all functions read from one place (tutor settings already exist; generalize the pattern).

## Day 2 — Edge function refactor

Create `supabase/functions/_shared/ai.ts` with:
- `getUserTier(supabase, userId)` — single cached lookup.
- `checkRateLimits(supabase, userId, functionName, tier)` — daily + per-minute, returns 429 with `{ retry_after, used, limit }`.
- `logUsage(supabase, { userId, functionName, model, promptTokens, completionTokens, latencyMs, courseId?, chapterId? })`.
- `wrapUserContent(text)` — wraps untrusted text in `<<<USER_CONTENT>>> … <<<END_USER_CONTENT>>>` and prepends a system guard line.
- `DEFAULT_MODEL = "google/gemini-3-flash-preview"`.

Apply to all three functions:
- `ai-discussion-reply`
- `generate-content`
- `refine-content`

Switch the default model to `google/gemini-3-flash-preview`. Re-validate request bodies for the new model (drop unsupported params, confirm streaming SSE still works for `generate-content`).

## Day 3 — Smart transcript chunking (the moat work)

In `ai-discussion-reply`:
- If `transcript_json` has ≤ ~2500 tokens, send full (current behavior).
- Otherwise, send a **window of ±2 minutes** around `video_timestamp_seconds`, plus a 200-word "outline" of the whole lecture (auto-extracted: first sentence of every 5-minute block).
- Add to the system prompt: "If the student references something outside the included window, ask which timestamp they mean."
- Always have the model **cite timestamps** in its replies (e.g., `[12:30]`) so the UI can render them as clickable jumps. We already have the seek wiring in `ThreadView`.

This is the single biggest token-cost reduction and the only change here that also improves answer quality.

## Day 4 — Dashboards

**Admin (`/admin/ai`)** — new page (extends existing `AdminAITutor`):
- Today's calls, tokens, estimated cost.
- Top 10 users by tokens (last 7d).
- Per-function breakdown (tutor / generate / refine).
- Recent rate-limit hits.

**Instructor (`/instructor/ai-insights`)** — new page:
- "AI tutor activity in your courses" — count of tutor sessions per chapter, top questions (titles only, never private content of other instructors).
- "What students seem confused about" — chapters with highest tutor usage flagged.
- Read-only; no settings.

**Student (`/ai-studio`)** — extend the existing `UsageIndicator`:
- Click → small popover showing today's calls, tokens used, per-feature breakdown, reset time, tier limits.
- Same popover surfaces the per-minute limit clearly.

## Day 5 — Documentation & cleanup

**`docs/ai.md`** — one page covering:
- What each feature does.
- What data each feature sees (transcript, KB, style profile, course metadata).
- Which model is used, where the system prompt lives, who can change it.
- Limits per tier (daily + per-minute).
- Privacy: nothing leaves Lovable AI Gateway; no training on user data.

**In-app:**
- Expand `AITutorOnboardingCard` with a short "what the tutor sees" section.
- Instructor settings page: add a "AI in your courses" info block (links to the doc).

**Marketing bundle de-prioritization:**
- Remove `MarketingBundleHub` from navigation, AI Studio landing, and pricing.
- Keep the route + waitlist table for now (data preserved) but mark as `archived` in `ai_bundle_waitlist`.
- Leave `AcademicBundleHub` untouched — we'll revisit when discussing new features.

## Out of scope (explicit)

- No new AI features.
- No changes to Mux transcription pipeline.
- No Stripe/billing changes (token metering is for forecasting only this sprint).
- No email infra (still deferred per project memory).

## Technical details

- All edge functions keep `verify_jwt = true` where already set; no config.toml changes needed.
- New `_shared/ai.ts` is imported via relative path from each function (Deno-friendly).
- Rate limit enforcement: count `ai_usage_logs` rows where `user_id = ? AND function_name = ? AND created_at > now() - interval '1 minute'`. Cheap with the new index.
- Token counts come from the AI Gateway response `usage` field (OpenAI-compatible).
- Prompt-injection guard is defense-in-depth, not a silver bullet — combined with the fact that output is never auto-executed, this closes the realistic risk.
- Dashboards use TanStack Query + Supabase reads; no new edge functions needed for read-only stats.

## Deliverables checklist

- [ ] 3 migrations (usage logs columns, settings keys, indexes)
- [ ] `_shared/ai.ts` helper
- [ ] 3 edge functions refactored + model bumped
- [ ] Chunked transcript logic in tutor
- [ ] Admin AI overview page
- [ ] Instructor AI insights page
- [ ] Student usage popover
- [ ] `docs/ai.md`
- [ ] Marketing bundle removed from nav
- [ ] Tests updated (existing tutor test + new rate-limit test)

## Open question before I start

One decision worth confirming:

**Per-minute rate limits — values?** Schema has 3–20 rpm by tier. Suggest: free=3, instructor=10, pro=20. OK, or adjust?
