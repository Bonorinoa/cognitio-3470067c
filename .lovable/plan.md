## AI Studio — Audit

Scoped to `/ai-studio` and the routes it owns: Landing (`/ai-studio`), Knowledge Base (`/knowledge`), Settings (`/settings`), Marketing Hub (`/marketing`), Blog tool (`/marketing/blog`), Academic Hub (`/academic`), Coming-soon stubs, and the AI Studio sidebar/layout.

Findings are grouped by theme. Each item is tagged **[Visual]**, **[Copy]**, or **[Feature]** so you can pick threads to pursue. Severity: 🔴 high · 🟡 medium · 🟢 polish.

---

### 1. Shell & navigation

- 🔴 **[Visual]** AI Studio uses its **own sidebar shell** (`AIStudioLayout` + `AIStudioSidebar`) that pre-dates the new `PanelLayout`. It diverges from Instructor/Student/Admin in spacing, header treatment, mobile pattern (separate mobile header bar), section dividers, and "Soon" badge style. The platform now has a unified shell — AI Studio is the odd one out.
- 🟡 **[Visual]** No topbar breadcrumbs. Users in a deep route (e.g. `/marketing/blog`) lose orientation; the other panels now show `Panel → Section`.
- 🟡 **[Feature]** The sidebar's "Recent" history list is hard-coded to the Blog tool. When LinkedIn/Newsletter ship, history will need to be tool-scoped — current design doesn't anticipate it.
- 🟢 **[Visual]** Sidebar still uses `Sparkles` next to the "AI Studio" wordmark; the rest of the product uses warmer, more editorial accents.

### 2. Landing page (`/ai-studio`)

- 🔴 **[Copy]** Mixed language: hero is Spanish ("Add-on de publicación con IA — con tu voz"), but CTAs and section headings drop into English ("Choose Your Bundle", "Try Free - 10 generations/day", "Go to Marketing Tools"). Project core rule is Spanish-first, fully bilingual.
- 🔴 **[Visual]** Hero is generic AI-product centered stack (icon + bold title + subtitle + two CTAs). No editorial typography, no warm coral accent, no anchor to Cognitio's instructor-first story.
- 🟡 **[Copy]** Headline ("Add-on de publicación con IA") leads with a category label, not a benefit. The product positioning per project knowledge is "AI as content/marketing co-pilot for instructors" — the headline should reflect that.
- 🟡 **[Visual]** "How It Works" is three centered, equally-weighted cards — visually predictable. No motion, no instructor voice, no example output.
- 🟡 **[Feature]** Landing CTA "Try Free - 10 generations/day" routes to `/ai-studio/marketing/blog` regardless of whether the user has set up a Style Profile or Knowledge Base, leading to the in-tool setup alert. The flow could route first-timers to Knowledge → Settings → Tool.
- 🟢 **[Visual]** `PricingSection` uses pure shadcn defaults: 4 equal cards, generic check-marks, no editorial hierarchy. The "Pro" highlight is a 2% scale bump — easy to miss.
- 🟢 **[Copy]** "Best Value" / "Current" badges, "Switch Plan" microcopy are all untranslated English literals living next to Spanish hero copy.

### 3. Marketing Bundle Hub (`/ai-studio/marketing`)

- 🟡 **[Copy]** English-first ("Marketing Bundle", "Blog Posts", "Start →"). Should mirror Spanish-first convention.
- 🟢 **[Visual]** Generic 3-column grid of `FeatureCard`s; available vs coming-soon look almost identical (just opacity 60 vs 100). Hard to draw the eye to the one usable feature (Blog).
- 🟢 **[Feature]** No "what's coming next / vote for what we build" hook on the disabled cards — wasted product-roadmap signal.

### 4. Academic Bundle Hub (`/ai-studio/academic`)

- 🟡 **[Visual]** The whole bundle is coming-soon, but the hub still renders four near-identical placeholder cards inside a muted hero — feels empty/unresolved.
- 🟡 **[Feature]** No way for an interested user to register interest or get notified when academic tools launch.

### 5. Knowledge Base (`/ai-studio/knowledge`)

- 🟡 **[Visual]** Page header uses bold-icon-next-to-h1 pattern; mismatched with the new editorial welcome strips in Instructor/Student/Admin panels.
- 🟡 **[Visual]** Context-role badges use raw Tailwind colors (`bg-purple-100`, `bg-blue-100`, `bg-green-100`) — bypasses the semantic token system and breaks the warm coral palette.
- 🟡 **[Copy]** Mixed languages in the same view: title/badges Spanish, but "tokens" label and token-budget hint are English-tinged.
- 🟢 **[Feature]** Document content preview is `doc.content.slice(0, 150) + "..."`. We have a `TruncatedText` primitive (per memory) that should be used.
- 🟢 **[Feature]** No file upload — users must paste content into a textarea. Most instructors will have PDFs/Docx; manual paste is friction. (Per memory, PDF handling exists in AI Studio features — worth verifying this entry point.)
- 🟢 **[Feature]** No search/filter or sort once a user has more than ~10 documents. Activate/deactivate is the only triage tool.

### 6. Settings (`/ai-studio/settings`)

- 🟡 **[Visual]** Same out-of-system header treatment (`icon-in-tinted-box + h1`). No welcome strip.
- 🟡 **[Copy]** "Global Settings", "Billing & Subscription", "Style Settings", "Current Plan:", "Manage Subscription", "Upgrade Plan" — all English. The activation-polling toasts also mix languages.
- 🟢 **[Feature]** "Upgrade Plan" CTA links to `/ai-studio#pricing` which scrolls only if you're already on Landing — from `/settings` it just navigates and may not scroll reliably depending on hash handling.

### 7. Blog Generator (`/ai-studio/marketing/blog`)

This is the workhorse — most impactful surface to refine.

- 🔴 **[Visual]** Two-up grid (Config left, Output right) with three stacked cards on the left. It works at desktop but feels like a settings form, not a creative tool. No sense of "draft → refine → ship" momentum.
- 🔴 **[Copy]** Default copy is English: "Topic & Instructions", "Context Documents", "Generate Content", "Generated Content", "AI Draft", "Save", "Update", "Refine with AI". Spanish fallbacks exist but the source-of-truth strings are English.
- 🟡 **[Visual]** Output panel uses a fixed `h-[500px]` ScrollArea/Textarea — clunky for long drafts; no responsive growth.
- 🟡 **[Feature]** No streaming feedback while generating — just a spinner labelled "Generating...". For 30-60s LLM calls, a shimmer/typing affordance dramatically improves perceived performance.
- 🟡 **[Feature]** History lives only in the sidebar Collapsible, capped at 10. No way to search, rename, or pin generations. No way to compare versions before/after a Refine.
- 🟡 **[Feature]** "Refine with AI" appears on text selection but the dialog is modal-only — no inline diff in-place. (Memory note: refinement diff view exists in AI Studio — worth checking it's actually wired here.)
- 🟢 **[Feature]** No way to seed a generation from an existing course (chapter titles, descriptions). This is the most natural "instructor-first" hook into the AI Studio and it's missing.
- 🟢 **[Feature]** No prompt templates / quick starts ("Turn this lecture into a newsletter", "Write a launch blog for course X"). New users face an empty topic field.

### 8. Coming-soon feature pages (LinkedIn, Twitter, Newsletter, Academic tools)

- 🟢 **[Visual]** Each renders via `ComingSoonFeature` — fine as a holding pattern. Not reviewed in depth since the broader hub redesign will affect them.

### 9. Pricing & subscription UX (cross-cutting)

- 🟡 **[Copy]** Currency hard-coded to `$` USD. Per project audience (LatAm + global academics), worth noting whether ARS/MXN/local pricing is part of the roadmap.
- 🟡 **[Copy]** "Free" tier copy ("10 generations/day", "Basic style settings") undersells what's actually included (Blog generation + full Style Profile + Knowledge Base up to budget).
- 🟢 **[Feature]** Instructor perk ("50 generaciones diarias") is buried in a footnote under the pricing grid — should be a visible badge on the Free tier card for logged-in instructors.

---

## Suggested next moves (no implementation yet)

Roughly in priority order:

1. **Unify AI Studio onto the new `PanelLayout` shell** with a dedicated `aiStudioNav` config — gets breadcrumbs, consistent sidebar, consistent collapse state, and removes the parallel mobile header. *(Visual + Feature)*
2. **Rewrite all AI Studio copy in Spanish-first** with full `en.json` parity, matching the "Servicios / Instructor" tone already set elsewhere. *(Copy, fast win)*
3. **Redesign the Landing** with an editorial welcome strip ("Tu voz, multiplicada"), an instructor-anchored value prop, and a first-time flow that routes through Knowledge → Style → Tool. *(Visual + Copy)*
4. **Redesign the Blog Generator workspace**: streaming feedback, full-height composer, prompt quick-starts seeded from the instructor's own courses, and a richer history panel. *(Feature + Visual, biggest user impact)*
5. **Polish Knowledge Base & Settings** with welcome strips, semantic-token badges, optional file upload audit. *(Visual + Feature)*
6. **Marketing/Academic hubs** — visual differentiation between available vs coming-soon, plus "notify me" capture on disabled tiles. *(Visual + Feature)*

I'd suggest tackling **#1 + #2 together** as one phase (foundation + copy), then **#3 (Landing)** as a design-direction round, then **#4 (Blog tool)** as its own substantial phase. Want me to plan phase 1 in detail, or would you rather pick a different starting thread?
