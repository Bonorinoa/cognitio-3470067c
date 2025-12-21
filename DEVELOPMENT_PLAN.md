# LearnHub MVP Development Plan

## Executive Summary

LearnHub is a course management system enabling teachers to create and sell video courses while providing students with an engaging learning experience. This document outlines the strategy to reach a full MVP version.

---

## Current State Assessment

### ✅ Completed Features

| Category | Feature | Status |
|----------|---------|--------|
| **Authentication** | Email/password auth via Supabase | ✅ Complete |
| | Role-based access (student/teacher) | ✅ Complete |
| | Protected routes | ✅ Complete |
| **Course Management** | Course creation (title, description, price, category) | ✅ Complete |
| | Chapter management with ordering | ✅ Complete |
| | Draft/Publish workflow | ✅ Complete |
| **Video Integration** | Mux video upload | ✅ Complete |
| | Mux video playback | ✅ Complete |
| | Video duration tracking | ✅ Complete |
| **Payments** | Stripe checkout integration | ✅ Complete |
| | Purchase recording | ✅ Complete |
| | Course access after purchase | ✅ Complete |
| **Student Experience** | Course browsing with filters | ✅ Complete |
| | Course enrollment | ✅ Complete |
| | Student dashboard | ✅ Complete |
| **Teacher Experience** | Teacher dashboard | ✅ Complete |
| | Course management sidebar | ✅ Complete |

### ⚠️ Partially Complete

| Feature | Current State | Remaining Work |
|---------|---------------|----------------|
| Course image upload | UI placeholder only | Implement Supabase storage upload |
| Chapter access logic | Works for purchasers | Fix access for course owners/teachers |
| Progress tracking | DB schema exists | Implement completion marking UI |
| Teacher analytics | Basic UI exists | Connect to real data |

### ❌ Not Started (MVP Required)

| Feature | Priority | Effort |
|---------|----------|--------|
| Mark chapter as complete | High | Small |
| Course editing | High | Medium |
| Profile management | Medium | Small |
| Password reset flow | Medium | Small |

---

## MVP Definition

### Core MVP Features (Must Have)

1. **Students can:**
   - Browse and search courses
   - View course details and preview content
   - Purchase courses via Stripe
   - Watch video lessons
   - Track their progress (mark chapters complete)
   - View their enrolled courses

2. **Teachers can:**
   - Create courses with chapters
   - Upload videos via Mux
   - Upload course thumbnail images
   - Set pricing and categories
   - Publish/unpublish courses
   - Edit existing courses
   - View basic analytics

3. **Platform provides:**
   - Secure authentication
   - Payment processing
   - Video hosting and playback
   - Progress persistence

---

## Development Phases

### Phase 1: Core Fixes (Week 1)
**Goal:** Fix existing functionality gaps

| Task | Priority | Complexity | Description |
|------|----------|------------|-------------|
| Fix chapter access for teachers | High | Small | Teachers should always access their own course videos |
| Implement course image upload | High | Medium | Supabase storage + UI integration |
| Fix forwardRef warnings | Low | Small | Add forwardRef to Badge, ChapterList |
| Clean up unused code | Low | Small | Remove dead files, unused imports |

**Deliverables:**
- Course owners can always play their videos
- Teachers can upload course thumbnails
- Zero console warnings

### Phase 2: Progress Tracking (Week 2)
**Goal:** Complete student progress features

| Task | Priority | Complexity | Description |
|------|----------|------------|-------------|
| Mark chapter complete button | High | Small | UI button to mark current chapter done |
| Auto-complete on video end | Medium | Medium | Detect video completion event |
| Progress persistence | High | Small | Save progress to user_progress table |
| Resume functionality | Medium | Small | Start from last watched chapter |

**Deliverables:**
- Students can manually mark chapters complete
- Progress persists across sessions
- Dashboard shows accurate progress

### Phase 3: Course Editing (Week 2-3)
**Goal:** Allow teachers to edit published courses

| Task | Priority | Complexity | Description |
|------|----------|------------|-------------|
| Edit course page | High | Medium | Route /teacher/courses/:id/edit |
| Update course details | High | Small | Title, description, price, category |
| Edit chapters | High | Medium | Add, remove, reorder chapters |
| Replace chapter videos | Medium | Medium | Upload new video for existing chapter |
| Delete course | Medium | Small | With confirmation dialog |

**Deliverables:**
- Teachers can fully edit their courses
- Changes reflect immediately for students
- Safe deletion with confirmation

### Phase 4: User Management (Week 3)
**Goal:** Complete user profile features

| Task | Priority | Complexity | Description |
|------|----------|------------|-------------|
| Profile settings page | Medium | Small | View/edit profile info |
| Avatar upload | Low | Small | Upload profile picture |
| Password change | Medium | Small | Change password form |
| Password reset | Medium | Medium | Email-based reset flow |

**Deliverables:**
- Users can update their profile
- Password management is complete

### Phase 5: Analytics & Polish (Week 4)
**Goal:** Teacher insights and UX improvements

| Task | Priority | Complexity | Description |
|------|----------|------------|-------------|
| Real analytics data | Medium | Medium | Connect dashboard to actual DB data |
| Revenue breakdown | Medium | Small | Per-course revenue display |
| Enrollment metrics | Medium | Small | Student count per course |
| Email notifications | Low | Medium | Welcome email, purchase confirmation |
| Loading/error states | Low | Small | Improve edge case handling |

**Deliverables:**
- Teachers see real analytics
- Platform feels polished and complete

---

## Technical Architecture

### Current Stack
```
Frontend: React 18 + TypeScript + Vite + Tailwind CSS
UI: shadcn/ui + Radix UI
Backend: Supabase (PostgreSQL + Auth + Edge Functions)
Video: Mux
Payments: Stripe
State: TanStack Query
```

### Database Schema (Existing)
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   profiles  │     │   courses   │     │  chapters   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id (PK)     │     │ id (PK)     │     │ id (PK)     │
│ email       │     │ teacher_id  │────>│ course_id   │
│ full_name   │     │ title       │     │ title       │
│ role        │     │ description │     │ position    │
│ avatar_url  │     │ price       │     │ mux_playback│
└─────────────┘     │ category    │     │ duration    │
                    │ is_published│     │ is_preview  │
                    │ image_url   │     └─────────────┘
                    └─────────────┘
                          │
                          ▼
┌─────────────┐     ┌─────────────┐
│  purchases  │     │user_progress│
├─────────────┤     ├─────────────┤
│ id (PK)     │     │ id (PK)     │
│ user_id     │     │ user_id     │
│ course_id   │     │ chapter_id  │
│ amount      │     │ is_completed│
│ stripe_id   │     │ completed_at│
└─────────────┘     └─────────────┘
```

### Required Storage Bucket
```sql
-- Course thumbnails bucket (to be created)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('course-images', 'course-images', true);
```

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Mux API rate limits | Low | Medium | Implement retry logic, queue uploads |
| Stripe webhook failures | Medium | High | Add manual purchase verification |
| Large video uploads | Medium | Medium | Show progress, handle timeouts |
| Database performance | Low | High | Add indexes, optimize queries |

---

## Success Metrics

### MVP Launch Criteria
- [ ] Teachers can create courses with videos end-to-end
- [ ] Students can purchase and watch courses
- [ ] Progress tracking works reliably
- [ ] No critical bugs or console errors
- [ ] Mobile responsive on all pages
- [ ] Page load times < 3 seconds

### Post-MVP KPIs
- Course creation completion rate > 80%
- Video playback success rate > 99%
- Checkout conversion rate > 60%
- Student course completion rate > 30%

---

## Timeline Summary

| Phase | Duration | Focus |
|-------|----------|-------|
| Phase 1 | Week 1 | Core fixes |
| Phase 2 | Week 2 | Progress tracking |
| Phase 3 | Week 2-3 | Course editing |
| Phase 4 | Week 3 | User management |
| Phase 5 | Week 4 | Analytics & polish |

**Estimated Total: 4 weeks to full MVP**

---

## Next Steps

1. **Immediate:** Fix chapter access logic for course owners
2. **This week:** Implement course image upload
3. **Next sprint:** Complete progress tracking features

---

## Appendix: File Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── ChapterList.tsx     # Chapter navigation
│   ├── CourseCard.tsx      # Course display card
│   ├── Navbar.tsx          # Global navigation
│   ├── ProgressCard.tsx    # Stats display
│   ├── TeacherSidebar.tsx  # Teacher nav
│   ├── VideoPlayer.tsx     # Mux player wrapper
│   └── VideoUpload.tsx     # Video upload component
├── pages/
│   ├── Index.tsx           # Landing page
│   ├── AuthPage.tsx        # Login/signup
│   ├── CoursePage.tsx      # Course detail/player
│   ├── CoursesPage.tsx     # Course catalog
│   ├── Dashboard.tsx       # Student dashboard
│   ├── CreateCourse.tsx    # Course creation
│   ├── TeacherDashboard.tsx
│   ├── TeacherCourses.tsx
│   ├── TeacherAnalytics.tsx
│   └── TeacherSettings.tsx
├── contexts/
│   └── AuthContext.tsx     # Auth state management
├── hooks/
│   └── useUserRole.ts      # Role-based access
└── integrations/
    └── supabase/           # Supabase client & types
```
