-- Add missing columns to profiles table that the registration form expects
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS team_type text,
ADD COLUMN IF NOT EXISTS years_played integer,
ADD COLUMN IF NOT EXISTS dominant_foot text,
ADD COLUMN IF NOT EXISTS weight integer,
ADD COLUMN IF NOT EXISTS height integer,
ADD COLUMN IF NOT EXISTS latest_club text,
ADD COLUMN IF NOT EXISTS birth_year integer,
ADD COLUMN IF NOT EXISTS birth_month integer,
ADD COLUMN IF NOT EXISTS birth_day integer,
ADD COLUMN IF NOT EXISTS division text;