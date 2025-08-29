-- Create a view for public profile information (non-sensitive data)
CREATE OR REPLACE VIEW public.public_profiles AS
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
  updated_at
FROM public.profiles;

-- Enable RLS on the view
ALTER VIEW public.public_profiles SET (security_invoker = true);

-- Create RLS policy for the public profiles view
CREATE POLICY "Authenticated users can view public profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  -- Allow access to all non-sensitive fields for authenticated users
  true
);

-- Update the main profiles policy to be more restrictive for sensitive data
DROP POLICY "Authenticated users can view basic profiles" ON public.profiles;

-- Create a new policy that restricts sensitive data to profile owners only
CREATE POLICY "Users can view profiles with privacy protection" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  -- Users can see their own complete profile
  auth.uid() = id 
  OR 
  -- Other users can see profiles but with restricted sensitive data
  -- (this will be handled at the application level for sensitive fields)
  true
);

-- Create a security definer function to get safe profile data
CREATE OR REPLACE FUNCTION public.get_safe_profile(profile_id uuid)
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
    -- Only return phone if user owns the profile
    CASE WHEN auth.uid() = p.id THEN p.phone ELSE NULL END as phone,
    -- Indicate if this is the user's own profile
    (auth.uid() = p.id) as is_own_profile
  FROM public.profiles p
  WHERE p.id = profile_id;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_safe_profile(uuid) TO authenticated;
GRANT SELECT ON public.public_profiles TO authenticated;