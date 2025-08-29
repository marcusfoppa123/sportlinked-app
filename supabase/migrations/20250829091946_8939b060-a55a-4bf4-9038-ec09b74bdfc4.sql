-- Create a more secure RLS policy that restricts sensitive field access at database level
-- First, drop the current policy that still allows full access
DROP POLICY "Users can view profiles with privacy protection" ON public.profiles;

-- Create a policy that only allows users to see their own complete profile data
CREATE POLICY "Users can only see their own complete profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- Create a separate policy for public profile data (non-sensitive fields only)
-- We'll handle this through a secure view instead of direct table access
CREATE POLICY "Limited public profile access for others" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  -- Only allow access to own profile for full data
  auth.uid() = id
);

-- Create a secure view that excludes sensitive data for public consumption
CREATE OR REPLACE VIEW public.safe_profiles AS
SELECT 
  id,
  username,
  full_name,
  avatar_url,
  role,
  bio,
  location,
  sport,
  "position",
  experience,
  team_size,
  founded_year,
  home_venue,
  website,
  followers,
  following,
  connections,
  posts,
  offers,
  ppg,
  apg,
  rpg,
  games,
  win_percentage,
  scout_type,
  scout_team,
  scout_sport,
  scout_years_experience,
  created_at,
  updated_at,
  -- Never expose phone numbers in this view
  NULL as phone
FROM public.profiles;

-- Set security invoker for the view
ALTER VIEW public.safe_profiles SET (security_invoker = true);

-- Grant access to the safe view for authenticated users
GRANT SELECT ON public.safe_profiles TO authenticated;

-- Update the get_safe_profile function to be the primary way to access profile data
CREATE OR REPLACE FUNCTION public.get_profile_data(profile_id uuid)
RETURNS TABLE (
  id uuid,
  username text,
  full_name text,
  avatar_url text,
  role text,
  bio text,
  location text,
  sport text,
  "position" text,
  experience text,
  team_size text,
  founded_year text,
  home_venue text,
  website text,
  followers integer,
  following integer,
  connections integer,
  posts integer,
  offers integer,
  ppg numeric,
  apg numeric,
  rpg numeric,
  games integer,
  win_percentage numeric,
  scout_type text,
  scout_team text,
  scout_sport text,
  scout_years_experience integer,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  phone text,
  is_own_profile boolean
) 
LANGUAGE sql 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.username,
    p.full_name,
    p.avatar_url,
    p.role,
    p.bio,
    p.location,
    p.sport,
    p."position",
    p.experience,
    p.team_size,
    p.founded_year,
    p.home_venue,
    p.website,
    p.followers,
    p.following,
    p.connections,
    p.posts,
    p.offers,
    p.ppg,
    p.apg,
    p.rpg,
    p.games,
    p.win_percentage,
    p.scout_type,
    p.scout_team,
    p.scout_sport,
    p.scout_years_experience,
    p.created_at,
    p.updated_at,
    -- Critical: Only return phone if user owns the profile
    CASE WHEN auth.uid() = p.id THEN p.phone ELSE NULL END as phone,
    -- Indicate if this is the user's own profile
    (auth.uid() = p.id) as is_own_profile
  FROM public.profiles p
  WHERE p.id = profile_id;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_profile_data(uuid) TO authenticated;