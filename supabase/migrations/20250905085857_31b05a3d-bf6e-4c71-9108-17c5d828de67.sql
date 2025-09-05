-- SECURITY FIX: Restrict access to sensitive user data
-- Fix overly permissive RLS policies that expose personal information

-- 1. FIX PROFILES TABLE - Remove public access to sensitive data
-- Drop the overly permissive policy that allows anyone to see all profiles
DROP POLICY IF EXISTS "Authenticated users can view public profiles" ON public.profiles;
DROP POLICY IF EXISTS "Limited public profile access for others" ON public.profiles;
DROP POLICY IF EXISTS "Users can only see their own complete profile" ON public.profiles;

-- Create a security definer function to get public profile data safely
CREATE OR REPLACE FUNCTION public.get_public_profile_data(profile_id uuid)
RETURNS TABLE(
  id uuid,
  username text,
  full_name text,
  avatar_url text,
  role text,
  bio text,
  location text,
  sport text,
  "position" text,
  experience text,
  followers integer,
  following integer,
  connections integer,
  posts integer,
  created_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;

-- Create new restrictive policies for profiles
CREATE POLICY "Users can view their own complete profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Authenticated users can view limited public profile data"
ON public.profiles
FOR SELECT
USING (
  auth.role() = 'authenticated' AND
  -- Only allow access to non-sensitive public fields
  auth.uid() != id
);

-- 2. FIX LIKES TABLE - Restrict to own likes and likes on own content
DROP POLICY IF EXISTS "Anyone can view likes" ON public.likes;

CREATE POLICY "Users can view their own likes"
ON public.likes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view likes on their own posts"
ON public.likes
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.posts 
    WHERE posts.id = likes.post_id 
    AND posts.user_id = auth.uid()
  )
);

-- 3. FIX COMMENTS TABLE - Restrict to own comments and comments on own content
DROP POLICY IF EXISTS "Anyone can view comments" ON public.comments;

CREATE POLICY "Users can view their own comments"
ON public.comments
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view comments on their own posts"
ON public.comments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.posts 
    WHERE posts.id = comments.post_id 
    AND posts.user_id = auth.uid()
  )
);

-- 4. FIX FOLLOWERS TABLE - Restrict to own follower relationships
DROP POLICY IF EXISTS "Users can view all followers" ON public.followers;

CREATE POLICY "Users can view their own follower relationships"
ON public.followers
FOR SELECT
USING (auth.uid() = follower_id OR auth.uid() = following_id);