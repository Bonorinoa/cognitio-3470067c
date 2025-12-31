# Cognitio Development Plan

**Current Version:** v2.9.3  
**Last Updated:** December 30, 2025

---

## Vision

Cognitio is an invite-only, instructor-first academic ecosystem. It prioritizes instructor autonomy and revenue retention over marketplace scale. Core features: course creation (public/private/unlisted), Stripe payments, progress tracking, and an upcoming AI Content Studio for marketing assistance.

**Tech Stack:** React + Vite + TypeScript + Tailwind + shadcn/ui + Supabase + Stripe + Mux  
**Roles:** Admin (platform management) → Instructor (content creation) → Student (learning)

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

---

## Roadmap

### v3.x: AI Content Studio

AI-powered content generation to help instructors create marketing materials from course content.

| Version | Focus | Planned Deliverables |
|---------|-------|---------------------|
| v3.0 | MVP | Edge function with Lovable AI, `instructor_contents` table, blog/newsletter generator UI |
| v3.1 | Publishing | Podcast script generator, landing page copy, export/publish workflow |
| v3.2 | Enhancements | Course-to-content context injection, usage analytics, generation limits |

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

---

## References

- **Detailed Changes:** See [CHANGELOG.md](./CHANGELOG.md)
- **Feature Documentation:** See [FEATURES.md](./FEATURES.md)
- **Codebase Health:** See [REVIEW_SUMMARY.md](./REVIEW_SUMMARY.md)
- **Tech Details:** See [TECHNOLOGY_STACK.md](./TECHNOLOGY_STACK.md)
