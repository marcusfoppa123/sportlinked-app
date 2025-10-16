-- Add gender field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS gender text CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say'));

-- Create security definer function to check if user is a scout
CREATE OR REPLACE FUNCTION public.is_scout(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = user_id
      AND role = 'scout'
  )
$$;

-- Create function to search athletes with filters (only accessible by scouts)
CREATE OR REPLACE FUNCTION public.search_athletes_with_filters(
  p_search_query text DEFAULT NULL,
  p_gender text DEFAULT NULL,
  p_min_age integer DEFAULT NULL,
  p_max_age integer DEFAULT NULL,
  p_position text DEFAULT NULL,
  p_dominant_foot text DEFAULT NULL,
  p_division text DEFAULT NULL,
  p_min_years_played integer DEFAULT NULL,
  p_max_years_played integer DEFAULT NULL,
  p_min_height integer DEFAULT NULL,
  p_max_height integer DEFAULT NULL,
  p_min_weight integer DEFAULT NULL,
  p_max_weight integer DEFAULT NULL
)
RETURNS TABLE(
  id uuid,
  full_name text,
  username text,
  avatar_url text,
  role text,
  sport text,
  athlete_position text,
  gender text,
  birth_year integer,
  birth_month integer,
  birth_day integer,
  division text,
  years_played integer,
  dominant_foot text,
  height integer,
  weight integer,
  location text,
  bio text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_year integer;
BEGIN
  -- Check if the calling user is a scout
  IF NOT public.is_scout(auth.uid()) THEN
    RAISE EXCEPTION 'Only scouts can use advanced filtering';
  END IF;

  current_year := EXTRACT(YEAR FROM CURRENT_DATE);

  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.username,
    p.avatar_url,
    p.role,
    p.sport,
    p."position" as athlete_position,
    p.gender,
    p.birth_year,
    p.birth_month,
    p.birth_day,
    p.division,
    p.years_played,
    p.dominant_foot,
    p.height,
    p.weight,
    p.location,
    p.bio
  FROM public.profiles p
  WHERE p.role = 'athlete'
    -- Search query filter (name or username)
    AND (p_search_query IS NULL OR 
         p.full_name ILIKE '%' || p_search_query || '%' OR 
         p.username ILIKE '%' || p_search_query || '%')
    -- Gender filter
    AND (p_gender IS NULL OR p.gender = p_gender)
    -- Age filter (calculate from birth_year)
    AND (p_min_age IS NULL OR (p.birth_year IS NOT NULL AND (current_year - p.birth_year) >= p_min_age))
    AND (p_max_age IS NULL OR (p.birth_year IS NOT NULL AND (current_year - p.birth_year) <= p_max_age))
    -- Position filter
    AND (p_position IS NULL OR p."position" ILIKE '%' || p_position || '%')
    -- Dominant foot filter
    AND (p_dominant_foot IS NULL OR p.dominant_foot = p_dominant_foot)
    -- Division filter
    AND (p_division IS NULL OR p.division = p_division)
    -- Years played filter
    AND (p_min_years_played IS NULL OR (p.years_played IS NOT NULL AND p.years_played >= p_min_years_played))
    AND (p_max_years_played IS NULL OR (p.years_played IS NOT NULL AND p.years_played <= p_max_years_played))
    -- Height filter
    AND (p_min_height IS NULL OR (p.height IS NOT NULL AND p.height >= p_min_height))
    AND (p_max_height IS NULL OR (p.height IS NOT NULL AND p.height <= p_max_height))
    -- Weight filter
    AND (p_min_weight IS NULL OR (p.weight IS NOT NULL AND p.weight >= p_min_weight))
    AND (p_max_weight IS NULL OR (p.weight IS NOT NULL AND p.weight <= p_max_weight))
  ORDER BY p.full_name
  LIMIT 50;
END;
$$;