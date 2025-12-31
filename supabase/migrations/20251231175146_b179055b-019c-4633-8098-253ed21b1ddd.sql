-- Fix get_public_profile to only return data for instructors
-- This prevents email harvesting by ensuring only instructor profiles are exposed

DROP FUNCTION IF EXISTS public.get_public_profile(uuid);

CREATE OR REPLACE FUNCTION public.get_public_profile(profile_id uuid)
RETURNS TABLE(
  id uuid, 
  full_name text, 
  avatar_url text, 
  bio text, 
  headline text, 
  affiliation text, 
  credentials text[], 
  linkedin_url text, 
  twitter_url text, 
  website_url text, 
  role text,
  email text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
    p.email
  FROM public.profiles p
  INNER JOIN public.user_roles ur ON ur.user_id = p.id
  WHERE p.id = profile_id
    AND ur.role = 'instructor'
  LIMIT 1;
$$;

COMMENT ON FUNCTION public.get_public_profile(uuid) IS 
'Returns public profile data including email for INSTRUCTORS ONLY. 
Returns NULL for non-instructor profiles. Used for instructor profile and services pages.';