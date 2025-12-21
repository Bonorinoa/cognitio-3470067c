# Dark Bloom Learning Platform

A modern, full-featured educational platform enabling teachers to create and sell online courses while providing students with an engaging learning experience.

## 🚀 Features

- **Course Management**: Create, publish, and manage courses with video content
- **Video Learning**: Built-in video player with progress tracking
- **User Dashboards**: Separate dashboards for students and teachers
- **Payment Integration**: Stripe integration for course purchases
- **Progress Tracking**: Automatic tracking of student progress through courses
- **Analytics**: Revenue and enrollment analytics for teachers
- **Responsive Design**: Mobile-first, fully responsive interface
- **Dark/Light Mode**: Theme support with system preference detection
- **Authentication**: Secure authentication via Supabase

For a complete list of features, see [FEATURES.md](./FEATURES.md).

## 📚 Documentation

- **[TECHNOLOGY_STACK.md](./TECHNOLOGY_STACK.md)** - Comprehensive technology stack and dependencies
- **[FEATURES.md](./FEATURES.md)** - Detailed feature documentation
- **[TESTING.md](./TESTING.md)** - Testing infrastructure and guidelines

## 🛠️ Tech Stack

### Core Technologies
- **React 18.3.1** - UI library
- **TypeScript 5.8.3** - Type-safe development
- **Vite 5.4.19** - Build tool and dev server
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components

### Backend & Database
- **Supabase** - PostgreSQL database, authentication, and real-time subscriptions
- **TanStack Query** - Server state management and caching

### Key Libraries
- React Router DOM - Client-side routing
- React Hook Form + Zod - Form handling and validation
- Recharts - Data visualization
- MSW - API mocking for tests
- Vitest - Testing framework

For the complete technology stack, see [TECHNOLOGY_STACK.md](./TECHNOLOGY_STACK.md).

## 🏁 Getting Started

### Prerequisites
- Node.js 18+ and npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Supabase account and project (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bonorinoa/dark-bloom-learning.git
   cd dark-bloom-learning
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

## 📜 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run lint         # Run ESLint
npm run preview      # Preview production build
npx vitest run       # Run test suite
npx vitest           # Run tests in watch mode
```

## 🧪 Testing

The project uses Vitest with React Testing Library for comprehensive testing.

### Run Tests
```bash
# Run all tests
npx vitest run

# Run tests in watch mode
npx vitest

# Run tests with coverage
npx vitest run --coverage
```

### Test Coverage
- 6 test files with 47 tests
- 87% pass rate (41 passing, 6 failing)
- Components: CourseCard, ChapterList, Navbar
- Pages: Dashboard, TeacherDashboard, CreateCourse

For detailed testing documentation, see [TESTING.md](./TESTING.md).

## 📁 Project Structure

```
dark-bloom-learning/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components (routes)
│   ├── contexts/         # React contexts (Auth)
│   ├── hooks/            # Custom React hooks
│   ├── integrations/     # External service integrations
│   ├── lib/              # Utility functions
│   ├── test/             # Test utilities and mocks
│   └── assets/           # Static assets
├── public/               # Public static files
├── supabase/            # Supabase configuration
├── TECHNOLOGY_STACK.md  # Tech stack documentation
├── FEATURES.md          # Feature documentation
├── TESTING.md           # Testing documentation
└── package.json         # Dependencies and scripts
```

## 🔐 Environment Variables

Required environment variables:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

Optional variables for payment processing:
- Stripe keys (configured in Supabase)

## 🌐 Deployment

### Deploy with Lovable
Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click Share → Publish.

### Deploy to Other Platforms
The application can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

Build the production bundle:
```bash
npm run build
```

The built files will be in the `dist/` directory.

## 👥 User Roles

### Students
- Browse and search courses
- Purchase and enroll in courses
- Watch video lessons
- Track learning progress
- View personalized dashboard

### Teachers
- Create and publish courses
- Add chapters and video content
- Set pricing
- View analytics and revenue
- Track student enrollments

## 🤝 Contributing

### Development Workflow
1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Run tests and linting
5. Submit a pull request

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Vitest for testing

## 🔗 Links

- **Live Demo**: [Deploy to see live demo]
- **Documentation**: See the docs folder for detailed documentation
- **Supabase**: [supabase.com](https://supabase.com)
- **Lovable Platform**: [lovable.dev](https://lovable.dev)

## 📄 License

This project is part of the Lovable ecosystem and follows its licensing terms.

## 🆘 Support

For issues and questions:
1. Check the documentation files (TECHNOLOGY_STACK.md, FEATURES.md, TESTING.md)
2. Review existing GitHub issues
3. Open a new issue with detailed information

## 🎯 Development Roadmap

See [FEATURES.md](./FEATURES.md) for a list of potential future enhancements including:
- Live classes
- Assignments and quizzes
- Course certificates
- Discussion forums
- Mobile applications
- And more...
