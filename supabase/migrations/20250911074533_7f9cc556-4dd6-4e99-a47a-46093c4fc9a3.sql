-- Create bookmark_folders table
CREATE TABLE public.bookmark_folders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL,
  color text DEFAULT '#3B82F6', -- Default blue color
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on bookmark_folders
ALTER TABLE public.bookmark_folders ENABLE ROW LEVEL SECURITY;

-- Create policies for bookmark_folders
CREATE POLICY "Users can create their own bookmark folders" 
ON public.bookmark_folders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own bookmark folders" 
ON public.bookmark_folders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmark folders" 
ON public.bookmark_folders 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmark folders" 
ON public.bookmark_folders 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add folder_id to bookmarks table
ALTER TABLE public.bookmarks 
ADD COLUMN folder_id uuid REFERENCES public.bookmark_folders(id) ON DELETE SET NULL;

-- Create default "General" folder for existing bookmarks
CREATE OR REPLACE FUNCTION create_default_folders_for_existing_users()
RETURNS void AS $$
DECLARE
  user_record RECORD;
  default_folder_id uuid;
BEGIN
  -- Loop through all users who have bookmarks but no folders
  FOR user_record IN 
    SELECT DISTINCT user_id 
    FROM public.bookmarks 
    WHERE user_id NOT IN (
      SELECT user_id FROM public.bookmark_folders
    )
  LOOP
    -- Create default "General" folder for each user
    INSERT INTO public.bookmark_folders (user_id, name, color)
    VALUES (user_record.user_id, 'General', '#6B7280')
    RETURNING id INTO default_folder_id;
    
    -- Update all existing bookmarks for this user to use the default folder
    UPDATE public.bookmarks 
    SET folder_id = default_folder_id 
    WHERE user_id = user_record.user_id AND folder_id IS NULL;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to create default folders
SELECT create_default_folders_for_existing_users();

-- Drop the function as it's no longer needed
DROP FUNCTION create_default_folders_for_existing_users();