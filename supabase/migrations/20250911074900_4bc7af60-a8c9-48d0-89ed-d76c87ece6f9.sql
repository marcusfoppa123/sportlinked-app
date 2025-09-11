-- Create helper functions for folder management
CREATE OR REPLACE FUNCTION public.get_user_bookmark_folders(p_user_id uuid)
RETURNS TABLE(id uuid, name text, color text) AS $$
BEGIN
  RETURN QUERY
  SELECT bf.id, bf.name, bf.color
  FROM public.bookmark_folders bf
  WHERE bf.user_id = p_user_id
  ORDER BY bf.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.create_bookmark_folder(
  p_user_id uuid,
  p_name text,
  p_color text
)
RETURNS uuid AS $$
DECLARE
  folder_id uuid;
BEGIN
  INSERT INTO public.bookmark_folders (user_id, name, color)
  VALUES (p_user_id, p_name, p_color)
  RETURNING id INTO folder_id;
  
  RETURN folder_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;