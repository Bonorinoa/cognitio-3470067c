# Cognitio Development Plan

**Current Version:** v3.9.0  
**Last Updated:** January 2, 2026

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

**✅ v3.x COMPLETO - Blog Generator Feature Complete**

---

## Current: v3.9 AI Content Studio ✅ COMPLETO

### Completed Features ✅ **ALL COMPLETE**

#### Database Schema
- `instructor_knowledge_base` - Documents with types and context roles
- `instructor_style_profile` - Writing preferences (tone, length, audience)
- `ai_generation_history` - Generation tracking with `is_active` for soft-delete

#### Edge Functions
- `generate-content` - Lovable AI Gateway integration with Gemini 2.5 Flash
- `refine-content` - Inline text refinement with instruction-based editing

#### Frontend Components
- `AIStudioLayout` - Two-column layout with sidebar
- `AIStudioSidebar` - Navigation + usage tracking with progress bar
- `AIStudioDashboard` - Landing page with quick actions and stats 🆕
- `AIStudioKnowledge` - Knowledge base CRUD with document editor
- `AIStudioBlog` - Blog generator with topic input, streaming output, and history
- `StyleProfileForm` - Collapsible style configuration
- `DocumentEditor` - Create/edit documents with type and role selection

#### Custom Hooks
- `useKnowledgeBase` - Document CRUD operations
- `useStyleProfile` - Style preferences management
- `useContentGeneration` - Streaming generation with abort support
- `useGenerationUsage` - Daily usage tracking (counts ALL today's generations)
- `useGenerationHistory` - History CRUD with soft-delete (`is_active` flag)

#### Design
- Mobile tab bar with sliding pill indicator
- Progress bar for generations remaining
- AI Studio Dashboard with 4 analytics cards
- Consistent with platform design system

### v3.9 Infrastructure Updates

1. **`is_active` Column**: Added to `ai_generation_history` for soft-delete
   - History display: shows only `is_active = true` (max 10)
   - Usage counting: counts ALL records created today (regardless of `is_active`)
   - Solves: usage counter bug when history hits 10-item limit

2. **Dashboard Route**: `/ai-studio` now shows dedicated dashboard
   - Quick actions: Blog Generator, Newsletter (coming soon)
   - Recent generations with load buttons
   - 4 stats cards: Documents, Style Status, Gen Today, Total Gen

3. **Updated Navigation**: Dashboard as first menu item in sidebar

---

## Roadmap: v4.x y Más Allá

### v4.0: Newsletter Generator & Content Expansion

Newsletter generation as the next AI Studio feature, plus platform maturity improvements.

| Version | Focus | Planned Deliverables | Status |
|---------|-------|---------------------|--------|
| v4.0 | Newsletter | Newsletter generator page, email templates, multi-format export | 📋 Planned |
| v4.1 | Course Context | Inject course content (titles, descriptions, transcripts) as generation context | 📋 Planned |
| v4.2 | Enrollment | Invite links for private courses, bulk CSV enrollment | 📋 Planned |
| v4.3 | Notifications | Email notifications for enrollments, completions, new content | 📋 Planned |

### v5.0+: Advanced Features (Future)

| Focus | Planned Features |
|-------|-----------------|
| Analytics | Advanced student analytics, cohort tracking, completion funnels |
| AI Studio | Multi-language generation, social media post generator, course outline generator |
| Platform | Webhooks for integrations, public API, advanced reporting |

**Rationale for v3.x → v4.x Reorganization:**
- v3.x successfully completed Blog Generator (core AI Studio feature)
- Newsletter is a distinct content type, not an iteration of Blog
- v4.0 marks expansion of AI Studio to multiple content formats
- Clean separation between Blog (v3) and Newsletter (v4) features

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
- **Codebase Health:** See [REVIEW_SUMMARY.md](./REVIEW_SUMMARY.md)
- **Tech Details:** See [TECHNOLOGY_STACK.md](./TECHNOLOGY_STACK.md)
