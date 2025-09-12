-- Fix the Security Definer View issue
-- The public_profiles view can bypass RLS policies, which is a security risk
-- Instead, we'll rely on the secure functions we've created

-- Drop the public_profiles view to resolve the security issue
DROP VIEW IF EXISTS public.public_profiles;

-- The security is now handled through the secure functions:
-- get_public_profile_safe() - for getting public profile data safely
-- get_profile_data() - for getting complete profile data with privacy checks
-- get_safe_profile() - for getting profile data with ownership checks
-- get_profile_with_privacy() - for getting profile data with privacy indicators

-- These functions properly enforce privacy rules and don't bypass RLS policies