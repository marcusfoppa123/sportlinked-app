-- Add years_played column to profiles table
ALTER TABLE profiles
ADD COLUMN years_played INTEGER;

-- Add a check constraint for valid years (1-18)
ALTER TABLE profiles
ADD CONSTRAINT valid_years_played CHECK (years_played IS NULL OR (years_played >= 1 AND years_played <= 18)); 