-- Add soccer-specific fields to profiles table
ALTER TABLE profiles
ADD COLUMN dominant_foot TEXT,
ADD COLUMN weight INTEGER,
ADD COLUMN height INTEGER,
ADD COLUMN latest_club TEXT;

-- Add check constraints for dominant_foot, weight, and height
ALTER TABLE profiles
ADD CONSTRAINT valid_dominant_foot CHECK (dominant_foot IS NULL OR dominant_foot IN ('left', 'right')),
ADD CONSTRAINT valid_weight CHECK (weight IS NULL OR (weight >= 40 AND weight <= 130)),
ADD CONSTRAINT valid_height CHECK (height IS NULL OR (height >= 140 AND height <= 220)); 