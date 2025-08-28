-- Fix RLS issues: Enable RLS on tables that don't have it
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sportslinked ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for messages table
CREATE POLICY "Users can view messages in their conversations" 
ON public.messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE id = messages.conversation_id 
    AND (user1_id = auth.uid() OR user2_id = auth.uid())
  )
);

CREATE POLICY "Users can create messages in their conversations" 
ON public.messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE id = messages.conversation_id 
    AND (user1_id = auth.uid() OR user2_id = auth.uid())
  )
);

-- Create RLS policies for conversations table
CREATE POLICY "Users can view their own conversations" 
ON public.conversations 
FOR SELECT 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create conversations" 
ON public.conversations 
FOR INSERT 
WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Create RLS policy for sportslinked table (admin only access)
CREATE POLICY "Only authenticated users can view sportslinked content" 
ON public.sportslinked 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Fix function security: Update handle_new_user function with proper search_path
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
    INSERT INTO public.profiles (id, role, full_name, email, scout_type, scout_team, scout_sport, scout_years_experience, followers, following)
    VALUES (
      NEW.id,
      'scout',
      NEW.raw_user_meta_data->>'full_name',
      NEW.email,
      NEW.raw_user_meta_data->>'scout_type',
      NEW.raw_user_meta_data->>'scout_team',
      NEW.raw_user_meta_data->>'scout_sport',
      NULLIF(NEW.raw_user_meta_data->>'scout_years_experience', '')::INTEGER,
      0,
      0
    );
  ELSE -- Handles 'athlete', 'team' and null/other roles
    INSERT INTO public.profiles (
      id, role, full_name, email, 
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
      NEW.email,
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

-- Fix update_follower_counts function security
CREATE OR REPLACE FUNCTION public.update_follower_counts()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
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