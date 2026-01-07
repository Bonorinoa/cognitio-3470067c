-- Add policy to allow instructors to view purchases for their courses
CREATE POLICY "Instructors can view purchases for their courses" 
ON purchases FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM courses 
    WHERE courses.id = purchases.course_id 
    AND courses.instructor_id = auth.uid()
  )
);