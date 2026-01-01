# Cognitio Development Plan

**Current Version:** v3.5.0  
**Last Updated:** January 1, 2026

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
| v3.6 | Newsletter | Newsletter generator page, template variations | 🚧 Planned |
| v3.7 | Export/Publish | Copy to clipboard, markdown export, publish workflow | 🚧 Planned |
| v3.8 | History | Save generations to history, view/edit past generations | 🚧 Planned |
| v3.9 | Course Context | Inject course content (titles, descriptions) as generation context | 🚧 Planned |

---

## Current: v3.5 AI Content Studio

### Completed Features ✅

#### Database Schema
- `instructor_knowledge_base` - Documents with types and context roles
- `instructor_style_profile` - Writing preferences (tone, length, audience)
- `ai_generation_history` - Generation tracking with token counts

#### Edge Functions
- `generate-content` - Lovable AI Gateway integration with Gemini 2.5 Flash

#### Frontend Components
- `AIStudioLayout` - Two-column layout with sidebar
- `AIStudioSidebar` - Navigation + usage tracking with progress bar
- `AIStudioKnowledge` - Knowledge base CRUD with document editor
- `AIStudioBlog` - Blog generator with topic input and streaming output
- `StyleProfileForm` - Collapsible style configuration
- `DocumentEditor` - Create/edit documents with type and role selection

#### Custom Hooks
- `useKnowledgeBase` - Document CRUD operations
- `useStyleProfile` - Style preferences management
- `useContentGeneration` - Streaming generation with abort support
- `useGenerationUsage` - Daily usage tracking

#### Design
- Mobile tab bar with sliding pill indicator
- Progress bar for generations remaining
- Consistent with platform design system

### Remaining Work (v3.6-v3.9)

| Task | Version | Priority |
|------|---------|----------|
| Newsletter Generator Page | v3.6 | High |
| Newsletter Templates | v3.6 | Medium |
| Copy to Clipboard | v3.7 | High |
| Markdown Export | v3.7 | Medium |
| Save to History | v3.8 | High |
| View Generation History | v3.8 | Medium |
| Course Content Injection | v3.9 | Medium |
| Transcript Integration | v3.9 | Low |

---

## Roadmap

### v4.x: Platform Maturity

Scaling features for larger instructor operations and improved student experience.

| Version | Focus | Planned Deliverables |
|---------|-------|---------------------|
| v4.0 | Enrollment | Invite links for private courses, bulk CSV enrollment |
| v4.1 | Notifications | Email notifications for enrollments, completions |
| v4.2 | Analytics | Advanced student analytics, cohort tracking |

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

### Usage Limits
- 10 generations per day per instructor
- 10 documents max per generation
- 100K token context budget

---

## References

- **Detailed Changes:** See [CHANGELOG.md](./CHANGELOG.md)
- **Feature Documentation:** See [FEATURES.md](./FEATURES.md)
- **Codebase Health:** See [REVIEW_SUMMARY.md](./REVIEW_SUMMARY.md)
- **Tech Details:** See [TECHNOLOGY_STACK.md](./TECHNOLOGY_STACK.md)
