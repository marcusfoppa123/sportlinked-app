-- Add sport and position columns to profiles table
ALTER TABLE profiles
ADD COLUMN sport TEXT[],
ADD COLUMN position TEXT[];

-- Add check constraints for valid sports and positions
ALTER TABLE profiles
ADD CONSTRAINT valid_sports CHECK (
  sport IS NULL OR (
    sport <@ ARRAY['soccer', 'basketball', 'hockey']::TEXT[]
  )
);

ALTER TABLE profiles
ADD CONSTRAINT valid_positions CHECK (
  position IS NULL OR (
    position <@ ARRAY[
      'goalkeeper', 'right back', 'center back', 'left back',
      'left midfielder', 'right midfielder', 'central defending midfielder',
      'central attacking midfielder', 'striker', 'right wing', 'left wing'
    ]::TEXT[]
  )
); 