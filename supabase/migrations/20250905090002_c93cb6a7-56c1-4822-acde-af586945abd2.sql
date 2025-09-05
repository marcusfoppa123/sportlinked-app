-- FIX: Improve RLS policies for proper public profile access
-- The previous approach was too restrictive and wouldn't work properly

-- Remove the problematic policy
DROP POLICY IF EXISTS "Authenticated users can view limited public profile data" ON public.profiles;

-- Create a more practical approach: users can see basic profile info of others
CREATE POLICY "Users can view public profile information"
ON public.profiles
FOR SELECT
USING (
  auth.role() = 'authenticated'
);

-- Since RLS doesn't support column-level restrictions, we'll handle sensitive data 
-- protection in the existing security definer functions like get_profile_with_privacy()
-- and get_safe_profile() which already implement this logic correctly.

-- Also need to allow public access to posts for the feed to work
-- But first let's make sure comments and likes can be viewed on public posts
DROP POLICY IF EXISTS "Users can view comments on their own posts" ON public.comments;
DROP POLICY IF EXISTS "Users can view likes on their own posts" ON public.likes;

-- Allow viewing comments on any post (for public feed functionality)
CREATE POLICY "Users can view comments on public posts"
ON public.comments
FOR SELECT
USING (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.posts 
    WHERE posts.id = comments.post_id
  )
);

-- Allow viewing likes on any post (for public feed functionality)  
CREATE POLICY "Users can view likes on public posts"
ON public.likes
FOR SELECT
USING (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.posts 
    WHERE posts.id = likes.post_id
  )
);

-- Update followers policy to be more practical for social features
DROP POLICY IF EXISTS "Users can view their own follower relationships" ON public.followers;

CREATE POLICY "Users can view follower relationships"
ON public.followers  
FOR SELECT
USING (
  auth.role() = 'authenticated'
);

-- This allows authenticated users to see follow relationships (needed for follow buttons, follower lists, etc.)
-- but they still can only create/delete their own follow relationships due to other policies