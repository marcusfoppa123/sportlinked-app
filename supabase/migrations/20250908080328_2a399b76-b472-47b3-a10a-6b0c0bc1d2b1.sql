-- Fix the handle_new_user trigger function to remove non-existent email column references

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_role TEXT;
BEGIN
  -- We must delete the old profile that was created by the old trigger first
  DELETE FROM public.profiles WHERE id = NEW.id;

  user_role := NEW.raw_user_meta_data->>'role';

  IF user_role = 'scout' THEN
    INSERT INTO public.profiles (id, role, full_name, scout_type, scout_team, scout_sport, scout_years_experience, followers, following)
    VALUES (
      NEW.id,
      'scout',
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'scout_type',
      NEW.raw_user_meta_data->>'scout_team',
      NEW.raw_user_meta_data->>'scout_sport',
      NULLIF(NEW.raw_user_meta_data->>'scout_years_experience', '')::INTEGER,
      0,
      0
    );
  ELSE -- Handles 'athlete', 'team' and null/other roles
    INSERT INTO public.profiles (
      id, role, full_name,
      birth_year, birth_month, birth_day, 
      division, sport, "position", 
      experience, team_size, team_type, 
      years_played, dominant_foot, weight, height, latest_club,
      followers, following
    )
    VALUES (
      NEW.id,
      COALESCE(user_role, 'athlete'),
      NEW.raw_user_meta_data->>'full_name',
      NULLIF(NEW.raw_user_meta_data->>'birthYear', '')::INTEGER,
      NULLIF(NEW.raw_user_meta_data->>'birthMonth', '')::INTEGER,
      NULLIF(NEW.raw_user_meta_data->>'birthDay', '')::INTEGER,
      NEW.raw_user_meta_data->>'division',
      NEW.raw_user_meta_data->>'sport',
      NEW.raw_user_meta_data->>'position',
      NEW.raw_user_meta_data->>'experience',
      NEW.raw_user_meta_data->>'teamSize',
      NEW.raw_user_meta_data->>'teamType',
      NULLIF(NEW.raw_user_meta_data->>'yearsPlayed', '')::INTEGER,
      NEW.raw_user_meta_data->>'dominantFoot',
      NULLIF(NEW.raw_user_meta_data->>'weight', '')::INTEGER,
      NULLIF(NEW.raw_user_meta_data->>'height', '')::INTEGER,
      NEW.raw_user_meta_data->>'latestClub',
      0,
      0
    );
  END IF;
  
  RETURN NEW;
END;
$function$