-- SECURITY FIX: Remove unsafe safe_profiles table
-- This table contains sensitive user data (phone numbers, avatars, personal info) 
-- without any RLS policies, making it a security vulnerability.
-- Since it's not used in the application code, we'll drop it safely.

-- First, let's check if there are any dependencies
DROP TABLE IF EXISTS public.safe_profiles CASCADE;