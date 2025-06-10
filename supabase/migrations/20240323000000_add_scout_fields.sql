-- Add scout-specific fields to profiles table
ALTER TABLE profiles
ADD COLUMN scout_type TEXT,
ADD COLUMN scout_team TEXT,
ADD COLUMN scout_sport TEXT,
ADD COLUMN scout_years_experience INTEGER;

-- Add check constraints for scout fields
ALTER TABLE profiles
ADD CONSTRAINT valid_scout_type CHECK (scout_type IS NULL OR scout_type IN ('independent', 'team')),
ADD CONSTRAINT valid_scout_years_experience CHECK (scout_years_experience IS NULL OR (scout_years_experience >= 0 AND scout_years_experience <= 50));

-- Add index for scout fields
CREATE INDEX idx_profiles_scout_type ON profiles(scout_type);
CREATE INDEX idx_profiles_scout_sport ON profiles(scout_sport); 