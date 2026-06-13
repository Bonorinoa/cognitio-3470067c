
-- 1) course_ratings: only authenticated users can read
DROP POLICY IF EXISTS "Anyone can view course ratings" ON public.course_ratings;
CREATE POLICY "Authenticated users can view course ratings"
ON public.course_ratings
FOR SELECT
TO authenticated
USING (true);

-- 2) Remove discussion_votes from realtime publication to prevent leaking other users' votes
ALTER PUBLICATION supabase_realtime DROP TABLE public.discussion_votes;

-- 3) Tighten resources bucket SELECT: only the uploader OR users with access to the chapter's course
DROP POLICY IF EXISTS "Authenticated users can read resources" ON storage.objects;
CREATE POLICY "Resource access restricted to owner or course members"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'resources'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR EXISTS (
      SELECT 1
      FROM public.chapters c
      WHERE c.id::text = (storage.foldername(name))[2]
        AND public.has_course_access(auth.uid(), c.course_id)
    )
  )
);
