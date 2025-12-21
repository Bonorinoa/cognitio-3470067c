# Platform Features

## Overview
Dark Bloom Learning is a comprehensive educational platform that enables teachers to create and sell courses while providing students with an engaging, interactive learning experience.

## User Roles

### Student Role
Students can browse, purchase, and complete courses on the platform.

### Teacher Role
Teachers can create courses, manage content, and track student engagement and revenue.

## Core Features

### 1. Authentication & User Management
- **Secure Authentication**
  - Email/password authentication via Supabase Auth
  - Session management with automatic token refresh
  - Protected routes requiring authentication
  - Role-based access control (student/teacher)
  
- **User Profiles**
  - Customizable profile information (name, avatar, email)
  - Role assignment (student/teacher)
  - Profile persistence across sessions

### 2. Landing Page (Index)
- **Hero Section**
  - Compelling value proposition
  - Eye-catching background imagery
  - Call-to-action buttons for sign-up and course browsing
  
- **Featured Courses**
  - Showcase of top courses
  - Course cards with images, prices, and metadata
  - Quick access to course details
  
- **Platform Statistics**
  - Display of key metrics (active learners, available courses, completion rate)
  - Social proof to build trust
  
- **Navigation**
  - Responsive navbar with logo
  - Dynamic menu based on authentication state
  - Quick access to sign in, browse courses, and user dashboard

### 3. Course Browsing & Discovery
- **Course Catalog (CoursesPage)**
  - Grid view of all available courses
  - Course filtering by category
  - Search functionality
  - Sorting options
  
- **Course Cards**
  - Course thumbnail image
  - Title and description
  - Price display
  - Category badge
  - Chapter count
  - Duration information
  - Progress indicator (for enrolled students)
  - Direct links to course details

### 4. Course Details & Enrollment
- **Course Page**
  - Detailed course information
  - Course curriculum (chapter list)
  - Teacher information
  - Course pricing
  - Enrollment status check
  - Purchase/enroll functionality
  
- **Chapter Preview**
  - Free preview chapters for prospective students
  - Chapter duration display
  - Locked/unlocked indicators
  - Sequential chapter ordering

### 5. Video Learning Experience
- **Video Player**
  - HTML5 video player with custom controls
  - Play/pause functionality
  - Progress bar with seek capability
  - Volume control
  - Fullscreen mode
  - Chapter navigation
  
- **Progress Tracking**
  - Automatic chapter completion tracking
  - Overall course progress calculation
  - Resume from last watched position
  - Visual progress indicators

### 6. Student Dashboard
- **Personalized Dashboard**
  - Welcome message with user's name
  - Quick access to enrolled courses
  - Course search functionality
  - Filter by course status (in-progress, completed)
  
- **Learning Statistics**
  - Courses enrolled count
  - Courses completed count
  - Total chapters completed
  - Overall progress percentage
  
- **Course Management**
  - View all enrolled courses
  - Continue learning from last position
  - Track completion status
  - Access course materials

### 7. Teacher Dashboard
- **Overview Dashboard**
  - Revenue analytics
  - Total students count
  - Active courses count
  - Recent activity feed
  
- **Course Management**
  - List of all created courses
  - Course status (published/draft)
  - Student enrollment numbers per course
  - Revenue per course
  - Quick actions (view, edit, analytics)
  
- **Recent Enrollments**
  - Real-time student enrollment tracking
  - Student information
  - Enrollment dates
  - Course association

### 8. Course Creation & Management
- **Create Course (CreateCourse)**
  - Multi-step course creation wizard
  - Course information form:
    - Title
    - Description
    - Category selection
    - Price setting
    - Course image upload
  
- **Chapter Management**
  - Add multiple chapters
  - Set chapter order/position
  - Chapter details:
    - Title
    - Description
    - Video URL
    - Duration
    - Free preview toggle
  - Drag-and-drop chapter reordering
  - Delete chapters
  
- **Publishing Controls**
  - Save as draft
  - Publish course
  - Unpublish course
  - Edit published courses

### 9. Payment Integration
- **Course Purchase Flow**
  - Secure checkout process
  - Stripe payment integration (configured)
  - Purchase confirmation
  - Automatic enrollment after payment
  - Purchase history tracking
  
- **Revenue Tracking**
  - Total revenue dashboard
  - Revenue per course
  - Payment history
  - Student purchase records

### 10. Progress & Analytics
- **Student Progress**
  - Per-chapter completion tracking
  - Course completion percentage
  - Time spent tracking
  - Completion timestamps
  
- **Teacher Analytics** (Dashboard)
  - Student enrollment trends
  - Course performance metrics
  - Revenue analytics
  - Engagement statistics

### 11. Responsive Design
- **Mobile-First Approach**
  - Fully responsive layouts
  - Touch-friendly interfaces
  - Mobile navigation drawer
  - Optimized media playback
  
- **Adaptive UI**
  - Desktop, tablet, and mobile views
  - Responsive grid layouts
  - Collapsible sidebars
  - Flexible typography

### 12. Theme Support
- **Dark/Light Mode**
  - System preference detection
  - Manual theme toggle
  - Persistent theme selection
  - Smooth theme transitions

### 13. Notifications & Feedback
- **Toast Notifications**
  - Success messages (enrollment, purchases, progress)
  - Error handling with user-friendly messages
  - Loading states
  - Action confirmations
  
- **Visual Feedback**
  - Loading skeletons
  - Progress indicators
  - Button states (loading, disabled)
  - Form validation messages

### 14. Navigation & Routing
- **Page Routes**
  - `/` - Landing page
  - `/auth` - Authentication page
  - `/dashboard` - Student dashboard
  - `/courses` - Course catalog
  - `/course/:id` - Course detail/player
  - `/teacher` - Teacher dashboard
  - `/teacher/courses` - Teacher course list
  - `/teacher/create` - Create new course
  - `/teacher/analytics` - Analytics dashboard
  - `/teacher/settings` - Teacher settings
  - `*` - 404 Not Found page
  
- **Navigation Components**
  - Global navbar with auth state
  - Teacher sidebar navigation
  - Breadcrumb navigation
  - Back navigation buttons

## Data Models

### Courses
- Unique identifier
- Title and description
- Category classification
- Pricing information
- Teacher association
- Publication status
- Timestamps
- Image/thumbnail URL
- Stripe integration IDs

### Chapters
- Unique identifier
- Course association
- Title and description
- Video URL/playback ID
- Duration in seconds
- Ordering position
- Free preview flag
- Timestamps

### User Progress
- User and chapter association
- Completion status
- Completion timestamp
- Progress percentage (calculated)

### Purchases
- User and course association
- Purchase amount
- Payment provider ID (Stripe)
- Purchase timestamp

### Profiles
- User information
- Full name and email
- Avatar URL
- Role (student/teacher)
- Timestamps

## Technical Features

### Performance
- Code splitting for optimal load times
- Lazy loading of routes
- Image optimization
- Efficient state management with React Query
- Caching strategies

### Security
- Row-level security in database
- Secure authentication tokens
- Environment variable protection
- CORS protection
- XSS prevention

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- ARIA labels and roles
- Focus management
- Semantic HTML structure

### Error Handling
- Graceful error states
- User-friendly error messages
- Automatic retry mechanisms
- Fallback UI components
- 404 page for invalid routes

## Future Enhancement Opportunities

### Potential Features
- **Live Classes** - Real-time video streaming
- **Assignments & Quizzes** - Interactive assessments
- **Certificates** - Course completion certificates
- **Discussion Forums** - Student-teacher communication
- **Course Reviews** - Rating and review system
- **Wishlists** - Save courses for later
- **Coupons & Discounts** - Promotional pricing
- **Bulk Purchases** - Corporate training packages
- **Mobile Apps** - Native iOS/Android applications
- **Content Drip** - Scheduled content release
- **Transcripts** - Video transcription and subtitles
- **Downloadable Resources** - PDF, slides, code files
- **Social Learning** - Study groups and peer interaction
- **Advanced Analytics** - Detailed engagement metrics
- **Email Notifications** - Course updates and reminders
- **Multi-language Support** - Internationalization

## Platform Capabilities

### Scalability
- Cloud-hosted database (Supabase)
- CDN-delivered static assets
- Horizontal scaling ready
- Optimized queries with indexes

### Maintainability
- TypeScript for type safety
- Component-based architecture
- Modular code organization
- Comprehensive test coverage
- ESLint code quality checks

### Extensibility
- Plugin-based architecture potential
- API-first design
- Customizable UI components
- Themeable styling system
- Webhook support for integrations
