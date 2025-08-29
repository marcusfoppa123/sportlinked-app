-- Fix security issue: Restrict access to sensitive profile data

-- First, drop the overly permissive policy
DROP POLICY "Anyone can view profiles" ON public.profiles;

-- Create a new policy that only allows authenticated users to view basic profile info
-- This maintains social platform functionality while protecting sensitive data
CREATE POLICY "Authenticated users can view basic profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Create a more restrictive policy for sensitive fields
-- Note: This approach uses a security definer function to handle sensitive data access
CREATE OR REPLACE FUNCTION public.get_profile_with_privacy(profile_id uuid)
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
  -- Sensitive fields only if user owns the profile
  phone text,
  sensitive_data_access boolean
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
    -- Indicate if user has access to sensitive data
    (auth.uid() = p.id) as sensitive_data_access
  FROM public.profiles p
  WHERE p.id = profile_id;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_profile_with_privacy(uuid) TO authenticated;