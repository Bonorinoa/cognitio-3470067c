import { http, HttpResponse } from 'msw';

const SUPABASE_URL = 'https://hlnvfkturjctxbiikfoe.supabase.co';

// Mock data
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: { full_name: 'Test User' },
};

export const mockSession = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  user: mockUser,
};

export const mockCourses = [
  {
    id: 'course-1',
    title: 'Web Development Bootcamp',
    description: 'Learn web development from scratch',
    image_url: 'https://example.com/image.jpg',
    price: 99.99,
    category: 'Development',
    teacher_id: 'teacher-1',
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'course-2',
    title: 'React Masterclass',
    description: 'Master React.js',
    image_url: 'https://example.com/image2.jpg',
    price: 149.99,
    category: 'Development',
    teacher_id: 'teacher-1',
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockChapters = [
  {
    id: 'chapter-1',
    course_id: 'course-1',
    title: 'Introduction to HTML',
    description: 'Learn HTML basics',
    duration_seconds: 600,
    position: 0,
    is_free_preview: true,
    video_url: 'https://example.com/video1.mp4',
  },
  {
    id: 'chapter-2',
    course_id: 'course-1',
    title: 'CSS Fundamentals',
    description: 'Learn CSS basics',
    duration_seconds: 900,
    position: 1,
    is_free_preview: false,
    video_url: 'https://example.com/video2.mp4',
  },
];

export const mockPurchases = [
  {
    id: 'purchase-1',
    course_id: 'course-1',
    user_id: 'test-user-id',
    amount: 99.99,
    created_at: new Date().toISOString(),
  },
];

export const mockUserProgress = [
  {
    id: 'progress-1',
    user_id: 'test-user-id',
    chapter_id: 'chapter-1',
    is_completed: true,
    completed_at: new Date().toISOString(),
  },
];

export const handlers = [
  // Auth endpoints
  http.post(`${SUPABASE_URL}/auth/v1/token`, () => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      user: mockUser,
    });
  }),

  http.get(`${SUPABASE_URL}/auth/v1/user`, () => {
    return HttpResponse.json(mockUser);
  }),

  // REST endpoints - Courses
  http.get(`${SUPABASE_URL}/rest/v1/courses*`, ({ request }) => {
    const url = new URL(request.url);
    const select = url.searchParams.get('select');
    
    if (select?.includes('chapters')) {
      return HttpResponse.json(
        mockCourses.map((course) => ({
          ...course,
          chapters: mockChapters.filter((ch) => ch.course_id === course.id),
        }))
      );
    }
    return HttpResponse.json(mockCourses);
  }),

  http.post(`${SUPABASE_URL}/rest/v1/courses`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      id: 'new-course-id',
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }),

  // REST endpoints - Chapters
  http.get(`${SUPABASE_URL}/rest/v1/chapters*`, () => {
    return HttpResponse.json(mockChapters);
  }),

  http.post(`${SUPABASE_URL}/rest/v1/chapters`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown> | Record<string, unknown>[];
    if (Array.isArray(body)) {
      return HttpResponse.json(
        body.map((ch, i) => ({
          id: `new-chapter-${i}`,
          ...ch,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }))
      );
    }
    return HttpResponse.json({
      id: 'new-chapter-id',
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }),

  // REST endpoints - Purchases
  http.get(`${SUPABASE_URL}/rest/v1/purchases*`, () => {
    return HttpResponse.json(mockPurchases);
  }),

  // REST endpoints - User Progress
  http.get(`${SUPABASE_URL}/rest/v1/user_progress*`, () => {
    return HttpResponse.json(mockUserProgress);
  }),

  // REST endpoints - Profiles
  http.get(`${SUPABASE_URL}/rest/v1/profiles*`, () => {
    return HttpResponse.json([
      {
        id: 'test-user-id',
        email: 'test@example.com',
        full_name: 'Test User',
      },
    ]);
  }),
];
