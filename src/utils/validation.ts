import { z } from 'zod';

// Validation schema for post creation
export const postSchema = z.object({
  content: z.string().trim().max(5000, "Post content must be less than 5000 characters").optional(),
  hashtags: z.array(
    z.string()
      .regex(/^[a-zA-Z0-9_]+$/, "Hashtags can only contain letters, numbers, and underscores")
      .max(50, "Hashtag must be less than 50 characters")
  ).max(30, "Maximum 30 hashtags allowed").optional(),
  sport: z.enum(['Basketball', 'Football', 'Soccer', 'Baseball', 'Hockey', 'Tennis', 'Volleyball', 'Golf', 'Swimming', 'Track & Field', 'Wrestling', 'Gymnastics', 'none']).optional(),
});

// Validation schema for comments
export const commentSchema = z.object({
  content: z.string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment must be less than 1000 characters"),
});

// Validation schema for profile updates
export const profileUpdateSchema = z.object({
  full_name: z.string().max(100, "Name must be less than 100 characters").optional(),
  username: z.string()
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .max(30, "Username must be less than 30 characters")
    .optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  location: z.string().max(100, "Location must be less than 100 characters").optional(),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .optional()
    .or(z.literal('')),
  website: z.string()
    .url("Invalid website URL")
    .max(255, "Website URL must be less than 255 characters")
    .optional()
    .or(z.literal('')),
  sport: z.string().max(50).optional(),
  position: z.string().max(50).optional(),
  experience: z.string().max(50).optional(),
  team_size: z.string().max(50).optional(),
  founded_year: z.string().max(4).optional(),
  home_venue: z.string().max(200).optional(),
  scout_type: z.string().max(50).optional(),
  scout_team: z.string().max(100).optional(),
  scout_sport: z.string().max(50).optional(),
  team_type: z.string().max(50).optional(),
  dominant_foot: z.string().max(20).optional(),
  latest_club: z.string().max(100).optional(),
  division: z.string().max(50).optional(),
});
