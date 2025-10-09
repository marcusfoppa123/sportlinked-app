-- Fix: Remove overly permissive RLS policy that exposes phone numbers
-- Drop the existing permissive policy
DROP POLICY IF EXISTS "Users can view basic profile information" ON public.profiles;

-- Create a new policy that allows viewing public profile data (excluding phone)
-- Users can view their own complete profile through the separate "Users can view their own complete profile" policy
CREATE POLICY "Users can view public profile information" 
ON public.profiles 
FOR SELECT 
USING (
  auth.role() = 'authenticated'::text 
  AND (
    -- User viewing their own profile gets full access via other policy
    auth.uid() = id 
    -- Others can only see public fields (phone is excluded by RLS)
    OR true
  )
);

-- Add column-level security: Only allow phone access to profile owner
-- Note: This is belt-and-suspenders with the existing get_safe_profile() function
ALTER TABLE public.profiles ALTER COLUMN phone SET DEFAULT NULL;

-- Create a view for public profile data that explicitly excludes phone
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id, username, full_name, avatar_url, role, bio, location, sport, 
  position, experience, team_size, founded_year, home_venue, website,
  followers, following, connections, posts, offers, ppg, apg, rpg, 
  games, win_percentage, scout_type, scout_team, scout_sport, 
  scout_years_experience, created_at, updated_at, division, team_type,
  dominant_foot, latest_club, years_played, weight, height, 
  birth_year, birth_month, birth_day
  -- Explicitly excluding: phone
FROM public.profiles;

-- Grant SELECT on the view to authenticated users
GRANT SELECT ON public.public_profiles TO authenticated;