-- Update courses RLS policy to remove unlisted references
DROP POLICY IF EXISTS "Courses are viewable based on visibility" ON public.courses;

CREATE POLICY "Courses are viewable based on visibility" 
ON public.courses 
FOR SELECT 
USING (
  (auth.uid() = instructor_id) OR
  (visibility = 'public' AND is_published = true) OR
  (visibility = 'private' AND is_published = true AND has_course_access(auth.uid(), id))
);

-- Update chapters RLS policy to remove unlisted references
DROP POLICY IF EXISTS "Chapters are viewable based on course visibility" ON public.chapters;

CREATE POLICY "Chapters are viewable based on course visibility" 
ON public.chapters 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = chapters.course_id
    AND (
      courses.instructor_id = auth.uid() OR
      (courses.visibility = 'public' AND courses.is_published = true) OR
      (courses.visibility = 'private' AND courses.is_published = true AND has_course_access(auth.uid(), courses.id))
    )
  )
);

-- Migrate any existing unlisted courses to private
UPDATE public.courses 
SET visibility = 'private' 
WHERE visibility = 'unlisted';