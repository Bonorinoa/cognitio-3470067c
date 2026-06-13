DROP POLICY IF EXISTS "Courses are viewable based on visibility" ON public.courses;

CREATE POLICY "Courses are viewable based on visibility"
ON public.courses
FOR SELECT
USING (
  auth.uid() = instructor_id
  OR (visibility = 'public'::course_visibility AND is_published = true)
  OR (visibility = 'unlisted'::course_visibility AND is_published = true)
  OR (visibility = 'private'::course_visibility AND is_published = true AND has_course_access(auth.uid(), id))
);