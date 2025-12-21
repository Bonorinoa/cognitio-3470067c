# Technology Stack

## Overview
Dark Bloom Learning is a modern educational platform built with cutting-edge web technologies, providing a scalable and maintainable architecture for online learning.

## Core Technologies

### Frontend Framework
- **React 18.3.1** - Modern JavaScript library for building user interfaces
  - Hooks-based architecture
  - Concurrent rendering features
  - Component-based development

### Build Tools & Development
- **Vite 5.4.19** - Next-generation frontend build tool
  - Lightning-fast HMR (Hot Module Replacement)
  - Optimized production builds
  - ES modules-based development
- **TypeScript 5.8.3** - Strongly-typed JavaScript superset
  - Type safety throughout the codebase
  - Enhanced IDE support and autocompletion
  - Better code maintainability

### UI Framework & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
  - Responsive design utilities
  - Custom theme configuration
  - JIT (Just-In-Time) compiler
- **shadcn/ui** - High-quality, accessible React components
  - Built on Radix UI primitives
  - Customizable component library
  - 40+ pre-built components including:
    - Dialogs, Dropdowns, Modals
    - Forms, Inputs, Selects
    - Navigation components
    - Data display components
- **Radix UI** - Unstyled, accessible component primitives
  - WAI-ARIA compliant
  - Keyboard navigation support
  - Focus management
- **Lucide React 0.462.0** - Beautiful, consistent icon library
- **next-themes 0.3.0** - Theme management for dark/light modes

### Backend & Database
- **Supabase 2.89.0** - Open-source Firebase alternative
  - PostgreSQL database
  - Real-time subscriptions
  - Row-level security
  - Built-in authentication
  - RESTful API & GraphQL support

#### Database Schema
The platform uses the following main tables:
- **profiles** - User profile information (role, avatar, full name)
- **courses** - Course metadata (title, description, price, category)
- **chapters** - Course content structure (videos, order, duration)
- **purchases** - Course enrollment tracking
- **user_progress** - Chapter completion tracking

### State Management & Data Fetching
- **TanStack Query (React Query) 5.83.0** - Powerful data synchronization
  - Server state management
  - Automatic caching and refetching
  - Optimistic updates
  - Request deduplication

### Routing
- **React Router DOM 6.30.1** - Declarative routing for React
  - Nested routing support
  - Dynamic route matching
  - Navigation guards
  - URL parameter handling

### Form Management
- **React Hook Form 7.61.1** - Performant form library
  - Minimal re-renders
  - Built-in validation
  - Easy integration with UI libraries
- **Zod 3.25.76** - TypeScript-first schema validation
  - Runtime type checking
  - Schema composition
  - Error message customization
- **@hookform/resolvers 3.10.0** - Validation resolvers for React Hook Form

### Data Visualization
- **Recharts 2.15.4** - Composable charting library
  - Responsive charts
  - Multiple chart types
  - Customizable styling
  - Animation support

### Media Handling
- **Embla Carousel React 8.6.0** - Lightweight carousel library
  - Touch/swipe support
  - Keyboard navigation
  - Customizable transitions

### Additional UI Libraries
- **date-fns 3.6.0** - Modern JavaScript date utility library
- **react-day-picker 8.10.1** - Date picker component
- **cmdk 1.1.1** - Command menu component (⌘K interface)
- **sonner 1.7.4** - Toast notification system
- **vaul 0.9.9** - Drawer component for mobile
- **input-otp 1.4.2** - OTP input component
- **class-variance-authority 0.7.1** - Variant-based styling utility
- **clsx 2.1.1** - Utility for constructing className strings
- **tailwind-merge 2.6.0** - Merge Tailwind CSS classes

## Testing Infrastructure

### Testing Framework
- **Vitest 4.0.16** - Fast, Vite-native unit test framework
  - Compatible with Jest APIs
  - Lightning-fast execution
  - Native ES modules support
  - Built-in code coverage

### Testing Utilities
- **@testing-library/react 16.3.1** - React testing utilities
  - Component testing best practices
  - User-centric queries
  - Async utilities
- **@testing-library/dom 10.4.1** - DOM testing utilities
- **@testing-library/jest-dom 6.9.1** - Custom Jest matchers
- **@testing-library/user-event 14.6.1** - User interaction simulation
- **jsdom 27.3.0** - JavaScript implementation of web standards
- **MSW (Mock Service Worker) 2.12.4** - API mocking library
  - Network-level request interception
  - Reusable mock definitions
  - Works in both Node.js and browsers

## Code Quality & Development Tools

### Linting & Formatting
- **ESLint 9.32.0** - JavaScript/TypeScript linting
  - Custom configuration
  - React-specific rules
  - TypeScript integration
- **@typescript-eslint** - TypeScript ESLint parser and rules
- **eslint-plugin-react-hooks 5.2.0** - React Hooks linting rules
- **eslint-plugin-react-refresh 0.4.20** - React Fast Refresh linting

### CSS Processing
- **PostCSS 8.5.6** - CSS transformation tool
- **Autoprefixer 10.4.21** - Automatic vendor prefix addition
- **@tailwindcss/typography 0.5.16** - Beautiful typographic defaults

### Build Configuration
- **@vitejs/plugin-react-swc 3.11.0** - React plugin using SWC
  - Faster compilation than Babel
  - Optimized for React Fast Refresh

## Development Workflow

### Package Management
- **npm** - Primary package manager
  - package-lock.json for reproducible builds
- **bun.lockb** - Alternative Bun runtime lockfile (optional)

### Available Scripts
```bash
npm run dev        # Start development server
npm run build      # Production build
npm run build:dev  # Development build
npm run lint       # Run ESLint
npm run preview    # Preview production build
npx vitest run     # Run test suite
```

## Browser Support
The application targets modern browsers with ES2020+ support:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations
- Code splitting via dynamic imports
- Tree shaking for minimal bundle size
- Image optimization
- Lazy loading of routes and components
- React concurrent features
- Optimistic UI updates with React Query

## Security Features
- Row-level security in Supabase
- Environment variable protection
- Secure authentication flow
- CORS protection
- XSS prevention through React's built-in escaping

## Accessibility
- WCAG 2.1 Level AA compliance (via Radix UI)
- Keyboard navigation support
- Screen reader compatibility
- ARIA labels and roles
- Focus management
- Semantic HTML

## Deployment
The application is configured for deployment to:
- Lovable platform (primary)
- Static hosting services (Vercel, Netlify, etc.)
- CDN-based distribution

## Environment Configuration
Required environment variables:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

See `.env` file for configuration details.
