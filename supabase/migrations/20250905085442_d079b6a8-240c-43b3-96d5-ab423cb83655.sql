-- SECURITY FIX: Remove unsafe safe_profiles view
-- This view contains sensitive user data (phone numbers, avatars, personal info) 
-- without any RLS policies, making it a security vulnerability.
-- Since it's not used in the application code, we'll drop it safely.

DROP VIEW IF EXISTS public.safe_profiles CASCADE;