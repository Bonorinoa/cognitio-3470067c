---
name: Course Platform Rules
description: Course visibility, avatar handling, feature limits, resource fetching, and contact methods
type: feature
---

## Course visibility

Three modes, enforced both in UI and RLS:

- **public** — listed in `/courses` catalog, anyone can view + purchase. CoursesPage filters `.eq("visibility", "public")`.
- **unlisted** — NOT in catalog. Accessible to anyone with the direct `/course/:id` URL. RLS allows SELECT when `visibility = 'unlisted' AND is_published = true`. Purchase gating still applies for paid courses.
- **private** — NOT in catalog. Only the instructor (owner) and enrolled students (purchase or course_membership) can view via `has_course_access()`. Used for university cohorts.

RLS policy on `courses`: `"Courses are viewable based on visibility"` — owner OR (public+published) OR (unlisted+published) OR (private+published+has_course_access).

UI: visibility selector in `CreateCourseBasicInfo` and `CourseBasicInfoForm` uses shared `CourseVisibility` type (`"public" | "private" | "unlisted"`). Helper text per mode lives in `createCourse.publicDesc`, `unlistedDesc`, `privateDesc` i18n keys.

## Avatars
- Stored in public `avatars` bucket.
- Updated via `AvatarUpload` component; `profiles.avatar_url` updated immediately.

## Feature limits
- Max 3 featured courses per instructor (enforced by `check_featured_course_limit` trigger).

## Contact
- Instructor-student contact: `send-instructor-inquiry` edge function. Public form on instructor profile.
