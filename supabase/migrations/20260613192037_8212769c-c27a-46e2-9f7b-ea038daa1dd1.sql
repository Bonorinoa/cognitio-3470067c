
-- 1. Purchases: remove user-INSERT policy (Stripe webhook uses service role and bypasses RLS)
DROP POLICY IF EXISTS "Users can create purchases" ON public.purchases;

-- 2. Profiles: drop unused 'role' column (privilege escalation surface)
--    Recreate get_public_profile without it first to avoid dependency errors.
DROP FUNCTION IF EXISTS public.get_public_profile(uuid);

CREATE OR REPLACE FUNCTION public.get_public_profile(profile_id uuid)
 RETURNS TABLE(id uuid, full_name text, avatar_url text, bio text, headline text, affiliation text, credentials text[], linkedin_url text, twitter_url text, website_url text, email text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.full_name,
    p.avatar_url,
    p.bio,
    p.headline,
    p.affiliation,
    p.credentials,
    p.linkedin_url,
    p.twitter_url,
    p.website_url,
    CASE WHEN auth.uid() IS NULL THEN NULL ELSE p.email END AS email
  FROM public.profiles p
  INNER JOIN public.user_roles ur ON ur.user_id = p.id
  WHERE p.id = profile_id
    AND ur.role = 'instructor'
  LIMIT 1;
END;
$function$;

ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- 3. Chapters: stricter SELECT — require course access, or free preview, or be the instructor
DROP POLICY IF EXISTS "Chapters are viewable based on course visibility" ON public.chapters;

CREATE POLICY "Chapters are viewable based on access"
ON public.chapters
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = chapters.course_id
      AND (
        -- Instructor owns the course
        c.instructor_id = auth.uid()
        -- Free-preview chapter on a published public/unlisted course
        OR (
          c.is_published = true
          AND chapters.is_free_preview = true
          AND c.visibility IN ('public'::course_visibility, 'unlisted'::course_visibility)
        )
        -- Authenticated user with course access (purchased or enrolled)
        OR (
          c.is_published = true
          AND auth.uid() IS NOT NULL
          AND public.has_course_access(auth.uid(), c.id)
        )
      )
  )
);

-- 4. Storage: restrict course-images uploads to instructors
DROP POLICY IF EXISTS "Users can upload course images" ON storage.objects;

CREATE POLICY "Instructors can upload course images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'course-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND public.has_role(auth.uid(), 'instructor'::public.app_role)
);
