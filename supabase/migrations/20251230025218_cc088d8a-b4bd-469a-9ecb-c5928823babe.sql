-- Drop the SECURITY DEFINER view and recreate without it
DROP VIEW IF EXISTS public.public_profiles;

-- Recreate the view as SECURITY INVOKER (default, safer)
CREATE VIEW public.public_profiles 
WITH (security_invoker = true)
AS
SELECT 
  id,
  full_name,
  avatar_url,
  bio,
  headline,
  affiliation,
  credentials,
  linkedin_url,
  twitter_url,
  website_url,
  role,
  created_at,
  updated_at
FROM public.profiles;

-- Grant access to the view
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Also add a policy so authenticated users can view public profile info (without email)
CREATE POLICY "Authenticated users can view public profile data"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- But we need a function to get profile without email for public access
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_id uuid)
RETURNS TABLE (
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
  role text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
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
    p.role
  FROM public.profiles p
  WHERE p.id = profile_id;
$$;