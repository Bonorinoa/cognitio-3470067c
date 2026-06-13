
-- 1) Require instructor role to create a course
DROP POLICY IF EXISTS "Instructors can create courses" ON public.courses;
CREATE POLICY "Instructors can create courses"
  ON public.courses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = instructor_id
    AND public.has_role(auth.uid(), 'instructor'::app_role)
  );

-- 2) discussion_replies: service-role-only insert via role grant
DROP POLICY IF EXISTS "Service role can insert AI replies" ON public.discussion_replies;
CREATE POLICY "Service role can insert AI replies"
  ON public.discussion_replies
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- 3) ai_tutor_usage: service-role-only insert
DROP POLICY IF EXISTS "Service role can insert usage records" ON public.ai_tutor_usage;
CREATE POLICY "Service role can insert usage records"
  ON public.ai_tutor_usage
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- 4) chapter_transcripts: service-role-only manage
DROP POLICY IF EXISTS "Service role can manage transcripts" ON public.chapter_transcripts;
CREATE POLICY "Service role can manage transcripts"
  ON public.chapter_transcripts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
