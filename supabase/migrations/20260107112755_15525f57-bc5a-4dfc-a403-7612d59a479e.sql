-- Allow instructors to view user progress for chapters in their courses
CREATE POLICY "Instructors can view progress for their course chapters" 
ON user_progress FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM chapters ch
    JOIN courses c ON c.id = ch.course_id
    WHERE ch.id = user_progress.chapter_id
    AND c.instructor_id = auth.uid()
  )
);