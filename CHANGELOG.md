# Changelog

All notable changes to Cognitio will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.9.0] - 2026-01-02

### Added
- **AI Studio Dashboard**: New landing page at `/ai-studio` with:
  - Quick action cards for Blog Generator and Newsletter (coming soon)
  - Recent generations list with load buttons
  - 4 analytics cards: Documents count, Style status, Generations today, Total generations
  - Responsive design matching platform design system

- **`is_active` Column**: Database migration adding soft-delete capability to `ai_generation_history`
  - Enables accurate daily usage tracking independent of history display limit
  - Index added for performance: `idx_ai_generation_history_active`

### Changed
- **`useGenerationHistory`**: Updated to use soft-delete (set `is_active = false`) instead of hard-delete when reaching 10-item history limit
- **`useGenerationUsage`**: Now counts ALL generations created today regardless of `is_active` status, ensuring accurate quota tracking
- **AI Studio Sidebar**: Dashboard added as first menu item, improved active link detection
- **Routing**: `/ai-studio` now shows Dashboard, Knowledge Base moved to `/ai-studio/knowledge`

### Fixed
- **Usage Counter Bug**: Previously showed incorrect count when history hit 10-item limit; now accurately tracks daily usage

## [3.8.0] - 2026-01-02

### Added
- **Generation History**: Full CRUD for saved generations
  - Save to History button for new generations
  - Update existing history items
  - Load history items back into editor
  - Delete with confirmation dialog
  - FIFO queue (10 items max)

- **History Sidebar**: Collapsible list in AI Studio sidebar
  - Shows recent generations with relative timestamps
  - Quick-load buttons
  - Delete icons with AlertDialog confirmation

### Technical
- RLS policy for DELETE operation on `ai_generation_history`

## [3.7.0] - 2026-01-01

### Added
- **Inline Refinement**: AI-powered text editing
  - `refine-content` edge function for targeted text refinement
  - Text selection triggers "Refine with AI" floating button
  - Refinement dialog with custom instructions input
  - Quick actions: Shorten, Expand, Simplify, Formalize
  - Side-by-side diff view for accepting/rejecting changes

- **Export Options**: Multiple export formats
  - Export as .txt (strips markdown formatting)
  - Export as .md (preserves markdown)
  - Dropdown menu for format selection

### Changed
- Editor now tracks `editableContent` separately for manual edits
- Export uses edited content, not original generation

## [3.6.0] - 2026-01-01

### Added
- **Rich Editor**: Dual-mode content editing
  - Preview mode with ReactMarkdown rendering
  - Edit mode with Textarea for direct markdown editing
  - Toggle button to switch between modes
  - Editable content state for manual modifications

### Technical
- Integrated `react-markdown` for proper content rendering
- System prompt enforces strict "content-only" output rules

## [3.5.0] - 2026-01-01

### Added
- **Progress Bar Visualization**: Added visual progress bar for generation quota in AI Studio sidebar
  - Desktop sidebar shows progress bar below generation count
  - Mobile header includes compact progress bar
  - Real-time updates as generations are used

### Changed
- Updated all documentation to v3.5.0

## [3.4.0] - 2026-01-01

### Added
- **Usage Tracking**: Implemented daily generation limits for AI Studio
  - `useGenerationUsage` hook for tracking daily usage
  - 10 generations per day limit per instructor
  - Counter displayed in AI Studio sidebar
  - Queries `ai_generation_history` for completed generations today

## [3.3.0] - 2026-01-01

### Added
- **Blog Generator**: Full blog generation workflow
  - `generate-content` edge function using Lovable AI Gateway
  - Gemini 2.5 Flash model integration
  - Streaming markdown output
  - `useContentGeneration` hook with abort support
  - Topic input with document selection
  - Real-time content preview

### Technical
- Context Window Stuffing strategy (no RAG needed)
- 100K token context budget
- Strategic document placement by `context_role`

## [3.2.0] - 2026-01-01

### Added
- **Style Profiles**: Instructor writing preferences
  - `StyleProfileForm` component with collapsible UI
  - `useStyleProfile` hook for CRUD operations
  - Preferences: tone, length, language, audience
  - Custom instructions support
  - Setup completion tracking

### Database
- `instructor_style_profile` table with all preference fields

## [3.1.0] - 2026-01-01

### Added
- **Knowledge Base**: Document management for AI context
  - `DocumentEditor` component for creating/editing documents
  - `useKnowledgeBase` hook for CRUD operations
  - Document types: academic_paper, cv_bio, methodology, writing_sample, syllabus, other
  - Context roles: style_reference, topic_source, background_context
  - Token counting for budget tracking
  - Tag support for organization

### Database
- `instructor_knowledge_base` table with full schema

## [3.0.0] - 2026-01-01

### Added
- **AI Content Studio Foundation**
  - `AIStudioLayout` component with sidebar
  - `AIStudioSidebar` with navigation and usage display
  - `AIStudioKnowledge` page for knowledge base management
  - `AIStudioBlog` page for blog generation
  - Mobile tab bar with `SlidingPillIndicator`
  - Routes: `/ai-studio`, `/ai-studio/knowledge`, `/ai-studio/blog`
  - Navbar dropdown link to AI Studio

### Database
- New tables: `instructor_knowledge_base`, `instructor_style_profile`, `ai_generation_history`
- New enums: `content_type`, `context_role`, `document_type`, `generation_status`, `language_preference`, `length_preference`, `writing_tone`

### Technical
- New edge function: `generate-content`
- Lovable AI Gateway integration
- 4 new custom hooks for AI functionality

## [2.9.4] - 2025-12-31

### Fixed
- **Test Suite**: Fixed i18n-related test failures
  - Added i18n mock to test setup for consistent English translations in tests
  - Updated CourseCard tests to match component's Spanish strings ("Inscribirse", "Continuar")
  - All unit tests now pass consistently

### Changed
- Updated `src/test/setup.ts` with comprehensive i18n mock
- Fixed TypeScript type annotation in ResizeObserver mock

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
