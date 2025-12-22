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
| Teacher analytics | Basic UI exists | Connect to real data |

### ✅ Recently Completed (December 2024)

| Feature | Status | Notes |
|---------|--------|-------|
| Course image upload | ✅ Complete | Supabase storage upload with validation |
| Chapter access logic | ✅ Complete | Teachers can access their own courses |
| Progress tracking | ✅ Complete | Mark complete button and persistence |
| UI cleanup | ✅ Complete | Removed unused "Watch Demo" button |

### ❌ Not Started (MVP Required)

| Feature | Priority | Effort |
|---------|----------|--------|
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

### Phase 1: Core Fixes (Week 1) ✅ COMPLETED
**Goal:** Fix existing functionality gaps

| Task | Priority | Complexity | Status | Notes |
|------|----------|------------|--------|-------|
| Fix chapter access for teachers | High | Small | ✅ Complete | Teachers can now access their own course videos |
| Implement course image upload | High | Medium | ✅ Complete | Supabase storage with file validation |
| Remove unused UI elements | Low | Small | ✅ Complete | Removed "Watch Demo" button |
| Fix forwardRef warnings | Low | Small | ⏸️ Deferred | Not critical for MVP |
| Clean up unused code | Low | Small | ⏸️ Deferred | Not critical for MVP |

**Deliverables:**
- ✅ Course owners can always play their videos
- ✅ Teachers can upload course thumbnails
- ✅ Improved UI/UX with removal of placeholder buttons

### Phase 2: Progress Tracking (Week 2) ✅ COMPLETED
**Goal:** Complete student progress features

| Task | Priority | Complexity | Status | Notes |
|------|----------|------------|--------|-------|
| Mark chapter complete button | High | Small | ✅ Complete | Button shown for purchased courses |
| Progress persistence | High | Small | ✅ Complete | Saves to user_progress table |
| Chapter completion display | High | Small | ✅ Complete | Checkmarks shown in chapter list |
| Auto-complete on video end | Medium | Medium | ⏸️ Deferred | Can be added later |
| Resume functionality | Medium | Small | ⏸️ Deferred | Can be added later |

**Deliverables:**
- ✅ Students can manually mark chapters complete
- ✅ Progress persists across sessions
- ✅ Chapter list shows completion status

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

### Completed (December 2024)
1. ✅ Fixed chapter access logic for course owners
2. ✅ Implemented course image upload with Supabase storage
3. ✅ Completed progress tracking features (mark complete, display status)
4. ✅ Removed unused UI elements (Watch Demo button)

### Immediate Priorities
1. **Course Editing**: Allow teachers to edit published courses
2. **Testing & Validation**: Comprehensive testing of all implemented features
3. **User Management**: Profile settings and password reset
4. **Analytics**: Connect teacher dashboard to real data

---

## Recent Changes (December 22, 2024)

### 1. UI/UX Improvements
- **Removed "Watch Demo" button** from landing page (Index.tsx)
  - Was pointing to dashboard which doesn't make sense for non-authenticated users
  - Cleaned up unused Play icon import

### 2. Access Control Fixes
- **Fixed teacher access to own courses** (CoursePage.tsx)
  - Added `isOwner` check: `user?.id === course?.teacher_id`
  - Updated `hasAccess` logic: `hasPurchased || isOwner`
  - Teachers now see "Your Course" badge instead of purchase button
  - Teachers can view all chapters without purchasing

### 3. Progress Tracking Implementation
- **Added progress tracking to CoursePage.tsx:**
  - Queries `user_progress` table for completion status
  - Displays "Mark as Complete" button for purchased courses
  - Shows checkmarks for completed chapters in chapter list
  - Persists progress via `handleMarkComplete` function
  - Uses `upsert` to update existing or create new progress records

### 4. Course Image Upload
- **Implemented full image upload in CreateCourse.tsx:**
  - File input with validation (image type, 2MB max)
  - Image preview before upload
  - Upload to Supabase storage (`course-images` bucket)
  - Saves public URL to course record
  - Disabled save buttons during upload
  
- **Created storage migration:**
  - Migration: `20251222201400_create_course_images_bucket.sql`
  - Public bucket for viewing
  - RLS policies for authenticated uploads
  - User-specific update/delete permissions

### 5. Database Updates
- **Progress tracking utilizes existing schema:**
  - Table: `user_progress`
  - Columns: `user_id`, `chapter_id`, `is_completed`, `completed_at`
  - Unique constraint on `(user_id, chapter_id)`

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
