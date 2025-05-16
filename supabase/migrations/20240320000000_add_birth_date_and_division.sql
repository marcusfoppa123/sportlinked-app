-- Add birth date and division fields to profiles table
ALTER TABLE profiles
ADD COLUMN birth_year INTEGER,
ADD COLUMN birth_month INTEGER,
ADD COLUMN birth_day INTEGER,
ADD COLUMN division TEXT;

-- Add check constraints for birth date fields
ALTER TABLE profiles
ADD CONSTRAINT valid_birth_year CHECK (birth_year >= 1900 AND birth_year <= EXTRACT(YEAR FROM CURRENT_DATE)),
ADD CONSTRAINT valid_birth_month CHECK (birth_month >= 1 AND birth_month <= 12),
ADD CONSTRAINT valid_birth_day CHECK (birth_day >= 1 AND birth_day <= 31);

-- Add index for division field
CREATE INDEX idx_profiles_division ON profiles(division); 