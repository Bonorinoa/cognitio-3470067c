-- v1.3 Course Visibility System

-- Step 1: Create course_visibility enum
CREATE TYPE course_visibility AS ENUM ('public', 'private', 'unlisted');

-- Step 2: Add visibility column to courses table (default: public for backward compatibility)
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS visibility course_visibility DEFAULT 'public';

-- Step 3: Create course_memberships table for private course enrollment
CREATE TABLE public.course_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  enrolled_by uuid REFERENCES auth.users(id), -- instructor who enrolled the student
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_id, user_id)
);

-- Step 4: Enable RLS on course_memberships
ALTER TABLE public.course_memberships ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies for course_memberships
-- Instructors can view memberships for their own courses
CREATE POLICY "Instructors can view own course memberships"
ON public.course_memberships
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM courses 
  WHERE courses.id = course_memberships.course_id 
  AND courses.instructor_id = auth.uid()
));

-- Instructors can add members to their own courses
CREATE POLICY "Instructors can add members to own courses"
ON public.course_memberships
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM courses 
  WHERE courses.id = course_memberships.course_id 
  AND courses.instructor_id = auth.uid()
));

-- Instructors can remove members from their own courses
CREATE POLICY "Instructors can remove members from own courses"
ON public.course_memberships
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM courses 
  WHERE courses.id = course_memberships.course_id 
  AND courses.instructor_id = auth.uid()
));

-- Users can view their own memberships
CREATE POLICY "Users can view own memberships"
ON public.course_memberships
FOR SELECT
USING (auth.uid() = user_id);

-- Step 6: Create a security definer function to check course access
CREATE OR REPLACE FUNCTION public.has_course_access(_user_id uuid, _course_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    -- User is the instructor
    SELECT 1 FROM courses WHERE id = _course_id AND instructor_id = _user_id
  ) OR EXISTS (
    -- User has purchased the course
    SELECT 1 FROM purchases WHERE course_id = _course_id AND user_id = _user_id
  ) OR EXISTS (
    -- User has been enrolled (membership) in the course
    SELECT 1 FROM course_memberships WHERE course_id = _course_id AND user_id = _user_id
  )
$$;

-- Step 7: Update courses RLS to respect visibility
DROP POLICY IF EXISTS "Published courses are viewable by everyone" ON public.courses;

CREATE POLICY "Courses are viewable based on visibility"
ON public.courses
FOR SELECT
USING (
  -- Instructor can always see their own courses
  (auth.uid() = instructor_id) OR
  -- Public courses that are published are visible to everyone
  (visibility = 'public' AND is_published = true) OR
  -- Unlisted courses are visible if accessed directly (anyone with the link)
  (visibility = 'unlisted' AND is_published = true) OR
  -- Private courses are visible to enrolled members
  (visibility = 'private' AND is_published = true AND has_course_access(auth.uid(), id))
);

-- Step 8: Update chapters RLS to respect course visibility
DROP POLICY IF EXISTS "Chapters of published courses are viewable" ON public.chapters;

CREATE POLICY "Chapters are viewable based on course visibility"
ON public.chapters
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM courses 
  WHERE courses.id = chapters.course_id 
  AND (
    -- Instructor can see their own course chapters
    courses.instructor_id = auth.uid() OR
    -- Public published courses
    (courses.visibility = 'public' AND courses.is_published = true) OR
    -- Unlisted published courses (direct link access)
    (courses.visibility = 'unlisted' AND courses.is_published = true) OR
    -- Private courses with access
    (courses.visibility = 'private' AND courses.is_published = true AND has_course_access(auth.uid(), courses.id))
  )
));

-- Step 9: Create index for performance
CREATE INDEX IF NOT EXISTS idx_course_memberships_course_id ON public.course_memberships(course_id);
CREATE INDEX IF NOT EXISTS idx_course_memberships_user_id ON public.course_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_courses_visibility ON public.courses(visibility);