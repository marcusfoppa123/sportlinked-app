-- Fix remaining security issues

-- Update the get_user_bookmark_folders function to set search_path
CREATE OR REPLACE FUNCTION public.get_user_bookmark_folders(p_user_id uuid)
 RETURNS TABLE(id uuid, name text, color text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT bf.id, bf.name, bf.color
  FROM public.bookmark_folders bf
  WHERE bf.user_id = p_user_id
  ORDER BY bf.created_at ASC;
END;
$function$;

-- Update the create_bookmark_folder function to set search_path
CREATE OR REPLACE FUNCTION public.create_bookmark_folder(p_user_id uuid, p_name text, p_color text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
  folder_id uuid;
BEGIN
  INSERT INTO public.bookmark_folders (user_id, name, color)
  VALUES (p_user_id, p_name, p_color)
  RETURNING id INTO folder_id;
  
  RETURN folder_id;
END;
$function$;

-- Update the handle_new_user trigger function to set search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
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
$function$;

-- Update the update_follower_counts trigger function to set search_path  
CREATE OR REPLACE FUNCTION public.update_follower_counts()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Increment following count for follower
        UPDATE public.profiles
        SET following = COALESCE(following, 0) + 1
        WHERE id = NEW.follower_id;
        
        -- Increment followers count for followed user
        UPDATE public.profiles
        SET followers = COALESCE(followers, 0) + 1
        WHERE id = NEW.following_id;
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrement following count for follower
        UPDATE public.profiles
        SET following = GREATEST(COALESCE(following, 0) - 1, 0)
        WHERE id = OLD.follower_id;
        
        -- Decrement followers count for followed user
        UPDATE public.profiles
        SET followers = GREATEST(COALESCE(followers, 0) - 1, 0)
        WHERE id = OLD.following_id;
    END IF;
    RETURN NULL;
END;
$function$;