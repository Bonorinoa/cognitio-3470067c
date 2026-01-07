-- Drop the incorrect policy
DROP POLICY IF EXISTS "Users can rate purchased courses" ON course_ratings;

-- Create corrected policy with proper parameter order (auth.uid() first, then course_id)
CREATE POLICY "Users can rate purchased courses"
  ON course_ratings
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND has_course_access(auth.uid(), course_id)
  );