# Changelog

All notable changes to Cognitio will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.2] - 2026-01-06

### Changed
- **Course Visibility Simplified**: Removed "unlisted" visibility option
  - UI now only shows "Public" and "Private" options
  - Existing unlisted courses migrated to private
  - RLS policies updated to remove unlisted references
  - Simplified enrollment logic for private courses only

### Fixed
- **Subscription Tier Recognition**: `trialing` status now correctly recognized
  - Updated `generate-content` and `refine-content` edge functions
  - Users on trial subscriptions now get their full tier benefits

### Added
- **Subscription Tier Tests**: Automated tests for tier resolution logic
  - Tests for active, trialing, canceled status handling
  - Tests for tier limit alignment (Marketing: 200, Academic: 200, Pro: 500)
  - Tests for instructor role fallback

## [4.0.1] - 2026-01-05

### Changed
- **Tier Limits Alignment**: Updated PricingSection copy to match database limits
  - Marketing/Academic: 200 generations/day (was incorrectly showing 100)
  - Pro: 500 generations/day (was incorrectly showing "Unlimited")

### Removed
- **Notification Features Deferred**: Removed all "Notify Me" functionality from codebase
  - Deleted `NotifyMeModal.tsx` component
  - Removed notification buttons from `MarketingBundleHub.tsx` and `AcademicBundleHub.tsx`
  - Simplified `ComingSoonFeature.tsx` (removed email form)
  - Coming soon features now show "Coming Soon" badge without notification signup

### Documentation
- **Consolidated Documentation**: Reduced documentation footprint
  - Deleted `FEATURES.md` (content merged into README and DEVELOPMENT_PLAN)
  - Deleted `TECHNOLOGY_STACK.md` (content in README)
  - Deleted `TEST_COVERAGE_SUMMARY.md` (content in TESTING.md)
  - Updated README.md to v4.0.1 with current tier limits
  - Updated DEVELOPMENT_PLAN.md with accurate roadmap

## [4.0.0] - 2026-01-05

### Added
- **AI Studio Commercialization**: Complete public-facing AI content platform
  - Public landing page with hero, bundles showcase, and pricing
  - Bundle-based architecture (Marketing and Academic)
  - Stripe subscription integration for paid tiers
  - Dynamic tier limits: Free (10), Instructor (50), Marketing/Academic (200), Pro (500)
  - `create-ai-subscription` edge function for Stripe Checkout
  - `get-user-tier` edge function for tier resolution
  - Subscription management UI in AIStudioSettings

### Changed
- **Database Schema**: Renamed instructor_* tables to user_* for broader access
- **Navigation**: AI Studio now visible in main navbar to all visitors
- **Auth Flow**: Feature-level auth guards instead of route-level protection
- **Settings**: Simplified style settings (removed content length preferences)

## [3.9.1] - 2026-01-03

### Changed
- **Toast System Unified**: Migrated all components to Sonner, removed shadcn Toaster
  - VideoUpload.tsx migrated from useToast to Sonner
  - AIStudioBlog.tsx migrated from useToast to Sonner
  - Removed shadcn Toaster from App.tsx

### Removed
- **Dead Code Cleanup**:
  - Removed deprecated `isTeacher` alias from useUserRole hook
  - Removed unused `__aiStudioBlogHandlers` window assignment
  
### Technical
- **TypeScript Improvements**: Created `getErrorMessage` utility in `src/lib/errorUtils.ts`
  - Replaced 12 instances of `catch (error: any)` with type-safe error handling
  - Consistent error message extraction across edge functions and hooks

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
  - Updated CourseCard tests to match component's Spanish strings
  - All unit tests now pass consistently

## [2.9.3] - 2025-12-30

### Fixed
- **Code Quality**: Fixed 4 ESLint `prefer-const` errors

## [2.9.2] - 2025-12-30

### Added
- **CourseMembershipManager**: Instructors can now enroll students in private/unlisted courses
- **Dashboard Course Access**: Student dashboard now shows courses from BOTH purchases AND memberships
- **studentDashboard i18n**: Full Spanish translation for student dashboard
- **AvatarUpload Improvements**: 10MB limit, client-side compression, "Remove Photo" functionality

### Deprecated
- **InstructorContactForm**: Removed in favor of direct email links on instructor profiles

## [2.9.1] - 2025-12-30

### Fixed
- **InstructorSidebar**: Fixed alignment and sticky positioning issues
- **FoundersStorySection**: Fixed animation and scroll behavior bugs
- **ProgressCard**: Standardized hover effects

### Security
- Added `.env` files to `.gitignore` as best practice
- Completed security audit: 0 vulnerabilities found

## [2.9.0] - 2025-12-30

### Added
- Responsive mobile navigation with hamburger menu
- Design system with warm coral/salmon color palette
- Hero background with animated blobs
- Framer Motion animations throughout the UI
- Standardized card components with consistent styling

## [Earlier Versions]

See `DEVELOPMENT_PLAN.md` for details on v1.0 - v2.8 releases.
