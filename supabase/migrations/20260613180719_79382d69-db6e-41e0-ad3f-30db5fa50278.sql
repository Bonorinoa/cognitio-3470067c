
DROP POLICY IF EXISTS "Authenticated users can view course ratings" ON public.course_ratings;
CREATE POLICY "Anyone can view course ratings"
ON public.course_ratings
FOR SELECT
USING (true);
