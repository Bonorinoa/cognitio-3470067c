# Cognitio Development Plan

**Current Version:** v4.0.1  
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
| v3.0 | Foundation | Database schema, enums, types | ✅ |
| v3.1 | Knowledge Base | Document CRUD, `useKnowledgeBase` hook | ✅ |
| v3.2 | Style Profiles | `StyleProfileForm`, tone/length/audience preferences | ✅ |
| v3.3 | Blog Generator | `generate-content` edge function, streaming markdown UI | ✅ |
| v3.4 | Usage Tracking | `useGenerationUsage` hook, daily limits, sidebar counter | ✅ |
| v3.5 | Mobile & Polish | Tab bar navigation, progress bar visualization | ✅ |
| v3.6 | Rich Editor | Preview/Edit toggle, markdown rendering | ✅ |
| v3.7 | Refinement | `refine-content` edge function, inline text selection, diff view | ✅ |
| v3.8 | History | Save/Update/Delete generations, FIFO 10-item limit | ✅ |
| v3.9 | Dashboard | AI Studio Dashboard landing page, `is_active` soft-delete | ✅ |
| v3.9.1 | Stabilization | Toast unification (Sonner), TypeScript improvements | ✅ |

---

### v4.x: AI Studio Commercialization

Public-facing AI content platform with subscription monetization.

| Version | Focus | Key Deliverables | Status |
|---------|-------|------------------|--------|
| v4.0 | Commercialization | Public landing, bundles, Stripe subscriptions, tier limits | ✅ |
| v4.0.1 | Cleanup | Tier alignment, notification removal, doc consolidation | ✅ |

---

## ✅ Completado

### v4.0.1 - January 5, 2026

- Updated PricingSection to match DB limits (200/200/500)
- Removed all notification features (deferred)
- Consolidated documentation (deleted FEATURES.md, TECHNOLOGY_STACK.md, TEST_COVERAGE_SUMMARY.md)

### v4.0 - AI Studio Commercialization

#### Phase 1: Database Schema ✅
- Renamed instructor_* tables to user_*
- Created ai_bundle and subscription_status enums
- Created ai_subscriptions and ai_tier_limits tables

#### Phase 2: Backend Updates ✅
- Updated generate-content with dynamic tier limits
- Updated refine-content with dynamic tier limits
- Created get-user-tier edge function
- Created create-ai-subscription edge function

#### Phase 3: Public Navigation ✅
- Added AI Studio to main navbar
- Removed RequireInstructor wrapper from routes
- Implemented auth guards at feature level

#### Phase 4: Landing & Bundles ✅
- Created public landing page with pricing
- Implemented bundle-based routing
- Created Marketing and Academic bundle hub pages
- Simplified style settings

---

## Roadmap: v4.1+ Next Steps

### 🔜 Próximo

#### Phase 5: Marketing Bundle Features (v4.1-v4.3)
- [ ] LinkedIn Post Generator (v4.1)
- [ ] X/Twitter Generator with threads support (v4.2)
- [ ] Newsletter Generator (v4.3)

#### Phase 6: Academic Bundle (v5.0+)
- [ ] Literature Review Generator
- [ ] Paper Formatter (journal styles)
- [ ] Paper Editor
- [ ] Citation Generator

### Next Priorities

| Focus | Planned Deliverables | Priority |
|-------|---------------------|----------|
| Marketing Features | LinkedIn, Twitter, Newsletter generators | 🔴 High |
| Test Coverage | Increase unit test coverage for AI hooks | 🟡 Medium |
| Performance | Lighthouse analysis, Core Web Vitals | 🟡 Medium |

---

## Future Roadmap

### v5.0+: Advanced Features (Future)

| Focus | Planned Features |
|-------|-----------------|
| Analytics | Advanced student analytics, cohort tracking |
| AI Studio | Multi-language generation, course outline generator |
| Platform | Webhooks for integrations, public API |
| Enrollment | Invite links for private courses, bulk CSV enrollment |

---

## Non-Goals

These features are explicitly out of scope:

- Complex LMS features (assignments, quizzes, gradebooks, SCORM)
- Enterprise features (SAML SSO, HR integrations, org hierarchies)
- AI-based grading or automated student evaluation
- Heavy discussion forums or moderation systems
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

### Usage Limits by Tier
| Tier | Daily Limit | Rate Limit |
|------|-------------|------------|
| Free | 10 | 5/min |
| Instructor | 50 | 10/min |
| Marketing/Academic | 200 | 15/min |
| Pro | 500 | 20/min |

---

## References

- **Detailed Changes:** See [CHANGELOG.md](./CHANGELOG.md)
- **Testing Guide:** See [TESTING.md](./TESTING.md)
- **E2E Testing:** See [E2E_TESTING.md](./E2E_TESTING.md)
