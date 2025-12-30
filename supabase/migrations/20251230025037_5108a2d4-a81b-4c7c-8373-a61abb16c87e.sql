-- Drop the existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create a new policy that allows public access but only to non-sensitive fields
-- Users can see their own complete profile, others can only see public info
CREATE POLICY "Users can view own full profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Create a view for public profile data that excludes email
CREATE OR REPLACE VIEW public.public_profiles AS
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