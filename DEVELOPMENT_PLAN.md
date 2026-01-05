# Cognitio Development Plan

**Current Version:** v4.0  
**Last Updated:** January 5, 2026

---

## Vision

Cognitio is an invite-only, instructor-first academic ecosystem. It prioritizes instructor autonomy and revenue retention over marketplace scale. Core features: course creation (public/private/unlisted), Stripe payments, progress tracking, and AI Content Studio for marketing assistance.

**Tech Stack:** React + Vite + TypeScript + Tailwind + shadcn/ui + Supabase + Stripe + Mux + Lovable AI  
**Roles:** Admin (platform management) → Instructor (content creation + AI tools) → Student (learning)

---

## Version History

### v0.x–v1.x: Foundation & Core Features

Initial MVP through complete instructor platform with payments, analytics, and services.

| Version | Focus | Key Deliverables | Status |
|---------|-------|------------------|--------|
| v1.0 | MVP | Auth, course CRUD, Stripe checkout, Mux video, progress tracking | ✅ |
| v1.1 | Terminology | Frontend refactor: "teacher" → "instructor" | ✅ |
| v1.2 | DB Migration | `instructor_id` column, RLS policy updates, `app_role` enum | ✅ |
| v1.3 | Visibility | `course_visibility` enum (public/private/unlisted), catalog filtering | ✅ |
| v1.4 | Admin Panel | Role management UI, user table with role assignment | ✅ |
| v1.5 | Instructor Profiles | Public profiles, credentials, social links, affiliation | ✅ |
| v1.6 | Course Editing | Edit existing courses, chapter reordering, video replacement | ✅ |
| v1.7 | User Management | Account deletion, password change, profile settings | ✅ |
| v1.8 | Analytics | Instructor dashboard with revenue, enrollments, completion rates | ✅ |
| v1.9 | Services | `instructor_services` table, service cards, public display | ✅ |
| v1.9.1 | Polish | Avatar upload improvements, i18n for dashboard | ✅ |

---

### v2.x: Design System & UI Polish

Complete UI/UX overhaul with warm color palette, glassmorphism, and animations.

| Version | Focus | Key Deliverables | Status |
|---------|-------|------------------|--------|
| v2.0 | Design Tokens | HSL color system, CSS variables, Tailwind config | ✅ |
| v2.1 | Typography | Font hierarchy, heading styles, body text optimization | ✅ |
| v2.2 | Component Library | Button variants, card styles, form inputs | ✅ |
| v2.3 | Dark Mode | Theme toggle, dark palette, contrast validation | ✅ |
| v2.4 | Warm Theme | Coral/salmon accent, cream backgrounds, soft shadows | ✅ |
| v2.5 | Glassmorphism | Navbar blur, card transparency, modal overlays | ✅ |
| v2.6 | Hero Section | Animated blob background, gradient overlays | ✅ |
| v2.7 | Framer Motion | Page transitions, card hover effects, scroll animations | ✅ |
| v2.8 | Card System | Standardized hover states, consistent spacing | ✅ |
| v2.9.0 | Responsive | Mobile navigation, hamburger menu, touch targets | ✅ |
| v2.9.1 | Bug Fixes | Sidebar alignment, animation performance, scroll behavior | ✅ |
| v2.9.2 | Membership | `CourseMembershipManager`, dashboard course fetching fix | ✅ |
| v2.9.3 | Cleanup | Deprecated code removal, documentation consolidation | ✅ |
| v2.9.4 | Testing | i18n test fixes, ESLint prefer-const fixes | ✅ |

---

### v3.x: AI Content Studio

AI-powered content generation to help instructors create marketing materials from their expertise.

| Version | Focus | Key Deliverables | Status |
|---------|-------|------------------|--------|
| v3.0 | Foundation | Database schema (`instructor_knowledge_base`, `instructor_style_profile`, `ai_generation_history`), enums, types | ✅ |
| v3.1 | Knowledge Base | Document CRUD, `useKnowledgeBase` hook, document types and context roles | ✅ |
| v3.2 | Style Profiles | `StyleProfileForm` component, `useStyleProfile` hook, tone/length/audience preferences | ✅ |
| v3.3 | Blog Generator | `generate-content` edge function, `useContentGeneration` hook, streaming markdown UI | ✅ |
| v3.4 | Usage Tracking | `useGenerationUsage` hook, daily limits (10/day), sidebar counter | ✅ |
| v3.5 | Mobile & Polish | Tab bar navigation, progress bar visualization, layout refinements | ✅ |
| v3.6 | Rich Editor | Preview/Edit toggle, markdown rendering with ReactMarkdown | ✅ |
| v3.7 | Refinement | `refine-content` edge function, inline text selection, diff view for changes | ✅ |
| v3.8 | History | Save/Update/Delete generations, FIFO 10-item limit, load from history | ✅ |
| v3.9 | Dashboard & Usage Fix | AI Studio Dashboard landing page, `is_active` soft-delete for accurate usage tracking | ✅ |
| v3.9.1 | Stabilization Sprint | Toast unification (Sonner), TypeScript `getErrorMessage`, dead code cleanup | ✅ |
| v4.0 | AI Studio Commercialization | Public landing, bundle-based architecture, simplified settings, dynamic tier limits | ✅ |

**✅ v4.0 COMPLETO - AI Studio Commercialization Complete**

---

## ✅ Completado

### AI Studio Commercialization (v4.0) - Enero 2026

#### Phase 1: Database Schema ✅
- Renamed instructor_* tables to user_*
- Created ai_bundle and subscription_status enums
- Created ai_subscriptions and ai_tier_limits tables
- Updated RLS policies for any authenticated user

#### Phase 2: Backend Updates ✅
- Updated generate-content with dynamic tier limits
- Updated refine-content with dynamic tier limits
- Created get-user-tier edge function

#### Phase 3: Public Navigation ✅
- Added AI Studio to main navbar
- Removed RequireInstructor wrapper from routes
- Implemented auth guards at feature level
- Updated sidebar with "Back to Home"

#### Phase 4: Landing & Bundles ✅
- Created public landing page with bundles showcase
- Implemented bundle-based routing (/ai-studio/marketing/*, /ai-studio/academic/*)
- Created Marketing and Academic bundle hub pages
- Added coming soon placeholder pages
- Simplified style settings (removed content length and preferences)
- Removed redundant AI Writing Style card from Knowledge Base
- Streamlined landing page (merged Knowledge section into How It Works)

---

## Current: v4.0 AI Studio Commercialization ✅ COMPLETO

### v4.0 Completed ✅

#### Public Landing & Bundles
- **Public Landing Page**: Hero section, bundles showcase, how it works, pricing teaser
- **Bundle-Based Architecture**: Marketing and Academic bundles with separate routes
- **Marketing Bundle Hub**: Blog, LinkedIn, Twitter, Newsletter (coming soon features)
- **Academic Bundle Hub**: Literature Review, Paper Formatter, Paper Editor, Citation Generator (all coming soon)
- **Coming Soon Pages**: Placeholder pages for unreleased features

#### Simplified Settings
- **Style Settings**: Streamlined to tone, audience, language, custom instructions
- **Removed Complexity**: Eliminated content length and preferences options
- **Global Configuration**: Single settings page for all AI content types

#### Dynamic Tier System
- **Free Tier**: 10 generations/day for any authenticated user
- **Instructor Tier**: 50 generations/day for Cognitio instructors
- **Future Tiers**: Database ready for subscription-based tiers

#### Previous Versions (v3.9.1)

### v3.9.1 Completed ✅

#### Code Quality
- **Toast Unification**: Migrated from dual toast system to Sonner only
- **TypeScript Improvements**: Added `getErrorMessage` utility for type-safe error handling
- **Dead Code Removal**: Eliminated deprecated `isTeacher` pattern and unused handlers

#### Documentation Consolidation
- **Deleted Outdated Files**: E2E_EVALUATION_SUMMARY, GO_NO_GO_RECOMMENDATION, RELEASE_CHECKLIST, SECURITY_AUDIT, E2E_TEST_PLAN, EXECUTIVE_SUMMARY, REVIEW_SUMMARY
- **Updated README**: Reflects v3.9.1 stabilization changes
- **Streamlined Docs Table**: Only essential documents retained

### v3.9.0 Infrastructure (Previous)

1. **`is_active` Column**: Soft-delete for `ai_generation_history`
2. **Dashboard Route**: `/ai-studio` with quick actions and stats
3. **Usage Tracking**: Counts ALL generations today (ignores `is_active`)

---

## Roadmap: v4.1+ Next Steps

### 🔜 Próximo

#### Phase 5: Stripe Integration (v4.5)
- [ ] Create Stripe products (Marketing, Academic, Pro bundles)
- [ ] Implement checkout flow
- [ ] Create webhook for subscription events
- [ ] Subscription management UI
- [ ] Complete pricing page

#### Phase 6: Marketing Bundle Features (v4.1-v4.3)
- [ ] LinkedIn Post Generator (v4.1)
- [ ] X/Twitter Generator with threads support (v4.2)
- [ ] Newsletter Generator (v4.3)

#### Phase 7: Academic Bundle (v5.0+)
- [ ] Literature Review Generator
- [ ] Paper Formatter (journal styles)
- [ ] Paper Editor
- [ ] Citation Generator

### v3.10: Bundle Optimization ✅ Complete

| Task | Status | Details |
|------|--------|---------|
| Route Code Splitting | ✅ Done | All pages already lazy-loaded in App.tsx |
| Layout Lazy Loading | ✅ Done | `InstructorLayout`, `AIStudioLayout` now lazy-loaded |
| Heavy Component Lazy Loading | ✅ Done | `VideoPlayer` (Mux), `VideoUpload`, `FoundersStorySection` (Framer) |
| Suspense Fallbacks | ✅ Done | Custom loading states for each lazy component |

### Next Priorities

| Focus | Planned Deliverables | Priority |
|-------|---------------------|----------|
| Test Coverage | Increase unit test coverage for hooks and components | 🟡 Medium |
| Performance Audit | Lighthouse analysis, Core Web Vitals optimization | 🟡 Medium |

---

## Future Roadmap

### v5.0+: Advanced Features (Future)

| Focus | Planned Features |
|-------|-----------------|
| Analytics | Advanced student analytics, cohort tracking, completion funnels |
| AI Studio | Multi-language generation, course outline generator, advanced academic tools |
| Platform | Webhooks for integrations, public API, advanced reporting |
| Enrollment | Invite links for private courses, bulk CSV enrollment |
| Notifications | Email notifications for enrollments, completions, new content |

**Next Steps:**
- ✅ v4.0 AI Studio Commercialization complete - platform is production-ready with public AI features
- 🔜 v4.1+ Marketing bundle feature rollout (LinkedIn, Twitter, Newsletter)
- 📋 v4.5 Stripe subscription integration for monetization
- 📋 v5.0+ Academic bundle features for researchers

---

## Non-Goals

These features are explicitly out of scope:

- Complex LMS features (assignments, quizzes, gradebooks, SCORM)
- Enterprise features (SAML SSO, HR integrations, org hierarchies)
- AI-based grading or automated student evaluation
- Heavy discussion forums or moderation systems
- Subscription pricing or course bundles
- Open instructor signups (invite-only by design)
- RAG/vector search for AI (using context window stuffing instead)

---

## AI Studio Architecture

### Context Window Strategy
Instead of RAG (Retrieval Augmented Generation), we use "Context Window Stuffing":
- Gemini 2.5 Flash supports 1M+ tokens
- All selected documents fit in single context
- Simpler architecture, no vector database needed
- Documents tagged with `context_role` for strategic prompt placement

### Document Roles
| Role | Purpose |
|------|---------|
| `style_reference` | Writing samples to inform voice/tone |
| `topic_source` | Main subject matter for generation |
| `background_context` | Expertise and credentials |

### Usage Tracking Strategy
- `is_active` column enables soft-delete for history management
- FIFO: When 10 active items exist, oldest is soft-deleted
- Daily usage: Counts ALL generations today (ignores `is_active`)
- This ensures accurate quota tracking independent of history limits

### Usage Limits
- 10 generations per day per instructor
- 10 documents max per generation
- 100K token context budget
- 10 active history items (FIFO soft-delete)

---

## References

- **Detailed Changes:** See [CHANGELOG.md](./CHANGELOG.md)
- **Feature Documentation:** See [FEATURES.md](./FEATURES.md)
- **Test Coverage:** See [TEST_COVERAGE_SUMMARY.md](./TEST_COVERAGE_SUMMARY.md)
- **Tech Details:** See [TECHNOLOGY_STACK.md](./TECHNOLOGY_STACK.md)
