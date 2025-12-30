-- v1.2 Migration Part 2: Add instructor_id, migrate data, update RLS policies

-- Step 1: Add instructor_id column to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS instructor_id uuid;

-- Step 2: Migrate existing data from teacher_id to instructor_id
UPDATE public.courses SET instructor_id = teacher_id WHERE instructor_id IS NULL;

-- Step 3: Add NOT NULL constraint
ALTER TABLE public.courses ALTER COLUMN instructor_id SET NOT NULL;

-- Step 4: Migrate existing 'teacher' roles to 'instructor' in user_roles table
UPDATE public.user_roles SET role = 'instructor' WHERE role = 'teacher';

-- Step 5: Update RLS policies on courses table to use instructor_id
DROP POLICY IF EXISTS "Published courses are viewable by everyone" ON public.courses;
DROP POLICY IF EXISTS "Teachers can create courses" ON public.courses;
DROP POLICY IF EXISTS "Teachers can update own courses" ON public.courses;
DROP POLICY IF EXISTS "Teachers can delete own courses" ON public.courses;

CREATE POLICY "Published courses are viewable by everyone" 
ON public.courses 
FOR SELECT 
USING ((is_published = true) OR (auth.uid() = instructor_id));

CREATE POLICY "Instructors can create courses" 
ON public.courses 
FOR INSERT 
WITH CHECK (auth.uid() = instructor_id);

CREATE POLICY "Instructors can update own courses" 
ON public.courses 
FOR UPDATE 
USING (auth.uid() = instructor_id);

CREATE POLICY "Instructors can delete own courses" 
ON public.courses 
FOR DELETE 
USING (auth.uid() = instructor_id);

-- Step 6: Update RLS policies on chapters table to use instructor_id
DROP POLICY IF EXISTS "Chapters of published courses are viewable" ON public.chapters;
DROP POLICY IF EXISTS "Teachers can manage own course chapters" ON public.chapters;
DROP POLICY IF EXISTS "Teachers can update own course chapters" ON public.chapters;
DROP POLICY IF EXISTS "Teachers can delete own course chapters" ON public.chapters;

CREATE POLICY "Chapters of published courses are viewable" 
ON public.chapters 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM courses 
  WHERE courses.id = chapters.course_id 
  AND (courses.is_published = true OR courses.instructor_id = auth.uid())
));

CREATE POLICY "Instructors can manage own course chapters" 
ON public.chapters 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM courses 
  WHERE courses.id = chapters.course_id 
  AND courses.instructor_id = auth.uid()
));

CREATE POLICY "Instructors can update own course chapters" 
ON public.chapters 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM courses 
  WHERE courses.id = chapters.course_id 
  AND courses.instructor_id = auth.uid()
));

CREATE POLICY "Instructors can delete own course chapters" 
ON public.chapters 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM courses 
  WHERE courses.id = chapters.course_id 
  AND courses.instructor_id = auth.uid()
));