# Changelog

All notable changes to Cognitio will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.9.3] - 2025-12-30

### Fixed
- **Code Quality**: Fixed 4 ESLint `prefer-const` errors
  - useInstructorAnalytics.ts: Changed `let profileMap` to `const profileMap`
  - InstructorDashboard.tsx: Changed `let chapterCounts`, `purchaseStats`, and `profileMap` to `const`
  - Improves code quality and follows JavaScript best practices

### Added
- **REVIEW_SUMMARY.md**: Comprehensive codebase review document (11,941 characters)
  - Complete feature verification and testing results
  - Security audit summary (0 vulnerabilities confirmed)
  - Build and test analysis
  - Documentation completeness verification
  - Recommendations for future improvements
  - v3.0 readiness assessment

### Verified
- ✅ All core features working correctly:
  - Private/unlisted course invitation mechanism
  - Stripe payment integration
  - Course and services filtering
  - Instructor profile cards
  - Student and instructor dashboards
- ✅ All documentation up-to-date (v2.9.2)
- ✅ v3.0-v4.0 roadmap complete and comprehensive
- ✅ No deprecated code remaining
- ✅ Security excellent (CodeQL: 0 alerts)
- ✅ Build successful (718KB gzipped)

### Documentation
- Created comprehensive review summary documenting codebase health
- Verified all edge functions in active use
- Confirmed backward compatibility measures in place

## [2.9.2] - 2025-12-30

### Added
- **CourseMembershipManager**: Instructors can now enroll students in private/unlisted courses
  - Add students by email address
  - Remove enrolled students
  - View all enrolled students with avatars
- **Dashboard Course Access**: Student dashboard now shows courses from BOTH purchases AND memberships
  - Private/unlisted courses accessible via membership now appear in student dashboard
  - Combined and deduplicated course list
- **studentDashboard i18n**: Full Spanish translation for student dashboard
  - All UI strings now properly internationalized
  - Consistent with platform's Spanish-first approach
- **AvatarUpload Improvements**:
  - 10MB file size limit
  - Automatic client-side compression (images >2MB resized to max 1200px, JPEG 80%)
  - Explicit "Remove Photo" functionality with storage cleanup

### Deprecated
- **InstructorContactForm**: Removed in favor of direct email links on instructor profiles
- **send-instructor-inquiry Edge Function**: Deleted (no longer needed)
- **RESEND_API_KEY Secret**: Removed from project secrets

### Removed
- `src/components/ui/chart.tsx` - Unused shadcn wrapper (InstructorAnalytics imports directly from recharts)
- `WORK_SUMMARY.md` - Outdated session log from December 2024
- `CLEANUP_ANALYSIS.md` - Cleanup actions completed, contained outdated info

### Fixed
- Dashboard now correctly displays private/unlisted courses that users are enrolled in via memberships

### Documentation
- Updated README.md, FEATURES.md, DEVELOPMENT_PLAN.md to reflect v2.9.2 changes
- Cleaned up outdated documentation files

## [2.9.1] - 2025-12-30

### Fixed
- **InstructorSidebar**: Fixed alignment and sticky positioning issues
  - Added `self-start` to ensure proper alignment at top
  - Added explicit `w-64` width on aside element
  - Added `min-h-screen` to main content for consistent layout
  - Sidebar now properly stays fixed when scrolling on all instructor pages

- **FoundersStorySection**: Fixed animation and scroll behavior bugs
  - Removed fade-out effect that caused cards to disappear
  - Cards now stay visible as they stack during scroll
  - Implemented proper z-index stacking to prevent overlapping
  - Fixed y-transform values to prevent cards from going off-screen
  - Cards now create a sticky stack effect instead of disappearing
  - Added relative positioning and min-height for better scroll container

- **ProgressCard**: Standardized hover effects
  - Updated hover effect to match other card components
  - Changed from `hover:shadow-md` to `hover:shadow-lg`
  - Added `hover:-translate-y-1` lift effect
  - Changed transition from `transition-shadow` to `transition-all`

### Security
- Added `.env` files to `.gitignore` as best practice
- Completed security audit:
  - ✅ No hard-coded secrets found in source code
  - ✅ Only VITE_ prefixed environment variables in client code
  - ✅ Supabase service keys properly secured in edge functions
  - ✅ RLS policies enabled on all database tables
  - ✅ CodeQL scan: 0 vulnerabilities found

### Verified Working
- **HeroBackground**: Blob animation confirmed working correctly
  - Keyframes properly defined in `tailwind.config.ts`
  - Animation duration: 10s ease-in-out infinite
  - Respects `prefers-reduced-motion` accessibility setting

- **Featured Courses**: Functionality confirmed complete
  - "Destacados" (Featured) category filter in CoursesPage
  - Featured badge displays on CourseCard components
  - Filtering logic working correctly with `isFeatured` flag

### Changed
- Card hover effects now standardized across all card components:
  - `CourseCard`, `ServiceCard`, `InstructorCatalogCard`, `ProgressCard`
  - All use: `rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300`

## [2.9.0] - 2025-12-30

### Added
- Responsive mobile navigation with hamburger menu
- Design system with warm coral/salmon color palette
- Hero background with animated blobs
- Framer Motion animations throughout the UI
- Standardized card components with consistent styling

### Changed
- Updated design tokens to use HSL semantic colors
- Improved navigation layout and mobile responsiveness
- Enhanced About page with Founders Story section

## [Earlier Versions]

See `DEVELOPMENT_PLAN.md` for details on v1.0 - v2.8 releases.
