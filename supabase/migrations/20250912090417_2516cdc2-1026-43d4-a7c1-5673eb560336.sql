-- Fix security linter issues

-- Fix search_path for existing functions that don't have it set
-- This prevents search path attacks

-- Update the get_public_profile_data function to set search_path
CREATE OR REPLACE FUNCTION public.get_public_profile_data(profile_id uuid)
 RETURNS TABLE(id uuid, username text, full_name text, avatar_url text, role text, bio text, location text, sport text, "position" text, experience text, followers integer, following integer, connections integer, posts integer, created_at timestamp with time zone)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
    p.followers,
    p.following,
    p.connections,
    p.posts,
    p.created_at
  FROM public.profiles p
  WHERE p.id = profile_id;
$function$;

-- Update the get_profile_with_privacy function to set search_path  
CREATE OR REPLACE FUNCTION public.get_profile_with_privacy(profile_id uuid)
 RETURNS TABLE(id uuid, username text, full_name text, avatar_url text, role text, bio text, location text, sport text, "position" text, experience text, team_size text, founded_year text, home_venue text, website text, followers integer, following integer, connections integer, posts integer, offers integer, ppg numeric, apg numeric, rpg numeric, games integer, win_percentage numeric, scout_type text, scout_team text, scout_sport text, scout_years_experience integer, created_at timestamp with time zone, updated_at timestamp with time zone, phone text, sensitive_data_access boolean)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

-- Update other existing functions to have proper search_path
CREATE OR REPLACE FUNCTION public.get_safe_profile(profile_id uuid)
 RETURNS TABLE(id uuid, username text, full_name text, avatar_url text, role text, bio text, location text, sport text, "position" text, experience text, team_size text, founded_year text, home_venue text, website text, followers integer, following integer, connections integer, posts integer, offers integer, ppg numeric, apg numeric, rpg numeric, games integer, win_percentage numeric, scout_type text, scout_team text, scout_sport text, scout_years_experience integer, created_at timestamp with time zone, updated_at timestamp with time zone, phone text, is_own_profile boolean)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.get_profile_data(profile_id uuid)
 RETURNS TABLE(id uuid, username text, full_name text, avatar_url text, role text, bio text, location text, sport text, "position" text, experience text, team_size text, founded_year text, home_venue text, website text, followers integer, following integer, connections integer, posts integer, offers integer, ppg numeric, apg numeric, rpg numeric, games integer, win_percentage numeric, scout_type text, scout_team text, scout_sport text, scout_years_experience integer, created_at timestamp with time zone, updated_at timestamp with time zone, phone text, is_own_profile boolean)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;