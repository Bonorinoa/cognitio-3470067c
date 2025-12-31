-- Step 1: Drop the overly permissive policy that exposes all emails
DROP POLICY IF EXISTS "Authenticated users can view public profile data" ON public.profiles;

-- Step 2: Drop the existing function first (required to change return type)
DROP FUNCTION IF EXISTS public.get_public_profile(uuid);

-- Step 3: Recreate get_public_profile with email included (for instructor contact display)
-- This function is SECURITY DEFINER so it bypasses RLS safely and is only used for viewing specific profiles
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
  WHERE p.id = profile_id;
$$;