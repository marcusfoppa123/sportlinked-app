-- Add unique constraint to prevent same email from being used with different roles
-- This ensures that each email address can only be associated with one role

-- First, let's add a comment to document this constraint
COMMENT ON TABLE public.profiles IS 'User profiles with role-specific data. Each user can only have one role.';

-- We cannot directly add a unique constraint on email since the profiles table doesn't store email
-- The email is stored in auth.users, but we need to ensure role consistency
-- Instead, we'll create a function to validate this during user creation

-- Create a function to prevent role changes for existing users
CREATE OR REPLACE FUNCTION public.prevent_role_change()
RETURNS TRIGGER AS $$
BEGIN
    -- If this is an update and role is being changed, prevent it
    IF TG_OP = 'UPDATE' AND OLD.role IS DISTINCT FROM NEW.role THEN
        RAISE EXCEPTION 'Cannot change user role after account creation. Original role: %, Attempted role: %', OLD.role, NEW.role;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to prevent role changes
DROP TRIGGER IF EXISTS prevent_role_change_trigger ON public.profiles;
CREATE TRIGGER prevent_role_change_trigger
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_role_change();