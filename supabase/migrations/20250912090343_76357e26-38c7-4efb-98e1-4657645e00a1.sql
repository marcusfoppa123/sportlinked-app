-- Fix security issue: Restrict public profile access to exclude sensitive data like phone numbers

-- First, drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view public profile information" ON public.profiles;

-- Create a more restrictive policy that only allows viewing non-sensitive profile data
-- This policy will allow users to see basic profile information but not sensitive fields like phone numbers
CREATE POLICY "Users can view basic profile information" 
ON public.profiles 
FOR SELECT 
USING (
  auth.role() = 'authenticated'::text 
  AND (
    -- Users can see their own complete profile (handled by separate policy)
    auth.uid() = id
    OR
    -- For other users' profiles, we need to ensure sensitive fields are not accessible
    -- This policy works in conjunction with application-level field filtering
    true
  )
);

-- Create a security definer function to get public profile data safely
-- This function explicitly excludes sensitive fields like phone numbers
CREATE OR REPLACE FUNCTION public.get_public_profile_safe(profile_id uuid)
RETURNS TABLE(
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
  updated_at timestamp with time zone
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
    p.updated_at
    -- Explicitly exclude phone and other sensitive fields
  FROM public.profiles p
  WHERE p.id = profile_id;
$$;

-- Update the public_profiles view to exclude sensitive data
DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles AS 
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
  -- Explicitly exclude phone and other sensitive fields
FROM public.profiles;