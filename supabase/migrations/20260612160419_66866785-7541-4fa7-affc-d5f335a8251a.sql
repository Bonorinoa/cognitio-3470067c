
-- 1. Fix chapter_resources SELECT policy
DROP POLICY IF EXISTS "Users with course access can view resources" ON public.chapter_resources;
CREATE POLICY "Users with course access can view resources"
ON public.chapter_resources
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM chapters c
    JOIN courses co ON c.course_id = co.id
    WHERE c.id = chapter_resources.chapter_id
      AND (
        (co.visibility = 'public'::course_visibility AND co.is_published = true)
        OR public.has_course_access(auth.uid(), co.id)
      )
  )
);

-- 2. Restrict platform_settings to authenticated
DROP POLICY IF EXISTS "Anyone can read platform settings" ON public.platform_settings;
CREATE POLICY "Authenticated users can read platform settings"
ON public.platform_settings
FOR SELECT
TO authenticated
USING (true);

-- 3. Hide instructor email from anonymous callers
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_id uuid)
RETURNS TABLE(id uuid, full_name text, avatar_url text, bio text, headline text, affiliation text, credentials text[], linkedin_url text, twitter_url text, website_url text, role text, email text)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
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
    p.role,
    CASE WHEN auth.uid() IS NULL THEN NULL ELSE p.email END AS email
  FROM public.profiles p
  INNER JOIN public.user_roles ur ON ur.user_id = p.id
  WHERE p.id = profile_id
    AND ur.role = 'instructor'
  LIMIT 1;
END;
$$;
