-- Fix: Drop the public_profiles view that lacks RLS protection
-- This view allows bulk enumeration of all profile data

-- Drop the view entirely - we'll use RPC functions instead
DROP VIEW IF EXISTS public.public_profiles;

-- Create a secure function to get instructor profiles for the catalog
-- This is a SECURITY DEFINER function that only returns instructor profiles
CREATE OR REPLACE FUNCTION public.get_instructor_catalog()
RETURNS TABLE (
  id uuid,
  full_name text,
  headline text,
  avatar_url text,
  credentials text[]
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.full_name,
    p.headline,
    p.avatar_url,
    p.credentials
  FROM public.profiles p
  INNER JOIN public.user_roles ur ON ur.user_id = p.id
  WHERE ur.role = 'instructor'
  ORDER BY p.full_name;
$$;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION public.get_instructor_catalog() TO authenticated, anon;

-- Add comment explaining the function purpose
COMMENT ON FUNCTION public.get_instructor_catalog() IS 
'Returns public profile data for instructors only. Used by the instructor catalog page. 
Does not expose email or other sensitive data. SECURITY DEFINER to bypass RLS.';
