# Changelog

All notable changes to Cognitio will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
